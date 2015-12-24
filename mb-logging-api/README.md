![https://david-dm.org/DoSomething/mb-logging-api.svg](https://david-dm.org/DoSomething/mb-logging-api.svg)

mb-logging-api
==============

An API to send logging data for persistant storage. Currently the persistant storage is a MongoDB.

###Endpoints

* **GET /api** - report basic details about the API
* **GET /api/v1**
* **POST /api/v1/imports?type=[user]&exists=[1]&source=[ niche | niche.com | hercampus | att-ichannel | teenlife ]**
  * @param type string
    ex. &type=user : The type of import, helps to define what collection the
     POST is added to.
  * @param exists integer
    &exists=1 : Flag to log entries of existing Drupal, Mailchimp and Mobile
    Commons users in the userImportModel.
  * @param source string
    &source=niche : Unique name to identify the source of the import data.
* **POST /api/v1/imports/summaries?type=[user]&source=[ niche | niche.com | hercampus | att-ichannel | teenlife ]**
  * @param type string
     ex. &type=user : The type of import.
  * @param source string
     &source=niche.com : Unique name to identify the source of the import data.
* **GET /v1/user/activity?type=[ vote ]&source=[ AGG ]**
  * @param type string
  * @param source string
* **POST /v1/user/activity?type=[ vote ]**
  * @param type string
  * POST:
    * email string  (required)
    * source string
    * activity_details seralized String
    * activity_date  Date
* **POST /v1/user/transactional?email=[ email ]&activity=[ user_registration | user_password | campaign_signup | campaign_reportback ]**
  * @param email string
  * @param activity string
     One of four activity types based on transactional requests made by supported applications.
  * POST:
    * mobile string Mobile number of the request. (optional)
    * source string The origin of the transactional request. (required)
      ['niche', 'hercampus', 'att-ichannel', 'teenlife', 'cgg', 'agg', 'us', 'ca', 'uk', 'gb', 'id', 'br', 'mx']
    * activity_timestamp integer. (required)
    * message string The orginal seralized string that was sent to the Message Broker system. (required)
* **GET /v1/user/transactional**
  * @param email string (required)
* **DELETE /v1/user/transactional**
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