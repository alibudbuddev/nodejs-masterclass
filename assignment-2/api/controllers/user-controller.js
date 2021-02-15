
/*
 * User Controller
 *
 */

var requestHandler = require('./../util/request-handler');

// User controller container
var _container  = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
_container.post = function(data, callback){
  console.log(data);
  callback(200, data.payload);
}

var userController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = userController;