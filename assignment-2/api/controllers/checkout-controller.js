
/*
 * Order Controller
 *
 */

var requestHandler = require('./../util/request-handler');
const OrderModel = require('./../models/order-model');
const statusCode = require('./../../lib/status-code');
const helpers = require('../../lib/helpers');
const Stripe = require('./../../lib/stripe');
const stripe = new Stripe();

var _container = {};

_container.post = function(data, callback){
  // Check if token is valid
  const tokenState = data.tokenState;
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  const orderModel = new OrderModel(data.payload.orderId);
  orderModel.get((err, orderDetailsPayload) => {
    if(err) {
      callback(statusCode.NOT_FOUND, helpers.errObject(`There's no order for order-id: ${data.payload.orderId}`));
    } else {
      if(!data.payload.amount) {
        callback(statusCode.NOT_FOUND, helpers.errObject('Amount must have a value'));
      } else {
        const body = {
          amount: data.payload.amount,
          source: 'tok_visa',
          currency: 'usd',
          description: `Order ID: ${orderDetailsPayload.id}`,
        };
  
        stripe.charge(body, stripePayload => {
          // If payment is paid, update order record.
          if(stripePayload.statusCode == statusCode.SUCCESS) {
            orderDetailsPayload['isPaid'] = true;
            orderDetailsPayload['paymentId'] = stripePayload.payload.id;
            orderModel.update(orderDetailsPayload, (err, payload) => {
              if(err) {
                console.error(err, payload);
              }
              callback(stripePayload.statusCode);
            });
          } else {
            callback(stripePayload.statusCode, stripePayload.payload);
          }
        });
      }
    }
  });
}

var checkoutController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = checkoutController;