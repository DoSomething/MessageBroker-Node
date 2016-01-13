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