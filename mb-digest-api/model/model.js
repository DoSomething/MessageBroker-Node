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
    var redisUri = mb_config.redis.production.host;
    var redisPort = mb_config.redis.production.port;
  }
  else if (app.get('env') == 'test') {
    var redisUri = mb_config.redis.test.host;
    var redisPort = mb_config.redis.test.port;
  }
  else {
    var redisUri = mb_config.redis.development.host;
    var redisPort = mb_config.redis.development.port;
  }

  var client = redis.createClient(redisPort, redisUri);
  client.on('connect', function() {
    console.log('- Redis connected!');
  });
  client.on('error', function() {
      console.log('Unable to connect to the Redis database (%s). Check to make sure the server is running.', mongoUri);
    process.exit();
  });

  return client;

})();
