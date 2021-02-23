var userController = require('./controllers/user-controller');
var cartController = require('./controllers/cart-controller');
var orderController = require('./controllers/order-controller');
var productController = require('./controllers/product-controller');
var tokenController = require('./controllers/token-controller');
var authController = require('./controllers/auth-controller');
var checkoutController = require('./controllers/checkout-controller');

// View Controllers
// var viewAccountConroller = require('./../views/view-account-controller');
var viewAuthConroller = require('./../views/view-auth-controller');
// var viewCartConroller = require('./../views/view-cart-controller');
// var viewOrderConroller = require('./../views/view-order-controller');
// var viewCheckoutConroller = require('./../views/view-checkout-controller');

var helpers = require('./../lib/helpers');

var defaultController = {};

// Index
defaultController.index = function(data,callback){
  // // Reject any request that isn't a GET
  // if(data.method == 'get'){
  //   // Prepare data for interpolation
  //   var templateData = {
  //     'head.title' : 'Uptime Monitoring - Made Simple',
  //     'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
  //     'body.class' : 'index'
  //   };
  //   // Read in a template as a string
  //   helpers.getTemplate('index',templateData,function(err,str){
  //     if(!err && str){
  //       // Add the universal header and footer
  //       helpers.addUniversalTemplates(str,templateData,function(err,str){
  //         if(!err && str){
  //           // Return that page as HTML
  //           callback(200,str,'html');
  //         } else {
  //           callback(500,undefined,'html');
  //         }
  //       });
  //     } else {
  //       callback(500,undefined,'html');
  //     }
  //   });
  // } else {
  //   callback(405,undefined,'html');
  // }
};

// Not Found handler
defaultController.notFound = function(data, callback) {
  callback(404, helpers.errObject('Page or Request not found'));
};

var routes = {
  // Views routes
  '' : viewAuthConroller.get,
  'login': viewAuthConroller.get,
  'logout': viewAuthConroller.delete,
  // 'account/create': viewAccountConroller.create,
  // 'account/edit': viewAccountConroller.edit,
  // 'account/deleted': viewAccountConroller.deleted,
  // 'cart': viewCartConroller,
  // 'order': viewOrderConroller,
  // 'checkout': viewCheckoutConroller,

  // API routes
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