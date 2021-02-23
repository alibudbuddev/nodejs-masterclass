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
      let handler = typeof(routes[requestMetadata.path]) !== 'undefined' ? routes[requestMetadata.path] : routes['not-found'];

      // If the request is within the public directory use to the public handler instead
      handler = requestMetadata.path.indexOf('public/') > -1 ? routes.public : handler;

      // Pass token state
      requestMetadata['tokenState'] = state;

      // Route the request
      handler(requestMetadata, function(statusCode, payload, contentType) {
        // Determine the type of response (fallback to JSON)
        contentType = typeof(contentType) == 'string' ? contentType : 'json';

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;


        // payload = typeof(payload) == 'object'? payload : {};
        responseHandler(statusCode, payload, res, contentType);
      });
    });
  });
};

const responseHandler = function(statusCode, payload, res, contentType) {
  // Return the response parts that are content-type specific
  var payloadString = '';
  if(contentType == 'json'){
    res.setHeader('Content-Type', 'application/json');
    payload = typeof(payload) == 'object'? payload : {};
    payloadString = JSON.stringify(payload);
  }

  if(contentType == 'html'){
    res.setHeader('Content-Type', 'text/html');
    payloadString = typeof(payload) == 'string'? payload : '';
  }

  if(contentType == 'favicon'){
    res.setHeader('Content-Type', 'image/x-icon');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if(contentType == 'plain'){
    res.setHeader('Content-Type', 'text/plain');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if(contentType == 'css'){
    res.setHeader('Content-Type', 'text/css');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if(contentType == 'png'){
    res.setHeader('Content-Type', 'image/png');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if(contentType == 'jpg'){
    res.setHeader('Content-Type', 'image/jpeg');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  // Return the response-parts common to all content-types
  res.writeHead(statusCode);
  res.end(payloadString);

  // res.setHeader('Content-Type', 'application/json');
  // res.writeHead(statusCode);
  // res.end(JSON.stringify(payload));
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