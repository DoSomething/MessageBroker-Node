![https://david-dm.org/DoSomething/mb-logging-api.svg](https://david-dm.org/DoSomething/mb-logging-api.svg)

mb-logging-api
==============

An API to send logging data for persistant storage. Currently the persistant storage is a MongoDB.

###Endpoints

* **GET /api** - report basic details about the API
* **GET /api/v1**

/api/v1/imports
--------------

* **POST /api/v1/imports?type=[user_import]&exists=[1]&source=[ niche | hercampus | att-ichannel | teenlife ]&origin=[ filename.csv ]**
  * @param type string
    ex. &type=user : The type of import.
  * @param exists integer
    &exists=1 : Flag to log entries of existing Drupal, Mailchimp and Mobile
    Commons users in the userImportModel. (not used, to be removed)
  * @param source string
    &source=niche : Unique name to identify the source of the import data. Used to define what collection the POST is added to.
  * POST:
    * logging_timestamp Integer
    * phone Integer
    * phone_status String
    * email String
    * email_status String
    * email_acquired_timestamp Integer
    * drupal_uid Integer
    * drupal_email String
* **GET /api/v1/imports?type=[user_import]&source=[ niche | hercampus | att-ichannel | teenlife ]&origin=[ filename.csv ]**
* **DELETE /api/v1/imports?type=[user_import]&source=[ niche | hercampus | att-ichannel | teenlife ]&origin=[ filename.csv ]**

/api/v1/imports/summaries
--------------

* **POST /api/v1/imports/summaries?type=[user_import]&source=[ niche | hercampus | att-ichannel | teenlife ]**
  * @param type string
     ex. &type=user : The type of import.
  * @param source string
     &source=niche : Unique name to identify the source of the import data.
  * POST:
    * logging_timestamp Integer
    * target_CSV_file String
    * signup_count Integer
    * skipped Integer
* **GET /api/v1/imports/summaries?type=[user_import]&source=[ niche | hercampus | att-ichannel | teenlife ]**
* **DELETE /api/v1/imports/summaries?type=[user_import]&source=[ niche | hercampus | att-ichannel | teenlife ]&origin=[ filename.csv ]**

/v1/user/activity
--------------

* **POST /v1/user/activity?type=[ vote ]**
  * @param type string
  * POST:
    * email String  (required)
    * source String
    * activity_details seralized String
    * activity_timestamp Integer
* **GET /v1/user/activity?type=[ vote ]&source=[ AGG | CGG ]**
  * @param type string (required)
  * @param source string (required)
  * @param source startDate (optional)
  * @param source endDate (optional)
* **DELETE /v1/user/activity?email=[test@test.com]&type=[ vote ]&source=[ AGG | CGG ]**

/v1/user/transactional
--------------

* **POST /v1/user/transactional?email=[ email address ]&activity=[ user_registration | user_password | campaign_signup | campaign_reportback ]**
  * @param email String
  * @param activity String
     One of four activity types based on transactional requests made by supported applications.
  * POST:
    * mobile String - Mobile number of the request. (optional)
    * source String - The origin of the transactional request. (required)
      ['niche', 'hercampus', 'att-ichannel', 'teenlife', 'cgg', 'agg', 'us', 'ca', 'uk', 'gb', 'id', 'br', 'mx']
    * activity_timestamp Integer (required)
    * message String - The orginal seralized string that was sent to the Message Broker system. (required)
* **GET /v1/user/transactional?email=[ email address]**
  * @param email string (required)
* **DELETE /v1/user/transactional?email=[ email address]**
  * @param email string (required)

##### Installation
```
$ npm install
```

`shrinkwrap` is used to lock install module versions to gurentee functional releases. Deleting the `npm-shrinkwrap.json` file before installing with npm will result in the latest versions of packages being installed but the application may not work as expected.

##### Configuration
A `./config/mb_config.json` file must have a structure of and contain values for:
```
{
  "default":
    {
      "port": "1234"
    }
  ,
  "mongo":
    {
      "development" : "mongodb://localhost/mb-logging",
      "production" : "mongodb://mongo:27017"
    }
}

```

- Copy the sample `./config/SAMPLE_mb_config.json` file.


##### Environment
```
$ export NODE_ENV=<production | development>
```
- **`production`**:
  - Use production Mongo database connection settings defined in config/mb_config.json.

- **`development`**:
  - Use development Mongo database connection settings defined in config/mb_config.json.

##### Command Line
```
$ NODE_ENV=<production | development> ./bin/mb-logging-api-server
$ curl -i http://localhost:4733/api
```

##### Start as Daemon
```
$ NODE_ENV=<production | development> forever start ./bin/mb-logging-api-server
```

##### Tests
- to run the unit (supertest / mocha) tests:
```
$ npm test
```

  Requests to the root (/api) path
    ✓ GET: Returns a 200 status code
    ✓ GET: Returns JSON format

  Requests to v1 root (/api/v1) path
    ✓ GET: Returns a 200 status code
    ✓ GET: Returns JSON format

  Requests to v1 imports (/api/v1/imports) path
    ✓ POST: Returns a 400 status code when required parameters "type", "exists", "source", "origin", "processed_timestamp" and "email" OR "phone" or "drupal_uid" are not defined.
    ✓ POST: Invalid submission returns JSON format with 400 response.
    ✓ POST: Valid import log entry returns 201 response code and OK message.
    ✓ GET: Lookup import log entries returns 200 response code and expected content.
    ✓ DELETE: Import log entry returns 200 response code and expected OK response.
    ✓ DELETE: Attempted deletion of missing user import log entries returns 404 response code and JSON "OK".
    ✓ GET: Lookup of missing import log entries returns 404 response code.

  Requests to v1 imports (/api/v1/imports/summaries) path
    ✓ POST: Returns a 400 status code when required parameters "type", "source", "target_CSV_file", "signup_count" and "skipped" are not defined.
    ✓ POST: Invlid POST returns JSON format with 400 response.
    ✓ POST: Addition of import log summary entry returns 201 response code and "OK" message.
    ✓ GET: Lookup import log summary entry returns 200 response code and expected content.
    ✓ DELETE: Import summary log entry returns 200 response code and expected OK response.
    ✓ DELETE: Attempted deletion of missing summary log entry returns 404 response code and JSON "OK".
    ✓ GET: Lookup of missing import summary log entry returns 404 response code.

  Requests to v1 imports (/api/v1/user/activity) path
    ✓ POST: Returns a 400 status code when required parameter "vote" is not defined.
    ✓ POST: Invalid POST returns JSON format
    ✓ POST: Addition of user activity log entry returns 201 response code and "OK" message.
    ✓ GET: Lookup user activity log entry returns 200 response code and expected content.
    ✓ DELETE: User activity log entry returns 200 response code and expected OK response.
    ✓ DELETE: Attempted deletion of missing test activity for user "test@test.com" activity returns 404 response code and JSON "OK".
    ✓ GET: Lookup of missing user activity log entry returns 404 response code.

  Requests to v1 imports (/api/v1/user/transactional) path
    ✓ POST: Returns a 400 status code when required parameter "email", "activity", "source" and "message" are not defined.
    ✓ POST: Returns JSON format with 400 response.
    ✓ POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "email" value is missing.
    ✓ POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "acivity" value is missing.
    ✓ POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "source" value is missing.
    ✓ POST: Addition of user activity "user_register" entry returns 400 response code and "ERROR, missing required value." message when required "message" value is missing.
    ✓ POST: Addition of user activity "user_register" entry returns 201 response code and "OK" message.
    ✓ GET: Lookup of user activity log entries returns 200 response code and JSON message. Returned data is formatted as expected.
    ✓ DELETE: Test user "test@test.com" activity log entry returns 200 response code and JSON "OK".
    ✓ DELETE: Attempted deletion of missing test user "test@test.com" activity log entry returns 404 response code and JSON "OK".
    ✓ GET: Lookup of deleted user activity log entry returns 404 response code.


  36 passing (242ms)