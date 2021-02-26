
/*
 * Order Controller
 *
 */

var requestHandler = require('./../util/request-handler');
const CartModel = require('./../models/cart-model');
const OrderModel = require('./../models/order-model');
const statusCode = require('../../lib/status-code');
const helpers = require('../../lib/helpers');

// Order controller container
var _container = {};

_container.post = function(data, callback){
  // Check if token is valid
  const tokenState = data.tokenState;
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  const cartModel = new CartModel(tokenState.token.email);
  cartModel.get((err, payload) => {
    if(err) {
      callback(statusCode.NOT_FOUND, helpers.errObject('No selected items to place an order.'));
    } else {
      // Create a new order record from cart with random ID.
      const randomId = helpers.createRandomString(20);
      const orderModel = new OrderModel(randomId);
      const orderObject = {
        'id' : randomId,
        'email': tokenState.token.email,
        'items' : payload,
        'isPaid': false,
        'paymentId': null,
        'createdAt': Date.now()
      };

      orderModel.save(orderObject, (err, payload) => {
        if(!err) {
          // Delete old cart record.
          cartModel.delete((err, data) => {
            if(err) {
              console.error(err);
            }

            // Return new order details
            callback(statusCode.SUCCESS, payload);
          });
        } else {
          callback(statusCode.SERVER_ERROR, payload);
        }
      });
    }
  });
}

_container.get = (data, callback) => {
  // Check if token is valid
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  const orderModel = new OrderModel(data.queryStringObject.id);
  orderModel.get((err, payload) => {
    callback(err ? statusCode.SERVER_ERROR : statusCode.SUCCESS, payload);
  });
}

var orderController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = orderController;