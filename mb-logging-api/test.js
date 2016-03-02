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
describe('Requests to v1 imports (/api/v1/imports) path', function() {

  it('POST: Returns a 400 status code when required parameters "type", "exists", "source", "origin", "processed_timestamp" and "email" OR "phone" or "drupal_uid" are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect(400, done);
  });

  it('POST: Invalid submission returns JSON format with 400 response.', function(done) {

    request(app)
      .post('/api/v1/imports')
      .expect(400)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(400);
        response.body.should.startWith('ERROR, missing required value. POST /api/v1/import request.');
        done();
      });
  });
  
  it('POST: Valid Niche import log entry returns 201 response code and OK message.', function(done) {

    urlParams = '?type=user_import&source=niche&exists=1&origin=Niche-01-01-16.csv&processed_timestamp=1451606399';
    request(app)
      .post('/api/v1/imports'+ urlParams)
      .send({
        "logging_timestamp": "1451606400",
        "email": "test1@test.com",
        "email_status": "Test email...",
        "email_acquired_timestamp": "1451606398",
        "phone": "2345678901",
        "phone_status": "Test phone...",
        "drupal_uid": "123456789",
        "drupal_email": "test1@test.com"
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

  it('GET: Lookup Niche import log entries returns 200 response code and expected content.', function(done) {

    urlParams = '?type=user_import&source=niche&origin_start=Niche-01-01-16.csv&origin_end=Niche-02-01-16.csv';
    request(app)
      .get('/api/v1/imports' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, res) {
        if (err) throw err;
        res.status.should.equal(200);
        res.body[0].source.should.equal("niche");
        res.body[0].email.address.should.equal("test1@test.com");
        res.body[0].email.status.should.equal("Test email...");
        res.body[0].phone.number.should.equal("2345678901");
        res.body[0].phone.status.should.equal("Test phone...");
        res.body[0].drupal.uid.should.equal(123456789);
        res.body[0].drupal.email.should.equal("test1@test.com");
        res.body[0].origin.should.have.property('processed');
        res.body[0].origin.name.should.equal("Niche-01-01-16.csv");
        res.body[0].should.have.property('logged_date');
        res.body[0].logged_date.should.not.equal(null);
        done();
      });
  });

  it('DELETE: Niche import log entry returns 200 response code and expected OK response.', function(done) {

    urlParams = '?type=user_import&source=niche&origin=Niche-01-01-16.csv';
    request(app)
      .delete('/api/v1/imports' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(200);
        response.body.should.startWith('OK - Deleted');
        done();
      });
  });

  it('DELETE: Attempted deletion of missing Niche user import log entries returns 404 response code and JSON "OK".', function(done) {

    urlParams = '?type=user_import&source=niche&origin=Niche-01-01-16.csv';
    request(app)
      .delete('/api/v1/imports' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No documents found');
        done();
      });
  });

  it('GET: Lookup of missing Niche import log entries returns 404 response code.', function(done) {

    urlParams = '?type=user_import&source=niche&origin_start=Niche-01-01-16.csv&origin_end=Niche-01-01-17.csv';
    request(app)
      .get('/api/v1/imports' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No match found');
        done();
      });
  });
  
  it('POST: Valid After School import log entry returns 201 response code and OK message.', function(done) {

    urlParams = '?type=user_import&source=afterschool&exists=1&origin=AfterSchool-01-01-16.csv&processed_timestamp=1451606399';
    request(app)
      .post('/api/v1/imports'+ urlParams)
      .send({
        "logging_timestamp": "1423612800",
        "email": "test2@test.com",
        "email_status": "Test email...",
        "email_acquired_timestamp": "1451606398",
        "phone": "2345678901",
        "phone_status": "Test phone...",
        "drupal_uid": "123456789",
        "drupal_email": "test2@test.com"
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

  it('GET: Lookup After School import log entries returns 200 response code and expected content.', function(done) {

    urlParams = '?type=user_import&source=afterschool&origin_start=AfterSchool-01-01-16.csv&origin_end=AfterSchool-02-01-16.csv';
    request(app)
      .get('/api/v1/imports' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, res) {
        if (err) throw err;
        res.status.should.equal(200);
        res.body[0].source.should.equal("afterschool");
        res.body[0].email.address.should.equal("test2@test.com");
        res.body[0].email.status.should.equal("Test email...");
        res.body[0].phone.number.should.equal("2345678901");
        res.body[0].phone.status.should.equal("Test phone...");
        res.body[0].drupal.uid.should.equal(123456789);
        res.body[0].drupal.email.should.equal("test2@test.com");
        res.body[0].origin.should.have.property('processed');
        res.body[0].origin.name.should.equal("AfterSchool-01-01-16.csv");
        res.body[0].should.have.property('logged_date');
        res.body[0].logged_date.should.not.equal(null);
        done();
      });
  });

  it('DELETE: After School import log entry returns 200 response code and expected OK response.', function(done) {

    urlParams = '?type=user_import&source=afterschool&origin=AfterSchool-01-01-16.csv';
    request(app)
      .delete('/api/v1/imports' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(200);
        response.body.should.startWith('OK - Deleted');
        done();
      });
  });

  it('DELETE: Attempted deletion of missing After School user import log entries returns 404 response code and JSON "OK".', function(done) {

    urlParams = '?type=user_import&source=afterschool&origin=AfterSchool-01-01-16.csv';
    request(app)
      .delete('/api/v1/imports' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No documents found');
        done();
      });

  });

  it('GET: Lookup of missing After School import log entries returns 404 response code.', function(done) {

    urlParams = '?type=user_import&source=afterschool&origin_start=AfterSchool-01-01-16&origin_end=AfterSchool-02-01-16';
    request(app)
      .get('/api/v1/imports' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No match found');
        done();
      });
  });

});

