/**
 * Interface to the User model.
 */

// Support output of objects
var util = require('util');


/**
 * Constructor to the UserImportSummary object.
 *
 * @param model
 *   The model of the userImportSummary document.
 */
function UserImportSummary(model) {
  this.docModel = model;
}

/**
 * Converts a timestamp in seconds to a Date object.
 *
 * @param timestamp
 *   Timestamp in seconds.
 */
var convertToDate = function(timestamp) {
  return new Date(timestamp * 1000);
};

/**
 * Create a log document from the supplied values
 *
 * @param req
 *  The request object in a POST callback.
 * @param res
 *  The response object in a POST callback.
 */
UserImportSummary.prototype.post = function(req, res) {
  this.request = req;
  this.response = res;
  var addArgs = {};

  if (this.request.body.logging_timestamp !== undefined) {
    // Convert timestamp string to Date object
    var timestamp = parseInt(this.request.body.logging_timestamp);
    addArgs.logged_date = convertToDate(timestamp);
  }
  if (this.request.body.target_CSV_file !== undefined) {
    addArgs.target_CSV_file = this.request.body.target_CSV_file;
  }
  if (this.request.body.signup_count !== undefined) {
    addArgs.signup_count = this.request.body.signup_count;
  }
  if (this.request.body.skipped !== undefined) {
    addArgs.skipped = this.request.body.skipped;
  }
  if (this.request.query.source !== undefined) {
    addArgs.source = this.request.query.source;
  }
  if (this.request.query.type !== undefined) {
    addArgs.log_type = this.request.query.type;
  }

  var logEntry = new this.docModel(addArgs);
  logEntry.save(function(err) {
    if (err) {
      res.status(500).json(err);
      console.log("500 Error: POST to  /v1/imports/summaries. err response: " + util.inspect(err, false, null));
      return;
    }
    // Added log entry to db
    res.status(201).json("OK");
  });
};

/**
 * Retrieve summary log documents. Example request:
 * /api/v1/imports/summary/2014-09-01/2014-10-01?type=user&exists=1&source=niche.com
 *
 * @param req
 *   The request object in the GET callback.
 * @param res
 *   The response object in the GET callback.
 */
UserImportSummary.prototype.get = function(req, res) {

  if (req.query.origin_start.indexOf('*') > -1) {
    var originCondition = req.query.origin_start;
  }
  else {
    var originCondition = {$gte : req.query.origin_start, $lt : req.query.origin_end};
  }

  var data = {
    request: req,
    response: res
  };
  this.docModel.find( {
    $and : [
      { 'source' : req.query.source },
      { 'target_CSV_file' : originCondition }
    ]},
    function (err, docs) {
      if (err) {
        data.response.send(500, err);
        return;
      }

      if (docs.length == 0) {
        res.status(404).json('OK - No match found for source ' + req.query.source + ' origin_start: gte: ' + req.query.origin_start + ' origin_end lt ' + req.query.origin_end);
      }
      else {
        res.status(200).json(docs);
      }

  }).sort({ target_CSV_file : -1 })
};

/**
 * Delete existing user import summary log documents.
 *
 * @param req
 *   The request object in the DELETE callback.
 * @param res
 *   The response object in the DELETE callback.
 */
UserImportSummary.prototype.delete = function(req, res) {

  this.request = req;
  this.response = res;
  var targetOrigin = this.request.query.origin;
  var deleteArgs = {};

  deleteArgs.source = this.request.query.source;

  if (targetOrigin !== undefined) {
    deleteArgs.target_CSV_file = targetOrigin;
  }

  this.docModel.remove(deleteArgs,
    function(err, num) {

      if (err) {
        console.log('ERROR delete: ' + err);
        res.status(500).json(err);
        return;
      }

      if (num == 0) {
        var message = 'OK - No documents found to delete for target_CSV_file: ' + targetOrigin;
        res.status(404).json(message);
      }
      else {
        var message = 'OK - Deleted ' + num + ' document(s) for origin: ' + targetOrigin;
        res.status(200).json(message);
      }
    }
  );
};

module.exports = UserImportSummary;
