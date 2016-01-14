/**
 * Test for mb-digest-api
 *
 * References:
 *   - HOW TO BUILD AND TEST YOUR REST API WITH NODE.JS, EXPRESS AND MOCHA
 *     https://thewayofcode.wordpress.com/tag/supertest
 *
 *   - Shpuld Library
 *     https://www.npmjs.com/package/should
 *
 *   - Test your REST api using Mocha and supertest
 *     https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/
 */

var util = require('util');
var request = require('supertest');
var should = require('should');
var app = require('./mb-digest-api-server');

/**
 * Tests for API ping endpoints.
 */
describe('Requests to the root (/api) path', function() {

  it('GET: Returns a 200 status code', function(done) {

    request(app)
      .get('/api')
      .expect(200, done);
  });

  it('GET: Returns JSON format', function(done) {

    request(app)
      .get('/api')
      .expect("content-type", /json/, done)
  });
});

/**
 * Test API V1 information / status endpoint.
 */
describe('Requests to v1 root (/api/v1) path', function() {

  it('GET: Returns a 200 status code', function(done) {

    request(app)
      .get('/api/v1')
      .expect(200, done);
  });

  it('GET: Returns JSON format', function(done) {

    request(app)
      .get('/api/v1')
      .expect("content-type", /json/, done)
  });
});

/**
 * /api/v1/imports
 */
describe('Requests to v1 campaign (/api/v1/campaign) path', function() {

  it('POST: Returns a 400 status code when required parameters "nid", "language" and "object" are not defined.', function(done) {

    request(app)
      .post('/api/v1/campaign')
      .expect(400, done);
  });

  it('POST: Invalid submission returns JSON format with 400 response.', function(done) {

    request(app)
      .post('/api/v1/campaign')
      .expect(400)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(400);
        response.body.should.startWith('ERROR, missing required value. POST /api/v1/campaign request.');
        done();
      });
  });

  it('POST: Valid new campaign entry returns 201 response code and OK message.', function(done) {

    request(app)
      .post('/api/v1/campaign')
      .send({
        "nid": "012345",
        "language": "en",
        "object": "test<markup>"
      })
      .expect(201)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) {
          throw err;
        }
        response.status.should.equal(201)
        response.body.should.equal("OK")
        done();
      });
  });

  it('POST: Valid existing campaign entry returns 200 response code indicating the key value was not changed.', function(done) {

    request(app)
      .post('/api/v1/campaign')
      .send({
        "nid": "012345",
        "language": "en",
        "object": "test<markup>"
      })
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) {
          throw err;
        }
        response.status.should.equal(200)
        response.body.should.startWith("OK - Key already exists:")
        done();
      });
  });

  it('GET: Lookup campaign entry returns 200 response code and expected content.', function(done) {

    urlParams = '?key=mb-digest-campaign-012345-en';
    request(app)
      .get('/api/v1/campaign' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, res) {
        if (err) throw err;
        res.status.should.equal(200);
        res.body.key.should.equal("mb-digest-campaign-012345-en");
        res.body.value.should.equal("test<markup>");
        done();
      });
  });

  it('DELETE: Campaign entry returns 200 response code and expected OK response.', function(done) {

    urlParams = '?key=mb-digest-campaign-012345-en';
    request(app)
      .delete('/api/v1/campaign' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(200);
        response.body.should.startWith('OK - Key deleted');
        done();
      });
  });

  it('DELETE: Attempted deletion of missing campaign entry returns 404 response code and JSON "OK".', function(done) {

    urlParams = '?key=mb-digest-campaign-012345-en';
    request(app)
      .delete('/api/v1/campaign' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No keys found');
        done();
      });
  });

  it('GET: Lookup of missing campaign entry returns 404 response code.', function(done) {

    urlParams = '?key=mb-digest-campaign-012345-en';
    request(app)
      .get('/api/v1/campaign' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - Key not found');
        done();
      });
  });
});