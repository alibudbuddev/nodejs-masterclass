
/*
 * Token Controller
 *
 */

var requestHandler = require('./../util/request-handler');

// Token controller container
var _container  = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
_container.post = function(data, callback){
  console.log(data);
  callback(200, data.payload);
}

var tokenController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = tokenController;