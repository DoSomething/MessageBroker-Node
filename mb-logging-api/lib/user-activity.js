/**
 * Interface to the User model.
 */

// Support output of objects
var util = require('util');

/**
 * Constructor to the Log object.
 *
 * @param model
 *   The model of the log document.
 */
function UserActivity(model) {
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
 * Create a log document from the supplied values for a user activity.
 *
 * @param req
 *  The request object in a POST callback.
 * @param res
 *  The response object in a POST callback.
 */
UserActivity.prototype.post = function(req, res) {
  this.request = req;
  this.response = res;
  var addArgs = {};

  // Include parameter values in post
  addArgs.email = this.request.body.email;
  addArgs.source = this.request.body.source.toUpperCase();

  addArgs.activity = this.request.query.type;
  addArgs.activity_details = this.request.body.activity_details;

  if (this.request.body.activity_date !== undefined) {
    addArgs.activity_date = this.request.body.activity_date;
  }
  else {
    addArgs.activity_date = new Date();
  }
  addArgs.logged_date = new Date();

  var logEntry = new this.docModel(addArgs);
  logEntry.save(function(err) {
    if (err) {
      console.log("500 Error: POST to  /v1/user/activity. err response: " + util.inspect(err, false, null));
      res.status(500).json(err);
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
UserActivity.prototype.get = function(req, res) {

  // NOTE: Typically offset and interval would be the same value.
  if (req.param("offset") === undefined) {
    // Default to current date if not set
    var targetStartDate = new Date();
  }
  else {
    var targetStartDate = new Date();
    targetStartDate.setSeconds(targetStartDate.getSeconds() - req.param("offset"));
  }
  if (req.param("interval") === undefined) {
    var targetEndDate = new Date(targetStartDate);
    // Default to one week if not set
    targetEndDate.setSeconds(targetEndDate.getSeconds() - 604800);
  }
  else {
    var targetEndDate = new Date(targetStartDate);
    targetEndDate.setSeconds(targetEndDate.getSeconds() - req.param("interval"));
  }

  var data = {
    request: req,
    response: res
  };
  this.docModel.find( {
    $and : [
      { 'activity_date' : {$gte : targetEndDate, $lte : targetStartDate} },
      { 'source' : req.param("source") },
      { 'activity' : req.param("type") }
    ]},
    function (err, docs) {
      if (err) {
        data.response.send(500, err);
        return;
      }

      if (docs.length == 0) {
        res.status(404).json('OK - No match found for ' + targetEmail);
      }
      else {
        res.status(200).json(docs);
      }
  })
};

module.exports = UserActivity;
