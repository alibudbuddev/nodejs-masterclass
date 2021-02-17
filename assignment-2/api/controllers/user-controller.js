
/*
 * User Controller
 *
 */

const requestHandler = require('./../util/request-handler');
const validator = require('./../../lib/validator');
const statusCode = require('./../../lib/status-code');
const UserModel = require('./../models/user-model');

// User controller container
const _container  = {};

// Users - post
// Required data: name, email, address, password
_container.post = function(data, callback){
  const payload = data.payload;
  if(
    validator.isEmail(payload.email) &&
    validator.isNotEmpty(payload.name) &&
    validator.isNotEmpty(payload.address),
    validator.isNotEmpty(payload.password)
  ) {
    const userModel = new UserModel(payload.email);
    userModel.notExist(function(notExist) {
      if(notExist) {
        userModel.save(payload, function(statusCode, payload = {}) {
          callback(statusCode, payload);
        });
      } else {
        callback(statusCode.SERVER_ERROR, {'error' : 'User email already exists'});
      }
    });
  } else {
    callback(statusCode.NOT_FOUND, {'error' : 'Missing required fields'});
  }
}

const userController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = userController;