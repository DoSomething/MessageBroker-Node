mbc-user-subscriptions-server.js
=========================


- A web interface for users to select their subscription preferences for various channels of communication. The user preferences are maintained in the `mb-users` database.

#####Installation
```
$ npm install
$ PORT=4711 forever start mbc-user-subscriptions-server.js
```
##### Environment
```
$ export NODE_ENV=<production | development | test>
```
- **`production`**:
  - Makes `mb-user-api` calls to 10.241.0.20
  
- **`development`**:
  - Makes `mb-user-api` calls to localhost
  - Loads `var util = require('util')` to allow console logging of objects
  - Logs valid "key" values for the next 30 days
  
- **`test`**:
  - `?test=1` triggers mocha and chai based tests

###### Port
```
$ node .
Listening on port 8000

$ PORT=8001 node .
Listening on port 8001

$ export PORT=8002
$ node .'
Listening on port 8002

$ unset PORT
$ node . --port=8003
Listening on port 8003
```

#####Test Coverage
  - Browser tests defined in `/public/qa`
  - Unit tests define in `/qa/tests-crosspage.js`
    - `mocha -u tdd -R spec qa/tests-crosspage.js 2>/dev/null
