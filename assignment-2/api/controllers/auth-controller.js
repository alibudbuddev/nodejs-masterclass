
/*
 * Auth Controller
 *
 */
const statusCode = require('./../../lib/status-code');
const UserModel = require('./../models/user-model');

// Cart controller container
var _container  = {};

_container.post = function(data, callback){
  callback(200, {msg: 'login route'});
}

_container.delete = function(data, callback){
  callback(200, {msg: 'logout route'});
}

var authController = (data, callback) => {
  switch (data.method) {
    case 'post':
      _container.post(data, callback);
      break;

    case 'delete':
      _container.delete(data, callback);
      break;
  
    default:
      callback(statusCode.NOT_FOUND);
      break;
  }
}

// Export the controller
module.exports = authController;