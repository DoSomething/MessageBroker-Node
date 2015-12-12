var request = require('supertest');
var app = require('./mb-logging-api-server');

describe('Requests to the root (/api) path', function() {

  it('GET: Returns a 200 status code', function(done) {

    request(app)
      .get('/api')
      .expect(200)
      .end(function(error) {
        if (error) throw error;
        done();
      });

  });

});

describe('Requests to v1 root (/api/v1) path', function() {

  it('GET: Returns a 200 status code', function(done) {

    request(app)
      .get('/api/v1')
      .expect(200)
      .end(function(error) {
        if (error) throw error;
        done();
      });

  });

});

describe('Requests to v1 imports (/api/v1/imports) path', function() {

  it('POST: Returns a 400 status code when required parameters type, exists, source, origin, processed_timestamp and email or phone or drupal_uid are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect(400)
      .end(function(error) {
        if (error) throw error;
        done();
      });

  });

});

describe('Requests to v1 imports (/api/v1/imports/summaries) path', function() {

  it('POST: Returns a 400 status code when required parameters type,source, target_CSV_file, signup_count and skipped are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports/summaries')
      .expect(400)
      .end(function(error) {
        if (error) throw error;
        done();
      });

  });

});

describe('Requests to v1 imports (/api/v1/user/activity) path', function() {

  it('POST: Returns a 400 status code when required parameter vote is not defined.', function(done) {

    request(app)
      .post('/api/v1/user/activity')
      .expect(400)
      .end(function(error) {
        if (error) throw error;
        done();
      });

  });

it('GET: Returns a 400 status code when required parameter "type" and "source" are not defined.', function(done) {

    request(app)
      .get('/api/v1/user/activity')
      .expect(400)
      .end(function(error) {
        if (error) throw error;
        done();
      });

  });

});
