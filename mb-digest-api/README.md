mb-digest-api
==============

An API to manage key/value data related to the cncurrent functionality with the Digest email message system.

###Endpoints

* **GET /api** - report basic details about the API
* **GET /api/v1**
* **GET /v1/campaign?id=[ xxx ]** - gather markup for campaign by id (defined by Drupal app).
  * @param id number
* **POST /v1/campaign** - set markup for campaign by id (defined by Drupal app).
  * POST values:
    * key string (mb-digest-campaign-[id]-[langauge]
    * value string (campaign row HTML markup)


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
