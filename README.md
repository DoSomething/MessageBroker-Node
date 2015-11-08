# MessageBroker-Node
A collection of Node.js based micro-service applications that make up the Message Broker system for DoSomething.org.

* **mb-logging-api**: An API to send logging data for persistent storage. Currently the persistent storage is a MongoDB.
* **mb-users-api**: Allows producer and consumer components of the Message Broker system to interact with the Message Broker User database.
* **mb-digest-api**: A key/value value cache for concurrent functionality in Digest message generation (mbp-user-digest / mbc-digest-email)