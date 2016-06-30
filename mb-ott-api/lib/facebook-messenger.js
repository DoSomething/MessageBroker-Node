/**
 * Interface to the Facebook Messenger requests.
 */

// Twilio Credentials
var accountSid = '{{ account_sid }}';
var authToken = '[AuthToken]';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

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


  /*

    RE: https://www.twilio.com/docs/api/rest/sending-messages

   // Twilio Credentials
   var accountSid = '{{ account_sid }}';
   var authToken = '[AuthToken]';

   //require the Twilio module and create a REST client
   var client = require('twilio')(accountSid, authToken);

   client.messages.create({
   to: "+16518675309",
   from: "+14158141829",
   body: "Hey Jenny! Good luck on the bar exam!",
   mediaUrl: "http://farm2.static.flickr.com/1075/1404618563_3ed9a44a3a.jpg",
   }, function(err, message) {
   console.log(message.sid);
   });

   */
};


module.exports = FacebookMessenger;
