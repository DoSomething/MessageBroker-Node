/**
 * Application routes module. Routes define which objects to instantiate as
 * a result.
 *
 * Mounted on "/api" with: app.use('/api', routes);
 */

module.exports = (function() {

  var express = require('express');
  var app = express();

  var router = express.Router();

  var FacebookMessenger = rootRequire('lib/facebook-messenger');

  if (app.get('env') == 'development' || app.get('env') == 'test') {
    // To output objects for debugging
    // console.log("/process request: " + util.inspect(request, false, null));
    var util = require('util');
  }

  /**
   * GET /api - report basic details about the API
   * GET /api/v1
   */
  router.get('/', function(req, res) {
    res.status(200).json('Message Broker OTT API (mb-ott-api). Available versions: v1 (/api/v1) See https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-ott-api for the related git repository.');
  });
  router.get('/v1', function(req, res) {
    res.status(200).json('Message Broker Logging API (mb-ott-api). Version 1.x.x, see wiki (https://github.com/DoSomething/MessageBroker-Node/wiki/mb-ott-api) for documentation');
  });

  /**
   * POST to /api/v1/ott
   */
  router.route('/v1/ott')

    .post(function(req, res) {
      if (req.query.type === undefined ||
          req.query.exists === undefined ||
          req.query.source === undefined ||
          req.query.origin === undefined ||
          req.query.processed_timestamp === undefined ||
          (  req.body.email === undefined &&
             req.body.phone === undefined &&
             req.body.drupal_uid === undefined)
        ) {
        res.status(400).json('ERROR, missing required value. POST /api/v1/import request. type, exists, source and origin or processed_timestamp not specified or no email, phone or drupal_uid specified.');
      }
      else {

        // Use model based on source
        if (req.query.source.toLowerCase() === 'niche') {
          var facebookMessenger = new FacebookMessenger(model.userImportModel_niche);
          facebookMessenger.post(req, res);
        }
        else {
          console.log('ERROR, POST /api/v1/fb request.');
        }
      }
    });

    return router;

})();
