var handlers = require('./route-handler');

var routes = {
  'ping' : handlers.ping,
  'hello' : handlers.helloWorld,
  'not-found': handlers.notFound
};

module.exports = routes;