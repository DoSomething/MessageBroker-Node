/**
 * mb-digest-api-server.js
 *
 * An application to provide endpoints for http (API) access to the mb-digest
 * database (Redis). Details of the endpoints can be found in the README.md file.
 */

/**
 * Utility to provide reference to the root of the application. Used by files
 * in subdirectories to reference other files within the application directory
 * structure.
 *
 * Reference: https://gist.github.com/branneman/8048520#7-the-wrapper
 */
global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
}

/**
 * Modules used by the application. Installed in node_modules via "npm install"
 * as defined in package.json.
 */
var express           = require('express');
var bodyParser        = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');
var fs                = require('fs');
var morgan            = require('morgan');

// Define routes and related modules to call when requests are made to
// the route.
var routes = require('./routes/routes');

// Express Setup
var app = express();

// LOGGING
// =============================================================================
// ensure log directory exists
var logDirectory = __dirname + '/logs';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});

// configure app to use bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Toggle tools and logging based on enviroment setting
if (app.get('env') == 'development' || app.get('env') == 'test') {
  // To output objects for debugging
  // console.log("/ request: " + util.inspect(request, false, null));
  var util = require('util');
  app.use(morgan('dev', {stream: accessLogStream}));
}
else if (app.get('env') == 'production') {
  app.use(morgan('common', {
    skip: function(req, res) { return res.statusCode < 400 },
    stream: accessLogStream
  }));
}

// REGISTER ROUTES
// =============================================================================
// All of routes will be prefixed with /api
app.use('/api', routes);

// APP AS MODULE
// =============================================================================
// Assign to module to allow testing vs binding to a port - via
// $ npm tests
// vs
// $ bin/mb-logging-api-server.
module.exports = app;
