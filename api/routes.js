const userController = require('./controllers/user-controller');
const cartController = require('./controllers/cart-controller');
const orderController = require('./controllers/order-controller');
const productController = require('./controllers/product-controller');
const tokenController = require('./controllers/token-controller');
const authController = require('./controllers/auth-controller');
const checkoutController = require('./controllers/checkout-controller');

// View Controllers
const viewConroller = require('./../views/view-controller');
const viewAccountConroller = require('./../views/view-account-controller');
const viewAuthConroller = require('./../views/view-auth-controller');
const viewCartConroller = require('./../views/view-cart-controller');
const viewOrderConroller = require('./../views/view-order-controller');
const viewProductConroller = require('./../views/view-product-controller');
// const viewCheckoutConroller = require('./../views/view-checkout-controller');

const routes = {
  // Views routes
  '' : viewAuthConroller.get,
  'account/login': viewAuthConroller.get,
  'account/logout': viewAuthConroller.delete,
  'account/create': viewAuthConroller.create,
  'account/edit': viewAccountConroller.edit,
  // 'account/deleted': viewAccountConroller.deleted,
  'cart': viewCartConroller.get,
  'order': viewOrderConroller.get,
  'products': viewProductConroller.get,
  // 'checkout': viewCheckoutConroller,
  'public' : viewConroller.public,
  'not-found': viewConroller.notFound,

  // API routes
  'api/users': userController,
  'api/cart': cartController,
  'api/orders': orderController,
  'api/products': productController,
  'api/tokens': tokenController,
  'api/checkout': checkoutController,
  'api/auth': authController
};

module.exports = routes;