/**
 * /api/v1/imports/summaries
 */
describe('Requests to v1 import summaries (/api/v1/imports/summaries) path', function() {

  it('POST: Returns a 400 status code when required parameters "type", "source", "target_CSV_file", "signup_count" and "skipped" are not defined.', function(done) {

    request(app)
      .post('/api/v1/imports/summaries')
      .expect(400, done);
  });

  it('POST: Invlid POST returns JSON format with 400 response.', function(done) {

    request(app)
      .post('/api/v1/imports/summaries')
      .expect(400)
      .expect("content-type", /json/, done);
  });

  it('POST: Addition of import log summary entry returns 201 response code and "OK" message.', function(done) {

    urlParams = '?source=teenlife&type=user_import';
    request(app)
      .post('/api/v1/imports/summaries' + urlParams)
      .send({
        "logging_timestamp": "1410000000",
        "target_CSV_file": "2015-13-00.csv",
        "signup_count": "69",
        "skipped": "1"
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

  it('GET: Lookup import log summary entry returns 200 response code and expected content.', function(done) {

    urlParams = '?type=user_import&source=teenlife&origin_start=2015-13-00&origin_end=2015-13-01';
    request(app)
      .get('/api/v1/imports/summaries' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, res) {
        if (err) throw err;
        res.status.should.equal(200);
        res.body[0].should.have.property('logged_date');
        res.body[0].target_CSV_file.should.equal("2015-13-00.csv");
        res.body[0].signup_count.should.equal(69);
        res.body[0].skipped.should.equal(1);
        res.body[0].source.should.equal("teenlife");
        res.body[0].log_type.should.equal("user_import");
        done();
      });
  });

  it('DELETE: Import summary log entry returns 200 response code and expected OK response.', function(done) {

    urlParams = '?type=user_import&source=teenlife&origin=2015-13-00.csv';
    request(app)
      .delete('/api/v1/imports/summaries' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(200);
        response.body.should.startWith('OK - Deleted');
        done();
      });

  });

  it('DELETE: Attempted deletion of missing summary log entry returns 404 response code and JSON "OK".', function(done) {

    urlParams = '?type=user_import&source=teenlife&origin=2015-13-00.csv';
    request(app)
      .delete('/api/v1/imports/summaries' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No documents found');
        done();
      });

  });

  it('GET: Lookup of missing import summary log entry returns 404 response code.', function(done) {

    urlParams = '?type=user_import&source=teenlife&origin_start=2015-13-00&origin_end=2015-13-01';
    request(app)
      .get('/api/v1/imports/summaries' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No match found');
        done();
      });

  });
});

