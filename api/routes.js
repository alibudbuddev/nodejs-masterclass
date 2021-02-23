var userController = require('./controllers/user-controller');
var cartController = require('./controllers/cart-controller');
var orderController = require('./controllers/order-controller');
var productController = require('./controllers/product-controller');
var tokenController = require('./controllers/token-controller');
var authController = require('./controllers/auth-controller');
var checkoutController = require('./controllers/checkout-controller');
const { handler } = require('./util/request-handler');
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
  '': '',
  'ping' : defaultController.ping,
  'not-found': defaultController.notFound,
  'api/users': userController,
  'api/cart': cartController,
  'api/orders': orderController,
  'api/products': productController,
  'api/tokens': tokenController,
  'api/checkout': checkoutController,
  'api/auth': authController
};

module.exports = routes;