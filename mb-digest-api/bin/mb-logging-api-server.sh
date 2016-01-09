#!/usr/bin/env node

var app = require('./../mb-digest-api-server');
var mb_config = require(__dirname + './../config/mb_config.json');

/**
 * Start server.
 */
var port = process.env.MB_DIGEST_API_PORT || mb_config.default.port;
app.listen(port, function() {
  console.log('Message Broker Digest API server listening on port %d in %s mode.', port, app.settings.env);
});
