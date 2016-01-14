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

##### Installation
```
$ npm install
```
NOTE: npm shrinkwrap : https://docs.npmjs.com/cli/shrinkwrap locks down the versions of a package's dependencies.

##### Configuration
`/config/mb_config.json` needs to exist to define configuration settings for application. Settings should define "development", "test" and "production" settings. Toggle the application use of the settings using the `NODE_ENV` setting.

A `./config/mb_config.json` file must have a structure of and contain values for:
```
{
  "default":
    {
      "port": "4744"
    }
  ,
  "redis":
    {
      "development": {
        "host": "localhost",
        "port": "6379"
      },
      "test": {
        "host": "127.0.0.1",
        "port": "16379"
      },
      "production": {
        "host": "message-broker.2vgx1m.0001.use1.cache.amazonaws.com",
        "port": "6379"
      }
    }
}

##### Environment
```
$ export NODE_ENV=<production | test | development>
```
- **`production`**:
  - Use production Redis connection settings defined in config/mb_config.json.

- **`development`**:
  - Use development Redis connection settings defined in config/mb_config.json.

##### Start as Deamon
```
$ NODE_ENV=<production | test | development> forever start mb-digest-api-server.js
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
