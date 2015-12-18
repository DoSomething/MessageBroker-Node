/**
 * Interface to the User Transactional model.
 */

// Support output of objects
var util = require('util');

/**
 * Constructor to the Log object.
 *
 * @param model
 *   The model of the log document.
 */
function UserTransactional(model) {
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
 * Create a log document from the supplied values for a user transactional.
 *
 * @param req
 *  The request object in a POST callback.
 * @param res
 *  The response object in a POST callback.
 */
UserTransactional.prototype.post = function(req, res) {

  this.request = req;
  this.response = res;
  var addArgs = {};

  // Required
  addArgs.email = this.request.query.email;
  addArgs.activity = this.request.query.activity;
  addArgs.logged_date = new Date();

  // Optional
  if (this.request.body.activity_timestamp !== undefined) {
    // Convert timestamp string to Date object
    var timestamp = parseInt(this.request.body.activity_timestamp);
    addArgs.activity_date = convertToDate(timestamp);
  }
  if (this.request.body.mobile !== undefined) {
    addArgs.mobile = this.request.body.mobile;
  }
  if (this.request.body.message !== undefined) {
    addArgs.activity_details = this.request.body.message;
  }

  var logEntry = new this.docModel(addArgs);
  logEntry.save(function(err) {
    if (err) {
      res.status(500).json(err);
      console.log("500 Error: POST to  /v1/user/transactional. err response: " + util.inspect(err, false, null));
      return;
    }

    // Added log entry to db
    res.status(201).json("OK");
  });
};

/**
 * Retrieve existing user activity log documents. Example request GET:
 * /api/v1/user/activity?type=vote&&source=AGG&offset=300&interval=300
 *
 * @param req
 *   The request object in the GET callback.
 * @param res
 *   The response object in the GET callback.
 */
UserTransactional.prototype.get = function(req, res) {

};

module.exports = UserTransactional;
