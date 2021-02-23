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

// Public assets
defaultController.public = (data, callback) => {
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Get the filename being requested
    var trimmedAssetName = data.path.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(!err && data){

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404, {err: 'not found'});
        }
      });
    } else {
      callback(404);
    }

  } else {
    callback(405);
  }
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
  'public' : defaultController.public,
  'not-found': defaultController.notFound,

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