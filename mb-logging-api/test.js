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
var should = require('should');
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

  // @todo
  it('GET: Lookup of missing import log entry returns 404 response code.', function(done) {

  });

  it('POST: Addition of import log entry returns 201 response code.', function(done) {

    urlParams = '?source=niche&exists=1&origin=Niche-12-12-15.csv&processed_timestamp=1000000000&type=user_import';
    request(app)
      .post('/api/v1/imports' + urlParams)
      .send({
        "logging_timestamp": "1410000000",
        "phone": "1234567890",
        "phone_status": "Still a phone number",
        "email": "test@test.com",
        "email_status": "We got this one too.",
        "email_acquired_timestamp": "1400000000",
        "drupal_uid": "12000000",
        "drupal_email": "test@test.com"
      })
      .expect("content-type", /json/)
      .expect(201)
      .end(function(err, response) {
        if (err) {
          throw err;
        }
        response.status.should.equal(201)
        response.body.should.equal("OK")
        done();
      });
  });

  // @todo
  it('GET: Lookup of import log entry returns 200 response code. Returned data is formatted as expected.', function(done) {

  });

  // @todo
  it('DELETE: Test import log entry returns 200 response code.', function(done) {

  });

  // @todo
  it('GET: Lookup of deleted import log entry returns 404 response code.', function(done) {

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
