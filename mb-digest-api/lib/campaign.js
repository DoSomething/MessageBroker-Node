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
 * POST campaign details.
 *
 * @param req
 *  The request object in a POST callback.
 * @param res
 *  The response object in a POST callback.
 */
Campaign.prototype.post = function(req, res) {
  this.request = req.body;
  this.response = res;

  var key = "mb-digest-campaign-" + this.request.nid + '-' + this.request.language;
  var markup = this.request.markup;

  // Check to see if the key already exists
  client.exists(key, function(err, reply) {
    if (reply === 1) {
        console.log(key + ' already exists');
        res.send(201, reply);
    } else {

      // Set the value for the key
      client.set(key, markup, function(err, reply) {
        var results = key + ": " + reply;
        console.log(results);
        res.send(201, reply);
      });
    }
  });

  // Expire the key value after one hour, 60 seconds x 60 minutes x 12 hours
  var ttl = 60 * 60 * 12;
  client.expire(key, ttl);
  
};

/**
 * GET a specific campaign by nid (Drupal assigned) and language.
 *
 * @param req
 *   The request object in the GET callback.
 * @param res
 *   The response object in the GET callback.
 */
Campaign.prototype.get = function(req, res) {
  this.request = req.query;
  this.response = res;

  var nid = this.request.nid;
  var language = this.request.language;
  var key = "mb-digest-campaign-" + nid + "-" + language;

  client.get(key, function(err, reply) {
    var results = "- " + key + ": " + reply;
    console.log(results);
    res.send(201, reply);
  });

};

module.exports = Campaign;
