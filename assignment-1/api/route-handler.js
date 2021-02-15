var handlers = {};
var successStatusCode = 200;

// Ping handler
handlers.ping = function(data, callback) {
  callback(successStatusCode);
};

// Hello World handler
handlers.helloWorld = function(data, callback) {
  var payload = {'message': `Hello World from pirple.com assignment #1`};
  callback(successStatusCode, payload);
};

// Not Found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

module.exports = handlers;