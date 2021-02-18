const url = require('url');
var fs = require('fs');
var path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
const routes = require('./../api/routes');
const helpers = require('./helpers');

const server = function(req, res) {
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    verifyToken(req.headers, (state) => {
      const requestMetadata = getRequestMetaData(req, buffer);
      buffer += decoder.end();

      // Generate handler based on URL Path
      const handler = typeof(routes[requestMetadata.path]) !== 'undefined' ? routes[requestMetadata.path] : routes['not-found'];

      // Pass token state
      requestMetadata['tokenState'] = state;

      // Route the request
      handler(requestMetadata, function(statusCode, payload) {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        payload = typeof(payload) == 'object'? payload : {};
        responseHandler(statusCode, payload, res);
      });
    });
  });
};

const responseHandler = function(statusCode, payload, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.end(JSON.stringify(payload));
}

const verifyToken = (headers, callback) => {
  fs.readFile(`${path.join(__dirname,'/../.data/')}tokens/${headers.token}.json`, 'utf8',
    (err, data) => {
      var tokenData = helpers.parseJsonToObject(data);
      if(!err && tokenData){
        // Check the token if not expired
        if(tokenData.expires > Date.now()){
          callback(generateTokenState(true, tokenData));
        } else {
          callback(generateTokenState(false, tokenData));
        }
      } else {
        callback(generateTokenState(false, tokenData));
      }
    }
  );
}

const generateTokenState = (valid, token) => {
  return {'valid': valid, 'token': token};
}

const getRequestMetaData = function(req, buffer) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const queryStringObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;
  const payload = helpers.parseJsonToObject(buffer)
  return {path, queryStringObject, method, headers, payload};
}

module.exports = server;