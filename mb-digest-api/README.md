mb-digest-api
==============

An API to manage key/value data related to the cncurrent functionality with the Digest email message system.

###Endpoints

* **GET /api** - report basic details about the API
* **GET /api/v1**
* **GET /v1/campaign?id=[ xxx ]**
  * @param id number


##### Environment
```
$ export NODE_ENV=<production | development>
```
- **`production`**:
  - Use production Redis connection settings defined in config/mb_config.json.

- **`development`**:
  - Use development Redis connection settings defined in config/mb_config.json.

##### Start as Deamon
```
$ NODE_ENV=<production | development> forever start mb-digest-api-server.js
```
