# MessageBroker-Node
A collection of Node.js based micro-service applications that make up the Message Broker system for DoSomething.org.

* **[mb-digest-api](https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-digest-api)**: A key/value value cache for concurrent functionality in Digest message generation (mbp-user-digest / mbc-digest-email)
* **[mb-logging-api](https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-logging-api)**: An API to send logging data for persistent storage. Currently the persistent storage is a MongoDB.
* **[mb-user-subscriptions](https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-user-subscriptions)**: A web interface for users to select their subscription preferences for various channels of communication. The user preferences are maintained in the `mb-users` database.
* **[mb-users-api](https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-users-api)**: Allows producer and consumer components of the Message Broker system to interact with the Message Broker User database.
