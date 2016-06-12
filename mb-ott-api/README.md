mb-ott-api
==============

An API to be a gateway for OTT (Over The Top) messaging.

###Endpoints

* **GET /api** - report basic details about the API
* **GET /api/v1**

/api/v1/fb
--------------

* **POST /api/v1/fb**
  * @param type string

##### Installation
```
$ npm install
```
NOTE: npm shrinkwrap : https://docs.npmjs.com/cli/shrinkwrap locks down the versions of a package's dependencies.

`shrinkwrap` is used to lock install module versions to gurentee functional releases. Deleting the `npm-shrinkwrap.json` file before installing with npm will result in the latest versions of packages being installed but the application may not work as expected.

##### Configuration
A `./config/mb_config.json` file must have a structure of and contain values for:
```
{
  "default":
    {
      "port": "1234"
    }
}

```

- Copy the sample `./config/SAMPLE_mb_config.json` file.


##### Environment
```
$ export NODE_ENV=<production | development>
```
- **`production`**:
  - Use production connection settings defined in config/mb_config.json.

- **`development`**:
  - Use development connection settings defined in config/mb_config.json.

##### Command Line
```
$ NODE_ENV=<production | test | development> ./bin/mb-ott-api-server
$ curl -i http://localhost:4777/api
```

##### Start as Daemon
```
$ NODE_ENV=<production | development> forever start ./bin/mb-ott-api-server
```

##### Tests
- to run the unit (supertest / mocha) tests:
```
$ npm test

  Requests to the root (/api) path
    ✓ GET: Returns a 200 status code
    ✓ GET: Returns JSON format

  Requests to v1 root (/api/v1) path
    ✓ GET: Returns a 200 status code
    ✓ GET: Returns JSON format

  Requests to v1 imports (/api/v1/fb) path
 
  ```