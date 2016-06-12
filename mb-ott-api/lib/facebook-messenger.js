/**
 * Interface to the Facebook Messenger requests.
 */

// Support output of objects
var util = require('util');

/**
 * Constructor to the Log object.
 *
 * @param model
 *   The model of the log document.
 */
function FacebookMessenger() {

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
 * Respond to message POST.
 *
 * @param req
 *  The request object in a POST callback.
 * @param res
 *  The response object in a POST callback.
 */
FacebookMessenger.prototype.post = function(req, res) {

  this.request = req;
  this.response = res;
  var messageArgs = {};

  // Include parameter values in post
  messageArgs.from = this.request.body.from;
  messageArgs.message = this.request.query.type;


  // Message received
  res.status(200).json("OK");
};


module.exports = FacebookMessenger;
