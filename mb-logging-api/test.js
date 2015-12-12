var request = require('supertest');
var app = require('./mb-logging-api-server');

describe('Requests to the root (/api) path', function() {

  it('Returns a 200 status code', function(done) {

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

  it('Returns a 200 status code', function(done) {

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

  it('Returns a 400 status code when required parameters type, exists, source, origin, processed_timestamp and email or phone or drupal_uid are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect(400)
      .end(function(error) {
        if (error) throw error;
        done();
      });

  });

});