/**
 * /api/v1/user/activity
 */
describe('Requests to v1 imports (/api/v1/user/activity) path', function() {

  it('POST: Returns a 400 status code when required parameter "vote" is not defined.', function(done) {

    request(app)
      .post('/api/v1/user/activity')
      .expect(400, done);
  });

  it('POST: Invalid POST returns JSON format', function(done) {

    request(app)
      .post('/api/v1/user/activity')
      .expect("content-type", /json/, done);
  });

  it('POST: Addition of user activity log entry returns 201 response code and "OK" message.', function(done) {

    urlParams = '?type=vote';
    request(app)
      .post('/api/v1/user/activity' + urlParams)
      .send({
        "email": "test2@test.com",
        "source": "CGG",
        "activity_details": "a:6:{s:5:\"email\";s:14:\"test2@test.com\";s:6:\"source\";s:3:\"AGG\";s:8:\"activity\";s:4:\"vote\";s:13:\"activity_date\";s:25:\"2015-06-10T21:10:17-04:00\";s:18:\"activity_timestamp\";i:1433985017;s:16:\"activity_details\";a:15:{s:19:\"birthdate_timestamp\";i:656812800;s:12:\"country_code\";s:2:\"CA\";s:12:\"candidate_id\";s:1:\"6\";s:14:\"candidate_name\";s:11:\"Brown Ebert\";s:8:\"activity\";s:4:\"vote\";s:14:\"application_id\";s:3:\"AGG\";s:18:\"activity_timestamp\";i:1433450227;s:5:\"email\";s:20:\"dlee@dosomething.org\";s:10:\"subscribed\";i:1;s:21:\"mailchimp_grouping_id\";s:5:\"55555\";s:20:\"mailchimp_group_name\";s:7:\"AGG2015\";s:17:\"mailchimp_list_id\";s:10:\"f2fab1dfd4\";s:14:\"email_template\";s:49:\"agg2015-voting-confirmation-global-non-affiliates\";s:10:\"email_tags\";a:2:{i:0;s:3:\"agg\";i:1;s:1:\"6\";}s:10:\"merge_vars\";a:3:{s:5:\"FNAME\";s:5:\"David\";s:14:\"CANDIDATE_NAME\";s:11:\"Brown Ebert\";s:14:\"CANDIDATE_LINK\";s:50:\"http://www.catsgonegood.com/candidates/brown-ebert\";}}}",
        "activity_date": "Wed Jun 24 2015 08:30:08 GMT-0400 (EDT)"
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

  it('GET: Lookup user activity log entry returns 200 response code and expected content.', function(done) {

    urlParams = '?email=test2%40test.com&type=vote&source=CGG';
    request(app)
      .get('/api/v1/user/activity' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, res) {
        if (err) throw err;
        res.status.should.equal(200);
        res.body[0].email.should.equal("test2@test.com");
        res.body[0].activity.should.equal("vote");
        res.body[0].activity_details.should.not.equal(null);
        res.body[0].should.have.property('activity_date');
        res.body[0].should.have.property('logged_date');
        done();
      });
  });

  it('DELETE: User activity log entry returns 200 response code and expected OK response.', function(done) {

    urlParams = '?email=test2%40test.com&type=vote&source=CGG';
    request(app)
      .delete('/api/v1/user/activity' + urlParams)
      .expect(200)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(200);
        response.body.should.startWith('OK - Deleted');
        done();
      });
  });

    it('DELETE: Attempted deletion of missing test activity for user "test@test.com" activity returns 404 response code and JSON "OK".', function(done) {

    urlParams = '?email=test2%40test.com&type=vote&source=CGG';
    request(app)
      .delete('/api/v1/user/activity' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No documents found');
        done();
      });
  });

  it('GET: Lookup of missing user activity log entry returns 404 response code.', function(done) {

    urlParams = '?email=test2%40test.com&type=vote&source=CGG';
    request(app)
      .get('/api/v1/user/activity' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No match found');
        done();
      });
  });

});

