var request = require('supertest');
var app = require('./mb-logging-api-server');

request(app)
  .get('/')
  .expect(200)
  .end(function(error) {
    if (error) throw error;
    console.log('Done');
  });