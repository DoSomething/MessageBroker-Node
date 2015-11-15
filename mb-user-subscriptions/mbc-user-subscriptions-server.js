// mbc-user-subscriptions-server.js

var express = require('express'),
    exphbs  = require('express-handlebars'),
    bodyParser = require('body-parser'),
    userDetails = require('./lib/userDetails'),
    security = require('./lib/security');

var app = express();

if (app.get('env') == 'development') {
  // To output objects for debugging
  // console.log("/process request: " + util.inspect(request, false, null));
  var util = require('util');
}

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/@dosomething/forge/dist'));

// Setup handlebars as vew engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Look for test flag to trigger unit tests
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
})

/**
 * Callback path "/"
 *
 * A landing page for users to administer their subscription preferences. The
 * "email" and "key" URL parameter values passed in the link the user clicked to
 * access the page are validated before displaying a form listing the users
 * current subscription preferences. The form can be submitted to
 * update the users preferences which will be referenced by all Message Broker
 * email generation activities.
 */
app.get('/', function(req, res, next) {

  if (!req.query.targetEmail) {
    res.render('home', { "error": "Huh?!? No targetEmail specified!"});
  }
  else {

    // Gather user subscription details based on targetEmail
    var targetEmail = req.query.targetEmail;
    var targetKey = req.query.key;
    userDetails.getDetails(targetEmail,
      function callbackRes(returnUserDetails) {

        if (returnUserDetails.error !== undefined) {
          res.render('home', {
            "error": returnUserDetails.error
          });
        }
        else if (targetKey === undefined) {
          res.render('home', {
            "error": "WTF, invalid access!"
          });
        }
        else {

          var submittedParams = {
            'submittedKey': targetKey,
            'targetEmail': targetEmail,
            'drupalUID': returnUserDetails.drupal_uid
          };
          security.validateKey(submittedParams,
            function (params) {

              if (params.status === false) {
                res.render('home', {
                  "error": params.error
                });
              }
              else {

                var subscriptions = {};
                if (returnUserDetails.subscriptions) {

                  // Control checkbox state by possible setting or missing setting
                  userDetails.formatSubscriptions(returnUserDetails,
                    function callbackRes(returnSubscriptions) {

                      for (var subscription in returnSubscriptions) {
                        if (returnSubscriptions[subscription]  === true) {
                          returnSubscriptions[subscription] = 'checked';
                        }
                        else {
                          returnSubscriptions[subscription] = '';
                        }
                      }

                      res.render('home', {
                        "target_email": targetEmail,
                        "subscriptions_mailchimp" : returnSubscriptions.mailchimp,
                        "subscriptions_user_events": returnSubscriptions.user_events,
                        "subscriptions_digest": returnSubscriptions.digest,
                        "subscriptions_banned": returnSubscriptions.banned,
                        "key": targetKey
                      });

                    }
                  );

                }

              }
            }
          );

        }
      }
    );

  }

});

/**
 * Callback path "/process"
 *
 * Process the updated user subscription settings based on their interaction
 * with a form that listted their current subscription preferences.
 */
app.post('/process', function(req, res) {

  var targetEmail = req.body.targetEmail;
  userDetails.getDetails(targetEmail,
    function(getDetailsResponse) {

      // Confirm POSTed key validates to allow updating the user subscription
      // preferences
      var submittedParams = {
        'submittedKey': req.body.key,
        'targetEmail': targetEmail,
        'drupalUID': getDetailsResponse.drupal_uid
      };

      security.validateKey(submittedParams,
        function(validateKeyResponse) {

          if (validateKeyResponse.status === false) {
            res.render('home', {
              "error": validateKeyResponse.error
            });
          }
          else {

            // Unchecked checkboxes submit an "undefined" value, adjust submitted
            // values to boolean to reflect actual user input
            var submittedSubscriptions = {
              'subscriptions': {
                'mailchimp': req.body.mailchimp === undefined ? false : true,
                'preStateMailchimp': req.body.preStateMailchimp == 'checked' ? true : false,
                'user_events': req.body.user_events === undefined ? false : true,
                'digest': req.body.digest === undefined ? false : true
              }
            };

            // Control checkbox state by possible setting or missing setting
            userDetails.formatSubscriptions(submittedSubscriptions,
              function(formattedSubscriptionsResponse) {

                // Update MailChimp with subscription setting change
                if (formattedSubscriptionsResponse.preStateMailchimp != formattedSubscriptionsResponse.mailchimp) {

                  var mailchimpSubscriptionSettings = {
                    'email': targetEmail,
                    'mailchimpSubscription': formattedSubscriptionsResponse.mailchimp
                  }

                  userDetails.postMailChimp(mailchimpSubscriptionSettings,
                    function(mailchimpResults) {

                      if (typeof mailchimpResults.error != 'undefined' && mailchimpResults.error === true) {
                        res.render('home', {
                          "error": mailchimpResults.error
                        });
                      }

                    }
                  );

                }

                // Submit updated subscription settings to mb-user-api
                var request = {
                "targetEmail": targetEmail,
                  "subscriptions": formattedSubscriptionsResponse
                }

                userDetails.postDetails(request,
                  function(postDetailsResults) {

                    if (typeof postDetailsResults != 'undefined' && postDetailsResults.status === false) {
                      res.render('home', {
                        "error": postDetailsResults.error
                      });
                    }
                    else {

                      // Inform the user that their subscription settings have been
                      // updated.
                      res.redirect(303, '/thank-you');

                    }

                  }
                );

              }
            );

          }

        }
      );

    }
  );

});

/*
 * Callback path "/thank-you"
 *
 * A "thank you" page to confirm to the user that their subscriptions settings
 * have been update.
 */
app.get('/thank-you', function(req, res, next) {
  res.render('thank-you');
});

/**
 * Custom 404 page
 */
app.use(function(req, res) {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found!');
});

/**
 * Custom 500 page
 */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});


/**
 * KICKOFF!
 */
app.listen(app.get('port'), function() {
  console.log('mbc-user-subscriptions-server.js - Express started in ' + app.get('env') + ' mode on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});
