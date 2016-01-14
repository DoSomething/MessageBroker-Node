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
 * Possible response codes: 201: Created, 304: Already defined.
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
  var markup = this.request.object;

  // Check to see if the key already exists
  client.exists(key, function(err, reply) {
    if (reply === 1) {
        console.log(key + ' already exists');
        res.status(200).json("OK - Key already exists: " + key);
    } else {

      // Set the value for the key
      client.set(key, markup, function(err, reply) {
        res.status(201).json("OK");
      });
    }
  });

  // @todo: store key with list of all mb-digest-campaign keys. Used
  // to gather all cached campaign objects to generate staus report.

  // Expire the key value after 12 hours -> 60 seconds x 60 minutes x 12 hours
  var ttl = 60 * 60 * 12;
  client.expire(key, ttl);
};

/**
 * GET a specific campaign by nid (Drupal assigned) and language.
 *
 * Response codes: 200: Successfully retrieved.
 *
 * @param req
 *   The request object in the GET callback.
 * @param res
 *   The response object in the GET callback.
 */
Campaign.prototype.get = function(req, res) {
  this.request = req.query;
  this.response = res;
  var key = this.request.key;

  client.get(key, function(err, reply) {

    if (reply) {
      var results = {
        key : key,
        value : reply
      };
      res.status(200).json(results);
    }
    else {
      res.status(404).json('OK - Key not found: ' + key );
    }

  });

};

/**
 * Delete campaign document. Example request DELETE:
 * /api/v1/campaign?key=mb-digest-campaign-12345-en
 *
 * @param req
 *   The request object in the GET callback.
 * @param res
 *   The response object in the GET callback.
 */
Campaign.prototype.delete = function(req, res) {

  this.request = req;
  this.response = res;
  var targetKey = this.request.query.key;

  client.del(targetKey, function(err, reply) {
    if (reply) {
      res.status(200).json('OK - Key deleted: ' + targetKey );
    }
    else {
      var message = 'OK - No keys found to delete for key: ' + targetKey;
      res.status(404).json(message);
    }
  });

};

module.exports = Campaign;
