module.exports = (function() {

  var express   = require('express');
  var app       = express();
  var redis     = require('redis');
  var mb_config = require('config/mb_config.json');
  
  if (app.get('env') == 'development') {
    // To output objects for debugging
    // console.log("/process request: " + util.inspect(request, false, null));
    var util = require('util');
  }

  // Redis
  // =============================================================================
  // All configurations related to the mb-digest Redis database.
  if (app.get('env') == 'production') {
    var redisUri = mb_config.redis.production.uri;
    var redisPort = mb_config.redis.production.port;
  }
  else {
    var redisUri = mb_config.redis.development.uri;
    var redisPort = mb_config.redis.development.port;
  }
  var client = redis.createClient(redisPort, redisUri);
  client.on('connect', function() {
    console.log('- Redis connected!');
  });

  return client;

})();
