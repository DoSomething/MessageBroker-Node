/**
 * security.js
 *
 * Utilities related to security for the mbc-user-subscriptions application..
 */

var express = require('express'),
    md5 = require('MD5'),
    moment = require('moment');

var app = express();

if (app.get('env') == 'development') {
  // To output objects for debugging
  // console.log("/process request: " + util.inspect(request, false, null));
  var util = require('util');
}

module.exports = {

  /**
   * Collect details from the mb-user database via mb-user-api. User is identified
   * based on a targetEmail (req) address.
   */
  validateKey: function(req, callbackRes) {

    // Loop through next six dates, generate md5 key to test if valid submission
    var submittedKey = req.submittedKey;

    var targetDate = moment().format('YYYY-MM-DD');

    for (var i = 0; i <= 30; i++) {
      var keyData = encodeURIComponent(req.targetEmail) + ', ' + req.drupalUID + ', ' + targetDate;
      var targetKey = md5(keyData);

      // Output key values in dev enviroment
      if (app.get('env') == 'development') {
        console.log("submittedKey: " + submittedKey);
        console.log("keyData: " + keyData);
        console.log("targetKey: " + targetKey);
      }

      if (submittedKey == targetKey) {
        return callbackRes({"status": true});
      }
      targetDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
    }

    callbackRes({
      "status": false,
      "error": "Access denied, perhaps an old link (older than 30 days) was used to access this page?"
    });
  }
}
