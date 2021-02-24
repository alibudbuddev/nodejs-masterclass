
/*
 * Order Controller
 *
 */

var requestHandler = require('./../util/request-handler');
const OrderModel = require('./../models/order-model');
const CartModel = require('./../models/cart-model');
const statusCode = require('./../../lib/status-code');
const helpers = require('../../lib/helpers');
const Stripe = require('./../../lib/stripe');
const Mailgun = require('./../../lib/mailgun');
const stripe = new Stripe();
const mailgun = new Mailgun();

// Checkout controller container
var _container = {};

// Required data: 
_container.post = function(data, callback){
  // Check if token is valid
  const tokenState = data.tokenState;
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  const cartModel = new CartModel(tokenState.token.email);
  cartModel.get((err, cartPayload) => {
    if(err) {
      callback(statusCode.NOT_FOUND, helpers.errObject('No selected items to place an order.'));
    } else {
      const randomId = helpers.createRandomString(20);

      // Process the payment first
      const body = {
        amount: parseInt(`${cartModel.data.total}00`),
        source: 'tok_visa',
        currency: 'usd',
        description: `Order ID: ${randomId}`,
      };

      stripe.charge(body, stripePayload => {
        // If payment is successful, create new record
        if(stripePayload.statusCode == statusCode.SUCCESS) {
          const orderModel = new OrderModel(randomId);
          const orderObject = {
            'id' : randomId,
            'email': tokenState.token.email,
            'items' : cartPayload,
            'isPaid': true,
            'paymentId': stripePayload.payload.id
          };

          // Save order
          orderModel.save(orderObject, (err, orderDetailsPayload) => {
            if(!err) {
              // When order saved, tried to delele the cart data.
              cartModel.delete((err) => {
                if(err) {
                  console.error(err);
                }
              });

              // Email the receipt to the user only if order update is successful
              const emailData = {
                from: 'test@nodejsmasterclass.com',
                to: tokenState.token.email,
                subject: `Purchase receipt #${orderDetailsPayload.paymentId}`,
                text: `Thanks you! Your order with the amount of ${cartModel.data.total} has been placed.`
              };
              
              mailgun.send(emailData, (err) => {
                if(err) {
                  console.log(`Receipt is not sent to ${tokenState.token.email}`);
                }
              });

              callback(statusCode.SUCCESS, orderDetailsPayload);
            } else {
              callback(statusCode.SERVER_ERROR, payload);
            }
          });
        } else {
          callback(stripePayload.statusCode, stripePayload.payload);
        }
      });

      // @@@@@@@@@@@@@@@@@

      // Create a new order record from cart with random ID.
      // const randomId = helpers.createRandomString(20);
      // const orderModel = new OrderModel(randomId);
      // const orderObject = {
      //   'id' : randomId,
      //   'email': tokenState.token.email,
      //   'items' : cartPayload,
      //   'isPaid': false,
      //   'paymentId': null
      // };

      // // Save order
      // orderModel.save(orderObject, (err, orderDetailsPayload) => {
      //   if(!err) {
      //     // When order saved, tried to delele the cart data.
      //     cartModel.delete((err) => {
      //       if(err) {
      //         console.error(err);
      //       }
      //     });

      //     // // Process the payment
      //     // const body = {
      //     //   amount: parseInt(`${orderModel.data.total}00`),
      //     //   source: 'tok_visa',
      //     //   currency: 'usd',
      //     //   description: `Order ID: ${orderDetailsPayload.id}`,
      //     // };

      //     // stripe.charge(body, stripePayload => {
      //     //   let isPaid = false;
      //     //   // If payment is paid, update order record.
      //     //   if(stripePayload.statusCode == statusCode.SUCCESS) {
      //     //     orderDetailsPayload['isPaid'] = true;
      //     //     orderDetailsPayload['paymentId'] = stripePayload.payload.id;
      //     //     isPaid = true;
      //     //     orderModel.update(orderDetailsPayload, (err, payload) => {
      //     //       if(err) {
      //     //         console.error(err, payload);
      //     //       }
      //     //     });

      //     //     // Email the receipt to the user only if order update is successful
      //     //     const emailData = {
      //     //       from: 'test@nodejsmasterclass.com',
      //     //       to: tokenState.token.email,
      //     //       subject: `Purchase receipt #${stripePayload.payload.id}`,
      //     //       text: `Thanks you! Your order with the amount of ${orderModel.data.total} has been placed.`
      //     //     };
              
      //     //     mailgun.send(emailData, (err) => {
      //     //       if(err) {
      //     //         console.log(`Receipt is not sent to ${tokenState.token.email}`);
      //     //       }
      //     //     });
      //     //   }
      //     // });
      //   } else {
      //     callback(statusCode.SERVER_ERROR, payload);
      //   }
      // });
    }
  });
}

var checkoutController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = checkoutController;