/**
 * /api/v1/user/transactional
 */
describe('Requests to v1 imports (/api/v1/user/transactional) path', function() {

  it('POST: Returns a 400 status code when required parameter "email", "activity", "source" and "message" are not defined.', function(done) {

    request(app)
      .post('/api/v1/user/transactional')
      .expect(400, done);
  });

  it('POST: Returns JSON format with 400 response.', function(done) {

    request(app)
      .post('/api/v1/user/transactional')
      .expect("content-type", /json/, done);
  });

  it('POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "email" value is missing.', function(done) {

    urlParams = '?activity=user_registration';
    request(app)
      .post('/api/v1/user/transactional' + urlParams)
      .send({
        "source": "US",
        "activity_timestamp": "1450143371",
        "message": "a:13:{s:8:\"activity\";s:13:\"user_register\";s:5:\"email\";s:13:\"test@test.com\";s:3:\"uid\";s:7:\"3400745\";s:10:\"merge_vars\";a:2:{s:12:\"MEMBER_COUNT\";s:11:\"4.6 million\";s:5:\"FNAME\";s:4:\"Test\";}s:12:\"user_country\";s:2:\"US\";s:13:\"user_language\";s:2:\"en\";s:14:\"email_template\";s:19:\"mb-user-register-US\";s:17:\"mailchimp_list_id\";s:10:\"f2fab1dfd4\";s:9:\"birthdate\";s:9:\"133574400\";s:10:\"subscribed\";i:1;s:10:\"email_tags\";a:1:{i:0;s:20:\"drupal_user_register\";}s:18:\"activity_timestamp\";i:1450143371;s:14:\"application_id\";s:2:\"US\";}"
      })
      .expect(400)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) {
          throw err;
        }
        response.status.should.equal(400)
        response.body.should.startWith('ERROR, missing required value.');
        done();
      });
  });

  it('POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "acivity" value is missing.', function(done) {

    urlParams = '?email=test%40test.com';
    request(app)
      .post('/api/v1/user/transactional' + urlParams)
      .send({
        "source": "US",
        "activity_timestamp": "1450143371",
        "message": "a:13:{s:8:\"activity\";s:13:\"user_register\";s:5:\"email\";s:13:\"test@test.com\";s:3:\"uid\";s:7:\"3400745\";s:10:\"merge_vars\";a:2:{s:12:\"MEMBER_COUNT\";s:11:\"4.6 million\";s:5:\"FNAME\";s:4:\"Test\";}s:12:\"user_country\";s:2:\"US\";s:13:\"user_language\";s:2:\"en\";s:14:\"email_template\";s:19:\"mb-user-register-US\";s:17:\"mailchimp_list_id\";s:10:\"f2fab1dfd4\";s:9:\"birthdate\";s:9:\"133574400\";s:10:\"subscribed\";i:1;s:10:\"email_tags\";a:1:{i:0;s:20:\"drupal_user_register\";}s:18:\"activity_timestamp\";i:1450143371;s:14:\"application_id\";s:2:\"US\";}"
      })
      .expect(400)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) {
          throw err;
        }
        response.status.should.equal(400)
        response.body.should.startWith('ERROR, missing required value.');
        done();
      });
  });

  it('POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "source" value is missing.', function(done) {

    urlParams = '?email=test%40test.com&activity=user_register';
    request(app)
      .post('/api/v1/user/transactional' + urlParams)
      .send({
        "activity_timestamp": "1450143371",
        "message": "a:13:{s:8:\"activity\";s:13:\"user_register\";s:5:\"email\";s:13:\"test@test.com\";s:3:\"uid\";s:7:\"3400745\";s:10:\"merge_vars\";a:2:{s:12:\"MEMBER_COUNT\";s:11:\"4.6 million\";s:5:\"FNAME\";s:4:\"Test\";}s:12:\"user_country\";s:2:\"US\";s:13:\"user_language\";s:2:\"en\";s:14:\"email_template\";s:19:\"mb-user-register-US\";s:17:\"mailchimp_list_id\";s:10:\"f2fab1dfd4\";s:9:\"birthdate\";s:9:\"133574400\";s:10:\"subscribed\";i:1;s:10:\"email_tags\";a:1:{i:0;s:20:\"drupal_user_register\";}s:18:\"activity_timestamp\";i:1450143371;s:14:\"application_id\";s:2:\"US\";}"
      })
      .expect(400)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) {
          throw err;
        }
        response.status.should.equal(400)
        response.body.should.startWith('ERROR, missing required value.');
        done();
      });
  });

  it('POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "message" value is missing.', function(done) {

    urlParams = '?email=test%40test.com&activity=user_register';
    request(app)
      .post('/api/v1/user/transactional' + urlParams)
      .send({
        "source": "US",
        "activity_timestamp": "1450143371"
      })
      .expect(400)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) {
          throw err;
        }
        response.status.should.equal(400)
        response.body.should.startWith('ERROR, missing required value.');
        done();
      });
  });

  it('POST: Addition of user activity "user_register" entry returns 201 response code and "OK" message.', function(done) {

    urlParams = '?email=test%40test.com&activity=user_register';
    request(app)
      .post('/api/v1/user/transactional' + urlParams)
      .send({
        "source": "US",
        "activity_timestamp": "1450143371",
        "message": "a:13:{s:8:\"activity\";s:13:\"user_register\";s:5:\"email\";s:13:\"test@test.com\";s:3:\"uid\";s:7:\"3400745\";s:10:\"merge_vars\";a:2:{s:12:\"MEMBER_COUNT\";s:11:\"4.6 million\";s:5:\"FNAME\";s:4:\"Test\";}s:12:\"user_country\";s:2:\"US\";s:13:\"user_language\";s:2:\"en\";s:14:\"email_template\";s:19:\"mb-user-register-US\";s:17:\"mailchimp_list_id\";s:10:\"f2fab1dfd4\";s:9:\"birthdate\";s:9:\"133574400\";s:10:\"subscribed\";i:1;s:10:\"email_tags\";a:1:{i:0;s:20:\"drupal_user_register\";}s:18:\"activity_timestamp\";i:1450143371;s:14:\"application_id\";s:2:\"US\";}"
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
        res.body[0].activity.should.equal("user_register");
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
        response.body.should.startWith('OK - Deleted');
        done();
      });

  });

  it('DELETE: Attempted deletion of missing test user "test@test.com" activity log entry returns 404 response code and JSON "OK".', function(done) {

    urlParams = '?email=test%40test.com';
    request(app)
      .delete('/api/v1/user/transactional' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No documents found');
        done();
      });

  });

  it('GET: Lookup of deleted user activity log entry returns 404 response code.', function(done) {

    urlParams = '?email=test%40test.com';
    request(app)
      .get('/api/v1/user/transactional' + urlParams)
      .expect(404)
      .expect("content-type", /json/)
      .end(function(err, response) {
        if (err) throw err;
        response.status.should.equal(404);
        response.body.should.startWith('OK - No match found');
        done();
      });
  });
});
