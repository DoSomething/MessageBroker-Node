/**
 * Test for mb-logging-api
 *
 * References:
 *   - HOW TO BUILD AND TEST YOUR REST API WITH NODE.JS, EXPRESS AND MOCHA
 *     https://thewayofcode.wordpress.com/tag/supertest
 *
 *   - Shpuld Library
 *     https://www.npmjs.com/package/should
 */

var request = require('supertest');
var app = require('./mb-logging-api-server');

describe('Requests to the root (/api) path', function() {

  it('GET: Returns a 200 status code', function(done) {

    request(app)
      .get('/api')
      .expect(200, done);
  });

  it('GET: Returns JSON format', function(done) {

    request(app)
      .get('/api')
      .expect('content-type', 'application/json', done);
  });

});

describe('Requests to v1 root (/api/v1) path', function() {

  it('GET: Returns a 200 status code', function(done) {

    request(app)
      .get('/api/v1')
      .expect(200, done);
  });

  it('GET: Returns JSON format', function(done) {

    request(app)
      .get('/api/v1')
      .expect('content-type', 'application/json', done);
  });

});

describe('Requests to v1 imports (/api/v1/imports) path', function() {

  it('POST: Returns a 400 status code when required parameters "type", "exists", "source", "origin", "processed_timestamp" and "email" OR "phone" or "drupal_uid" are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect(400, done);
  });

  it('POST: Returns JSON format', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect('content-type', 'application/json', done);
  });

  /**
   * Future test: POST to /api/v1/imports with the following parameters
   * source=teenlife&exists=1&origin=TeenLife-12-12-15.csv&processed_timestamp=1425767744&type=user_import
   *
   * and the following body:
   * var importEvent = {
   *   "logging_timestamp": "1410285144",
   *   "phone": "2345678901",
   *   "phone_status": "Still a phone number",
   *   "email": "test4@test.com",
   *   "email_status": "We got this one too.",
   *    "email_acquired_timestamp": "1310285144",
   *    "drupal_uid": "23456789",
   *    "drupal_email": "test4@test.com"
   * };
   *
   * request(app)
   *   .post('/api/v1/imports')
   *   .send(importEvent)
   *
   * NOTE: Consider using "should" library. Note Express 3 example:
   *   .end(function(err, res) {
   *     if (err) {
   *       throw err;
   *     }
   *     // this is should.js syntax, very clear
   *    res.should.have.status(400);
   *      done();
   *     });
   */

  it('POST: Addition of import log entry returns 201 response code.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect(201, done);
  });

  it('POST: Returns JSON format', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect('content-type', 'application/json', done);
  });

});

describe('Requests to v1 imports (/api/v1/imports/summaries) path', function() {

  it('POST: Returns a 400 status code when required parameters "type", "source", "target_CSV_file", "signup_count" and "skipped" are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports/summaries')
      .expect(400, done);
  });

  it('POST: Returns JSON format', function(done) {

    request(app)
      .post('/api/v1/imports/summaries')
      .expect('content-type', 'application/json', done);
  });

});

describe('Requests to v1 imports (/api/v1/user/activity) path', function() {

  it('POST: Returns a 400 status code when required parameter "vote" is not defined.', function(done) {

    request(app)
      .post('/api/v1/user/activity')
      .expect(400, done);
  });

  it('POST: Returns JSON format', function(done) {

    request(app)
      .post('/api/v1/user/activity')
      .expect('content-type', 'application/json', done);
  });

  it('GET: Returns a 400 status code when required parameter "type" and "source" are not defined.', function(done) {

    request(app)
      .get('/api/v1/user/activity')
      .expect(400, done);
  });

  it('GET: Returns JSON format', function(done) {

    request(app)
      .get('/api/v1/user/activity')
      .expect('content-type', 'application/json', done);
  });

});
