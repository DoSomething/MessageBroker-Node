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
