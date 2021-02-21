
/*
 * Cart Controller
 *
 */

var requestHandler = require('./../util/request-handler');
const CartModel = require('./../models/cart-model');
const statusCode = require('../../lib/status-code');
const helpers = require('../../lib/helpers');

// Cart controller container
var _container  = {};

// Required data: cart object
_container.put = function(data, callback){
  // Check if token is valid
  const tokenState = data.tokenState;
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  if(typeof(data.payload.product) == 'object') {
    const cartModel = new CartModel(tokenState.token.email);
    cartModel.createOrUpdate(data.payload.product, (err, payload) => {
      callback(err ? statusCode.SERVER_ERROR : statusCode.SUCCESS, payload);
    });
  } else {
    callback(statusCode.NOT_FOUND, helpers.errObject('Cart item empty'));
  }
  
}

_container.get = (data, callback) => {
  // Check if token is valid
  const tokenState = data.tokenState;
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  const cartModel = new CartModel(tokenState.token.email);
  cartModel.get((err, payload) => {
    callback(err ? statusCode.SERVER_ERROR : statusCode.SUCCESS, payload);
  });
}

var cartController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = cartController;