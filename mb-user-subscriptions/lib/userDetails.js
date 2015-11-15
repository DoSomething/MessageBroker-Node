/**
 * userDetails.js
 *
 * Collect of utilities related to user information for
 * the mbc-user-subscriptions.
 */
var http = require('http'),
    express = require('express'),
    qs = require('qs'),
    mb_config = require('../config/mb_config.json'),
    mcapi = require('mailchimp-api');

var app = express();
var mc = new mcapi.Mailchimp(mb_config.mailchimp.key);

if (app.get('env') == 'development') {
  // To output objects for debugging
  // console.log("/process request: " + util.inspect(request, false, null));
  var util = require('util');
}



module.exports = {

  /**
   * GET details about a user based on a target email address.
   *
   * Collect details from the mb-user database via mb-user-api. User is identified
   * based on a targetEmail (req) address.
   */
  getDetails: function(req, callbackRes) {

    var options = {
      hostname: "localhost",
      path: "/user?email=" + encodeURIComponent(req),
      port: "4722",
      method: "GET"
    };

    callback = function(response) {

      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('error', function() {
        console.log('Error making http GET request to ' + options.hostname + ':' + options.port + options.path + "\n");
        callbackRes({"error": 'http GET request failed.'});
      });
      response.on('end', function() {
        if (data.length) {
          data = JSON.parse(data);

          // Default to subscribed to everything if no value found
          if (data.subscriptions === undefined) {
            data.subscriptions = {
              mailchimp: true,
              user_events: true,
              digest: true,
              banned: false
            };
          }

          var params = {
            "email": data.email,
            "drupal_uid": data.drupal_uid,
            "key": req.key,
            "subscriptions": data.subscriptions
          };
          callbackRes(params);
        }
        else {
          console.log(options.hostname + ':' + options.port + options.path + " No results found." + "\n");
          callbackRes({"error": "Dang, " + req + " doesn't seem to have an account."});
        }
      });

    }

    http.request(options, callback).end();
  },

  /**
   * POST user subscription preferences to mb-user-api
   */
  postDetails: function(request, callbackRes) {

    // Build the post string from an object
    var postData = qs.stringify({
      'email' : decodeURIComponent(request.targetEmail),
      'subscriptions': {
        'mailchimp': request.subscriptions.mailchimp,
        'user_events': request.subscriptions.user_events,
        'digest': request.subscriptions.digest,
        'banned': request.subscriptions.banned
      }
    });

    var postOptions = {
      host: "localhost",
      port: "4722",
      path: "/user",
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
      }
    };

    // Set up the request
    var postReq = http.request(postOptions, function(res) {
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
    });

    // post the data
    postReq.write(postData);
    postReq.end();

    callbackRes();
  },

  /**
   * POST user subscription preferences to MailChimp API
   * http://stackoverflow.com/questions/23672815/node-mailchimp-npm-how-to-add-subscriber-and-include-first-and-last-name
   */
  postMailChimp: function(mailchimpSubscriptionSettings, callbackRes) {

    if (mailchimpSubscriptionSettings.mailchimpSubscription === true) {

      var mcReq = {
        'id': mb_config.mailchimp.dosomething_members_list_id,
        'email': {
          'email' : mailchimpSubscriptionSettings.email
        },
        'double_optin': false,
        'update_existing': true,
        'replace_interests': false
      }

      mc.lists.subscribe(mcReq, function(data) {
        console.log("lists/subscribe: success!");
        callbackRes(true);
      },
      function(error) {
        console.log("lists/subscribe error: " + util.inspect(error, false, null));
        callbackRes(error);
      });

    }
    else {

      var mcReq = {
        'id': mb_config.mailchimp.dosomething_members_list_id,
        'email': {
          'email' : mailchimpSubscriptionSettings.email
        },
        'delete_member': false,
        'send_goodbye': false,
        'send_notify': false
      }
      mc.lists.unsubscribe(mcReq, function(data) {
        console.log("lists/unsubscribe: success!");
        callbackRes(true);
      },
      function(error) {
        console.log("lists/unsubscribe error: " + util.inspect(error, false, null));
        callbackRes(false);
      });

    }

  },

  /**
   * Submission formatting
   *
   * Logic to ensure consistant subsc riptions submission value sent to
   * mb-user-api.
   */
  formatSubscriptions: function(request, callbackRes) {

    var subscriptions = {};
    // Establish MailChimp existing setting to watch for change resulting in subscribe vs unsubscribe API request
    if (request.subscriptions.preStateMailchimp == true || request.subscriptions.preStateMailchimp === undefined) {
      subscriptions.preStateMailchimp = true;
    }
    else {
      subscriptions.preStateMailchimp = false;
    }
    // Control checkbox state by possible setting or missing setting
    if (request.subscriptions.mailchimp == true || request.subscriptions.mailchimp === undefined) {
      subscriptions.mailchimp = true;
    }
    else {
      subscriptions.mailchimp = false;
    }
    if (request.subscriptions.user_events == true || request.subscriptions.user_events === undefined) {
      subscriptions.user_events = true;
    }
    else {
      subscriptions.user_events = false;
    }
    if (request.subscriptions.digest == true || request.subscriptions.digest === undefined) {
      subscriptions.digest = true;
    }
    else {
      subscriptions.digest = false;
    }

    if (request.subscriptions.banned !== undefined && request.subscriptions.banned === true) {
      subscriptions.banned = true;
    }
    else {
      subscriptions.banned = false;
    }

    callbackRes(subscriptions);
  }

};
