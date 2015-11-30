mb-digest-api
==============

An API to manage key/value data related to the cncurrent functionality with the Digest email message system.

###Endpoints

* **GET /api** - report basic details about the API
* **GET /api/v1**
* **GET /api/v1/campaign?key=mb-digest-campaign-[ nid ]-[ language ]** - gather seralized campaign object that includes digest HTML markup property.
  * @param nid integer (defined by Drupal node ID)
  * @param language string (defined by possible language versions maintained by Drupal application)
* **POST /api/v1/campaign** - set seralized object for campaign by nid and language (defined by Drupal app).
  * POST values:
    * nid integer: The Drupal nid of the campaign.
    * language string: The language code used by the Druapl application for the translated versions of campaign.
    * object string: Seralized campaign object that includes markup property.


##### Configuration
`/config/mb_config.json` needs to exist to define configuration settings for application. Settings should define "development" and "production" settings. Toggle the application use of the settings using the `NODE_ENV` setting.

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

##### Redis
- **Start server with**:
```
$ redis-server
```

- **CLI**:
```
$ redis-cli

127.0.0.1:6379> info keyspace
# Keyspace

127.0.0.1:6379> keys *
(empty list or set)

127.0.0.1:6379> set clikey1 clivalue1
OK

127.0.0.1:6379> get clikey1
"clivalue1"

```
