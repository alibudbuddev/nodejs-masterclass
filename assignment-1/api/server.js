var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var routes = require('./routes');

var server = function(req, res) {
  var requestMetadata = getRequestMetaData(req);
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Generate handler based on URL Path
    var handler = typeof(routes[requestMetadata.path]) !== 'undefined' ? routes[requestMetadata.path] : routes['not-found'];

    // Route the request
    handler({}, function(statusCode, payload) {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object'? payload : {};
      responseHandler(statusCode, payload, res);
      console.log(requestMetadata);
    });
  });
};

var responseHandler = function(statusCode, payload, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.end(JSON.stringify(payload));
}

var getRequestMetaData = function(req) {
  var parsedUrl = url.parse(req.url, true);
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  var queryStringObject = parsedUrl.query;
  var method = req.method.toLowerCase();
  var headers = req.headers;
  return {path, queryStringObject, method, headers};
}

module.exports = server;