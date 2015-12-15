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

  if (req.param("start_date") == 0) {
    var targetStartDate = new Date('2014-08-01');
  }
  else {
    var targetStartDate = new Date(req.param("start_date"));
  }
  if (req.param("end_date") == 0) {
    var targetEndDate = new Date();
  }
  else {
    var targetEndDate = new Date(req.param("end_date"));
  }

  var data = {
    request: req,
    response: res
  };
  this.docModel.find( {
    $and : [
      { 'logged_date' : {$gte : targetStartDate, $lte : targetEndDate} },
      { 'source' : req.query.source }
    ]},
    function (err, docs) {
      if (err) {
        data.response.status(500).json(err);
        console.log('500 Error: GET to /v1/imports/summaries');
        return;
      }

      // Send results
      data.response.status(200).json(docs);

  }).sort({ target_CSV_file : -1 })
};

module.exports = UserImportSummary;
