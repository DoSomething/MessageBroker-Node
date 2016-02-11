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

  var UserImport = rootRequire('lib/user-import');
  var UserImportSummary = rootRequire('lib/user-import-summary');
  var UserActivity = rootRequire('lib/user-activity');
  var UserTransactional = rootRequire('lib/user-transactional');

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
    res.status(200).json('Message Broker Logging API (mb-logging-api). Available versions: v1 (/api/v1) See https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-logging-api for the related git repository.');
  });
  router.get('/v1', function(req, res) {
    res.status(200).json('Message Broker Logging API (mb-logging-api). Version 1.x.x, see wiki (https://github.com/DoSomething/MessageBroker-Node/wiki/mb-logging-api) for documentation');
  });

  /**
   * POST to /api/v1/imports
   *
   * @param type string
   *   ex. &type=user : The type of import, helps to define what collection the
   *   POST is added to.
   *
   * @param exists integer
   *   &exists=1 : Flag to log entries of existing Drupal, Mailchimp and Mobile
   *   Commons users in the userImportModel.
   *
   * @param source string
   *   &source=niche : Unique name to identify the source of the import data.
   */
  router.route('/v1/imports')

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
          var userImport = new UserImport(model.userImportModel_niche);
          userImport.post(req, res);
        }
        else if (req.query.source.toLowerCase() === 'afterschool') {
          var userImport = new UserImport(model.userImportModel_afterschool);
          userImport.post(req, res);
        }
        else if (req.query.source.toLowerCase() === 'hercampus') {
          var userImport = new UserImport(model.userImportModel_hercampus);
          userImport.post(req, res);
        }
        else if (req.query.source.toLowerCase() === 'att-ichannel') {
          var userImport = new UserImport(model.userImportModel_att_ichannel);
          userImport.post(req, res);
        }
        else if (req.query.source.toLowerCase() === 'teenlife') {
          var userImport = new UserImport(model.userImportModel_teenlife);
          userImport.post(req, res);
        }
        else {
          console.log('ERROR, POST /api/v1/imports request. Invalid source: ' + req.query.source);
          res.status(400).json('ERROR, invalid required value. POST /api/v1/import request. source: ' + req.query.source.toLowerCase() + ' is not supported.');
        }
      }
    })

    /**
     * GET ?type=user_import&source=teenlife&origin=TeenLife-12-12-15.csv
     */
    .get(function(req, res) {
      if (req.query.type === undefined ||
          req.query.source === undefined ||
          req.query.origin === undefined) {
        res.status(400).json('ERROR, missing required values. GET /api/v1/import, type, source and origin not specified.');
      }
      else {
        if (req.query.source.toLowerCase() === 'niche') {
          var userImport = new UserImport(model.userImportModel_niche);
          userImport.get(req, res);
        }
        else if (req.query.source.toLowerCase() === 'afterschool') {
          var userImport = new UserImport(model.userImportModel_hercampus);
          userImport.get(req, res);
        }
        else if (req.query.source.toLowerCase() === 'hercampus') {
          var userImport = new UserImport(model.userImportModel_hercampus);
          userImport.get(req, res);
        }
        else if (req.query.source.toLowerCase() === 'att-ichannel') {
          var userImport = new UserImport(model.userImportModel_att_ichannel);
          userImport.get(req, res);
        }
        else if (req.query.source.toLowerCase() === 'teenlife') {
          var userImport = new UserImport(model.userImportModel_teenlife);
          userImport.get(req, res);
        }
        else {
          console.log('ERROR, GET /api/v1/imports request. Invalid source: ' + req.query.source);
          res.status(400).json('ERROR, invalid required value. GET /api/v1/import request. source: ' + req.query.source.toLowerCase() + ' is not supported.');
        }
      }
    })

    .delete(function(req, res) {

      if (req.query.type === undefined ||
          req.query.source === undefined ||
          req.query.origin === undefined) {
        res.status(400).json('ERROR, missing required value. DELETE /api/v1/imports request type, source and origin not specified.');
      }
      else {
        if (req.query.source.toLowerCase() === 'niche') {
          var userImport = new UserImport(model.userImportModel_niche);
          userImport.delete(req, res);
        }
        else if (req.query.source.toLowerCase() === 'afterschool') {
          var userImport = new UserImport(model.userImportModel_afterschool);
          userImport.delete(req, res);
        }
        else if (req.query.source.toLowerCase() === 'hercampus') {
          var userImport = new UserImport(model.userImportModel_hercampus);
          userImport.delete(req, res);
        }
        else if (req.query.source.toLowerCase() === 'att-ichannel') {
          var userImport = new UserImport(model.userImportModel_att_ichannel);
          userImport.delete(req, res);
        }
        else if (req.query.source.toLowerCase() === 'teenlife') {
          var userImport = new UserImport(model.userImportModel_teenlife);
          userImport.delete(req, res);
        }
        else {
          console.log('ERROR, DELETE /api/v1/imports request. Invalid source: ' + req.query.source);
          res.status(400).json('ERROR, invalid required value. DELETE /api/v1/import request. source: ' + req.query.source.toLowerCase() + ' is not supported.');
        }
      }

    });

    /**
     * @todo:
     *
     * GET
     * router.route('/v1/imports:start_processed_date')
     * router.route('/v1/imports:start_processed_date/:end_processed_date')
     *
     * var start_processed_date = req.params.start_processed_date
     *
     * Parameterized Routes in Express.js
     * https://www.safaribooksonline.com/blog/2014/03/13/
     *   parameterized-routes-express-js/
     */
  
  /**
   * POST to /api/v1/imports/summaries
   *
   * @param type string
   *   ex. &type=user : The type of import.
   *
   * @param source string
   *   &source=niche.com : Unique name to identify the source of the import data.
   */
  router.route('/v1/imports/summaries')

    .post(function(req, res) {
      if (req.query.type === undefined ||
        req.query.source === undefined ||
        req.body.target_CSV_file === undefined ||
        req.body.signup_count === undefined ||
        req.body.skipped === undefined) {
        res.status(400).json('ERROR, missing required value. POST /api/v1/imports/summaries request. Type or source not specified or no target CSV file, signup count and skipped values specified.');
      }
      else {
        var userImportSummary = new UserImportSummary(model.importSummaryModel);
        userImportSummary.post(req, res);
      }
    })

    /**
     * GET ?type=user_import&source=teenlife&origin=TeenLife-12-12-15.csv
     */
    .get(function(req, res) {
      if (req.query.type === undefined ||
          req.query.source === undefined) {
        res.status(400).json('ERROR, missing required value. GET /v1/imports/summaries request: type or source not specified.');
      }
      else {
        var userImportSummary = new UserImportSummary(model.importSummaryModel);
        userImportSummary.get(req, res);
      }

    })

    .delete(function(req, res) {

      if (req.query.type === undefined ||
          req.query.source === undefined ||
          req.query.origin === undefined) {
        res.status(400).json('ERROR, missing required value. DELETE /v1/imports/summaries request: type, source and origin not specified.');
      }
      else {
        var userImportSummary = new UserImportSummary(model.importSummaryModel);
        userImportSummary.delete(req, res);
      }

    }
  );

  /**
   * POST to /v1/user/activity
   *   Required parameter:
   *     - type: The type of activity to log. Currently only "vote" is supported.
   *
   *   POST values:
   *     - email
   *     - source
   *     - activity
   *
   * GET to /v1/user/activity
   *   Optional parameters:
   *     - type: The type of activity log.
   *     - source: What application produced the log entry.
   *     - offset: The time (in seconds) to offset from the current time.
   *     - interval: The length of time from the offset to request a group of log
   *         entries.
   *
   *     If none of the optional parameters are applied the request will return
   *     all of the existing log entries.
   *
   * DELETE to /v1/user/activity
   *   Required parameter:
   *     - email
   *     - type: The type of activity log.
   *     - source: What application produced the log entry.
   */
  router.route('/v1/user/activity')
  
    .post(function(req, res) {
      if (req.query.type != 'vote') {
        res.status(400).json('ERROR, missing required value. POST /api/v1/user/activity request. Type not supported activity: ' + req.body.type);
      }
      else if (req.body.email === undefined ||
               req.body.source === undefined ||
               req.body.activity_details === undefined
      ) {
        res.status(400).json('ERROR, missing required value. POST /api/v1/user/activity request. email, source  or activity_details undefined.');
      }
      else {
        var userActivity = new UserActivity(model.userActivityModel);
        userActivity.post(req, res);
      }
    })
  
    .get(function(req, res) {
      if (req.query.type === undefined &&
          req.query.source === undefined) {
        res.status(400).json('ERROR, missing required value. GET /api/v1/user/activity request: type or source not defined. ');
      }
      else {
        var userActivity = new UserActivity(model.userActivityModel);
        userActivity.get(req, res);
      }
    })

    .delete(function(req, res) {
      if (req.query.email === undefined ||
          req.query.type === undefined ||
          req.query.source === undefined) {
        res.status(400).json('ERROR, missing required value. DELETE /api/v1/user/activity request: email, type or source not defined.');
      }
      else {
        var userActivity = new UserActivity(model.userActivityModel);
        userActivity.delete(req, res);
      }
    });

  /**
   * POST to /v1/user/transactional
   *   Required parameters:
   *     - email: The unique email address of the transactional message request
   *     - activity: One of "user_registration", "user_password", campaign_signup" or "campaign_reportback".
   *
   *   POST values:
   *     - source
   *     - activity_timestamp
   *     - message
   *     - mobile (optional)
   *
   * GET to /v1/user/transactional
   *   Required parameter:
   *     - email
   *
   * DELETE to /v1/user/transactional
   *   Required parameter:
   *     - email
   */
  router.route('/v1/user/transactional')

    .post(function(req, res) {
      if (req.query.email === undefined ||
          req.query.activity === undefined ||
          req.body.source === undefined ||
          req.body.message === undefined) {
        res.status(400).json('ERROR, missing required value. POST /api/v1/user/transactional request. email, activity, source or message not specified.');
      }
      else {
        var userTransactional = new UserTransactional(model.userTransactionalModel);
        userTransactional.post(req, res);
      }
    })

    .get(function(req, res) {
      if (req.query.email === undefined) {
        res.status(400).json('ERROR, missing required value. GET /api/v1/user/transactional request, email not defined. ');
      }
      else {
        var userTransactional = new UserTransactional(model.userTransactionalModel);
        userTransactional.get(req, res)
      }
    })

    .delete(function(req, res) {
      if (req.query.email === undefined) {
        res.status(400).json('ERROR, missing required value. DELETE /api/v1/user/transactional request, email not defined.');
      }
      else {
        var userTransactional = new UserTransactional(model.userTransactionalModel);
        userTransactional.delete(req, res);
      }
    });

    return router;

})();
