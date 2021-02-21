var userController = require('./controllers/user-controller');
var cartController = require('./controllers/cart-controller');
var orderController = require('./controllers/order-controller');
var productController = require('./controllers/product-controller');
var tokenController = require('./controllers/token-controller');
var authController = require('./controllers/auth-controller');
var checkoutController = require('./controllers/checkout-controller');
var defaultController = {};

// Ping handler
defaultController.ping = function(data, callback) {
  callback(200);
};

// Not Found handler
defaultController.notFound = function(data, callback) {
  callback(404);
};

var routes = {
  'ping' : defaultController.ping,
  'not-found': defaultController.notFound,
  'users': userController,
  'cart': cartController,
  'orders': orderController,
  'products': productController,
  'tokens': tokenController,
  'checkout': checkoutController,
  'auth': authController
};

module.exports = routes;