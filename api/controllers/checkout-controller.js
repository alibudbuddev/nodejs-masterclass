
/*
 * Order Controller
 *
 */

var requestHandler = require('./../util/request-handler');
const OrderModel = require('./../models/order-model');
const validator = require('./../../lib/validator');
const CartModel = require('./../models/cart-model');
const statusCode = require('./../../lib/status-code');
const helpers = require('../../lib/helpers');
const Stripe = require('./../../lib/stripe');
const Mailgun = require('./../../lib/mailgun');
const stripe = new Stripe();
const mailgun = new Mailgun();

// Checkout controller container
const _container = {};

// Required data: 
_container.post = (data, callback) => {
  // Check if token is valid
  const tokenState = data.tokenState;
  // if(!data.tokenState.valid) {
  //   callback(statusCode.UNAUTHORIZED);
  //   return;
  // }
  
  const card = typeof(data.payload.card) == 'object' ? data.payload.card : {};
  if(
    validator.isNotEmpty(card.number) &&
    validator.isNumber(card.exp_month) &&
    validator.isNumber(card.exp_year) &&
    validator.isNotEmpty(card.cvc)
  ) {
    // Validate the card if valid
    stripe.token({card}, (tokenPayload) => {
      if(tokenPayload.statusCode == statusCode.SUCCESS) {

        // If card is valid, proceed to checkout logic
        const cartModel = new CartModel(tokenState.token.email);
        cartModel.get((err, cartPayload) => {
          if(err) {
            callback(statusCode.NOT_FOUND, helpers.errObject('No selected items to place an order.'));
          } else {
            const randomId = helpers.createRandomString(20);

            // Process the payment first
            const body = {
              amount: parseInt(`${cartModel.data.total}00`),
              source: tokenPayload.payload.id,
              currency: 'usd',
              description: `Order ID: ${randomId}`,
            };

            stripe.charge(body, chargePayload => {
              // If payment is successful, create new record
              if(chargePayload.statusCode == statusCode.SUCCESS) {
                const orderModel = new OrderModel(randomId);
                const orderObject = {
                  'id' : randomId,
                  'email': tokenState.token.email,
                  'items' : cartPayload,
                  'isPaid': true,
                  'paymentId': chargePayload.payload.id
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
                callback(chargePayload.statusCode, chargePayload);
              }
            });
          }
        });
      } else {
        callback(tokenPayload.statusCode, tokenPayload);
      }
    });
  } else {
    callback(statusCode.PAYMENT_REQUIRED, {err: helpers.errObject('Card details invalid.'), payload});
  }
}

const checkoutController = (data, callback) => {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = checkoutController;