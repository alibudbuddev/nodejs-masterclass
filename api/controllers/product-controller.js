
/*
 * Product Controller
 *
 */

 requestHandler = require('./../util/request-handler');
 const statusCode = require('./../../lib/status-code');
 const mock = require('./../util/mock');

// Product controller container
const _container = {};

_container.get = (data, callback) => {
  // Check if token is valid
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  callback(statusCode.success, mock.products);
}

const productController = (data, callback) => {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = productController;