module.exports = (function() {

  var express   = require('express');
  var app       = express();
  var redis     = require('redis');
  var mb_config = rootRequire('config/mb_config.json');
  
  if (app.get('env') == 'development' || app.get('env') == 'test') {
    // To output objects for debugging
    // console.log("/process request: " + util.inspect(request, false, null));
    var util = require('util');
  }
  
  console.log("app.get(env): " + app.get('env'));

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
  
  console.log("redisUri: " + redisUri);
  console.log("redisPort: " + redisPort);

var client = redis.createClient(redisPort, redisUri);
// var client = redis.createClient(redisPort, redisUri, {no_ready_check: true});
// var client = redis.createClient();
  
  client.on('connect', function() {
    console.log('- Redis connected!');
  });
  client.on('error', function() {
      console.log('Unable to connect to the Redis database (%s:%s). Check to make sure the server is running.', redisUri, redisPort);
    process.exit();
  });

  return client;

})();
