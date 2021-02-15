
/*
 * Product Controller
 *
 */

var requestHandler = require('./../util/request-handler');

// Product controller container
var _container = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
_container.post = function(data, callback){
  console.log(data);
  callback(200, data.payload);
}

var productController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = productController;