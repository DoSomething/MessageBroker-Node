/**
 * Interface to the Campaign Redis model.
 */
var util   = require('util');
var redis  = require('redis');
var client = redis.createClient();

/**
 * Constructor to the Campaign object.
 *
 * @param model
 *   The model of the redis connection.
 */
function Campaign(model) {
  this.docModel = model;
}

/**
 * ??
 *
 * @param req
 *  The request object in a POST callback.
 * @param res
 *  The response object in a POST callback.
 */
Campaign.prototype.post = function(req, res) {
  this.request = req.body;
  this.response = res;
  var key = this.request.nid + '-' + this.request.language
  
  // Check to see if the key already exists
  client.exists(key, function(err, reply) {
    if (reply === 1) {
        console.log(key + ' already exists');
        res.send(201, reply);
    } else {

      // Set the value for the key
      client.set(key, this.request.value, function(err, reply) {
        var results = key + ": " + reply;
        console.log(results);
        res.send(201, reply);
      });
    }
  });

  // Expire the key value after one hour, 60 seconds x 60 minutes
  var ttl = 60 * 60;
  client.expire(key, ttl);
  
};

/**
 * ??
 *
 * @param req
 *   The request object in the GET callback.
 * @param res
 *   The response object in the GET callback.
 */
Campaign.prototype.get = function(req, res) {
  this.request = req.body;
  this.response = res;

  client.get(this.request.key, function(err, reply) {
    var results = key + ": " + reply;
    console.log(results);
    res.send(201, reply);
  });

};

module.exports = Campaign;
