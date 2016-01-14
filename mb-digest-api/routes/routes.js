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
  var model = rootRequire('model/model');

  var Campaign = rootRequire('lib/campaign');

  if (app.get('env') == 'development') {
    // To output objects for debugging
    // console.log("/process request: " + util.inspect(request, false, null));
    var util = require('util');
  }

  /**
   * GET /api - report basic details about the API
   * GET /api/v1
   *
   * Respond with 400 Bad Request when requirements do not pass.
   * - http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
   */
  router.get('/', function(req, res) {
    res.status(200).json('Message Broker Digest API (mb-digest-api). Available versions: v1 (/api/v1) See https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-digest-api for the related git repository.');
  });
  router.get('/v1', function(req, res) {
    res.status(200).json('Message Broker Digest API (mb-digest-api). Version 1.x.x, see wiki (https://github.com/DoSomething/MessageBroker-Node/wiki) for documentation');
  });
  
  /**
   * POST to /v1/campaign
   *   POST values:
   *     - key string (mb-digest-campaign-<id>-<langauge>
   *     - value string (HTML markup)
   *
   * GET to /v1/campaign
   *   Required parameter:
   *     - id: The id of the desired campaign. The id value is defined in the Drupal app for each campaign node.
   *
   * Respond with 400 Bad Request when requirements do not pass.
   */
  router.route('/v1/campaign')
  
    .post(function(req, res) {
      if (req.body.nid === undefined || req.body.language === undefined || req.body.object === undefined) {
        res.status(400).json('ERROR, missing required value. POST /api/v1/campaign request. nid, language or object not defined.');
      }
      else {
        var campaign = new Campaign(model);
        campaign.post(req, res);
      }
    })
  
    .get(function(req, res) {
      if (req.query.key === undefined) {
        res.status(400).json('GET /api/v1/campaign key not defined. ');
      }
      else {
        var campaign = new Campaign(model);
        campaign.get(req, res);
      }
    })

    .delete(function(req, res) {
      if (req.query.key === undefined) {
        res.status(400).json('DELETE /api/v1/campaign key not defined. ');
      }
      else {
        var campaign = new Campaign(model);
        campaign.delete(req, res);
      }
    });
    
    return router;
    
})();
