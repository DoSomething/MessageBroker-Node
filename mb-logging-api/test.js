/**
 * Test for mb-logging-api
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
var app = require('./mb-logging-api-server');

/**
 *
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
 *
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
 *
 */
describe('Requests to v1 imports (/api/v1/imports) path', function() {

  it('POST: Returns a 400 status code when required parameters "type", "exists", "source", "origin", "processed_timestamp" and "email" OR "phone" or "drupal_uid" are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect(400, done);
  });

  it('POST: Returns JSON format with 400 response.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect('content-type', 'application/json', done);
  });

  // @todo
  /*
  it('GET: Lookup of missing import log entry returns 404 response code.', function(done) {

  });
  */

  it('POST: Addition of import log entry returns 201 response code and "OK" message.', function(done) {

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
  /*
  it('GET: Lookup of import log entry returns 200 response code. Returned data is formatted as expected.', function(done) {

  });
  */

  // @todo
  /*
  it('DELETE: Test import log entry returns 200 response code.', function(done) {

  });
  */

  // @todo
  /*
  it('GET: Lookup of deleted import log entry returns 404 response code.', function(done) {

  });
  */

});

/**
 *
 */
describe('Requests to v1 imports (/api/v1/imports/summaries) path', function() {

  it('POST: Returns a 400 status code when required parameters "type", "source", "target_CSV_file", "signup_count" and "skipped" are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports/summaries')
      .expect(400, done);
  });

  it('POST: Returns JSON format with 400 response.', function(done) {

    request(app)
      .post('/api/v1/imports/summaries')
      .expect('content-type', 'application/json', done);
  });

  // @todo
  /*
  it('GET: Lookup of missing import summary log entries returns 404 response code.', function(done) {

  });
  */

  it('POST: Addition of import log summary entry returns 201 response code and "OK" message.', function(done) {

    urlParams = '?source=niche&type=user_import';
    request(app)
      .post('/api/v1/imports/summaries' + urlParams)
      .send({
        "logging_timestamp": "1410000000",
        "target_CSV_file": "2015-13-00.csv",
        "signup_count": "69",
        "skipped": "1"
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
  /*
  it('GET: Lookup of summary import log entry returns 200 response code. Returned data is formatted as expected.', function(done) {

  });
  */

  // @todo
  /*
  it('DELETE: Test summary log entry returns 200 response code.', function(done) {

  });
  */

  // @todo
  /*
  it('GET: Lookup of deleted import summary log entry returns 404 response code.', function(done) {

  });
  */

});

/**
 *
 */
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
      .expect("content-type", /json/, done);
  });

});

/**
 *
 */
describe('Requests to v1 imports (/api/v1/user/transactional) path', function() {

  it('POST: Returns a 400 status code when required parameter "email" and "activity" are not defined.', function(done) {

    request(app)
      .post('/api/v1/user/transactional')
      .expect(400, done);
  });

  it('POST: Returns JSON format with 400 response.', function(done) {

    request(app)
      .post('/api/v1/user/transactional')
      .expect("content-type", /json/, done);
  });

  it('POST: Addition of user activity "user_register" entry returns 201 response code and "OK" message.', function(done) {

    urlParams = '?email=test%40test.com&activity=user_registration';
    request(app)
      .post('/api/v1/user/transactional' + urlParams)
      .send({
        "source": "US",
        "activity_timestamp": "1450143371",
        "message": "a:13:{s:8:\"activity\";s:13:\"user_register\";s:5:\"email\";s:13:\"test@test.com\";s:3:\"uid\";s:7:\"3400745\";s:10:\"merge_vars\";a:2:{s:12:\"MEMBER_COUNT\";s:11:\"4.6 million\";s:5:\"FNAME\";s:4:\"Test\";}s:12:\"user_country\";s:2:\"US\";s:13:\"user_language\";s:2:\"en\";s:14:\"email_template\";s:19:\"mb-user-register-US\";s:17:\"mailchimp_list_id\";s:10:\"f2fab1dfd4\";s:9:\"birthdate\";s:9:\"133574400\";s:10:\"subscribed\";i:1;s:10:\"email_tags\";a:1:{i:0;s:20:\"drupal_user_register\";}s:18:\"activity_timestamp\";i:1450143371;s:14:\"application_id\";s:2:\"US\";}"
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

  it('GET: Lookup of user activity log entries returns 200 response code and JSON message. Returned data is formatted as expected.', function(done) {

    urlParams = '?email=test%40test.com';
    request(app)
      .get('/api/v1/user/transactional' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, res) {
        if (err) throw err;
        res.status.should.equal(200);
        res.body[0].email.should.equal("test@test.com");
        res.body[0].activity.should.equal("user_registration");
        res.body[0].activity_details.should.not.equal(null);
        res.body[0].should.have.property('activity_date');
        res.body[0].should.have.property('logged_date');
        done();
      });
  });

  it('DELETE: Test user "test@test.com" activity log entry returns 200 response code and JSON "OK".', function(done) {

    urlParams = '?email=test%40test.com';
    request(app)
      .delete('/api/v1/user/transactional' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(200);
        response.body.should.startWith('OK');
        done();
      });

  });

  // @todo
  /*
  it('GET: Lookup of deleted user activity log entry returns 404 response code.', function(done) {

  });
  */

});
