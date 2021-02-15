var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var routes = require('./../api/routes');
var helpers = require('./helpers');

var server = function(req, res) {
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    var requestMetadata = getRequestMetaData(req, buffer);
    buffer += decoder.end();

    // Generate handler based on URL Path
    var handler = typeof(routes[requestMetadata.path]) !== 'undefined' ? routes[requestMetadata.path] : routes['not-found'];

    // Route the request
    handler(requestMetadata, function(statusCode, payload) {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object'? payload : {};
      responseHandler(statusCode, payload, res);
    });
  });
};

var responseHandler = function(statusCode, payload, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.end(JSON.stringify(payload));
}

var getRequestMetaData = function(req, buffer) {
  var parsedUrl = url.parse(req.url, true);
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  var queryStringObject = parsedUrl.query;
  var method = req.method.toLowerCase();
  var headers = req.headers;
  var payload = helpers.parseJsonToObject(buffer)
  return {path, queryStringObject, method, headers, payload};
}

module.exports = server;