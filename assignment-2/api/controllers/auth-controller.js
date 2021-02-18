
/*
 * Auth Controller
 *
 */
const statusCode = require('./../../lib/status-code');
const helpers = require('./../../lib/helpers');
const UserModel = require('./../models/user-model');
const TokenModel = require('./../models/token-model');

// Cart controller container
const _container  = {};

_container.post = function(data, callback) {
  // Check if current token is valid
  if(!data.tokenState.valid) {
    const payload = data.payload;
    const userModel = new UserModel(payload.email);

    userModel.get((err) => {
      if(!err) {
        if(helpers.hash(payload.password) == userModel.data.hashedPassword) {
          const randomId = helpers.createRandomString(20);
          const tokenModel = new TokenModel(randomId);
          const tokenObject = {
            'email' : payload.email,
            'id' : randomId,
            'expires' : helpers.expiration
          };

          // Store the token
          tokenModel.save(tokenObject, (err, payload) => {
            callback(err ? statusCode.SERVER_ERROR : statusCode.SUCCESS, payload);
          });
        } else {
          callback(statusCode.NOT_FOUND, {'error' : 'Password did not match the specified user\'s stored password'});
        }
      } else {
        callback(statusCode.SERVER_ERROR, helpers.errObject(`Email doesn't exists`));
      }

    });
  } else {
    callback(statusCode.NOT_FOUND);
  }
}

// @TODO: Delete user's token
_container.delete = function(data, callback) {
  // Check if token is valid

  // If token is valid, delete token
  callback(200, {msg: 'logout route'});
}

const authController = (data, callback) => {
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