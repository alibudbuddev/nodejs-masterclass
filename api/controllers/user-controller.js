
/*
 * User Controller
 *
 */

const requestHandler = require('./../util/request-handler');
const validator = require('./../../lib/validator');
const statusCode = require('./../../lib/status-code');
const UserModel = require('./../models/user-model');
const TokenModel = require('./../models/token-model');
const helpers = require('../../lib/helpers');

// User controller container
const _container  = {};

_container.post = function(data, callback){
  const payload = data.payload;
  if(
    validator.isEmail(payload.email) &&
    validator.isNotEmpty(payload.name) &&
    validator.isNotEmpty(payload.address) &&
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

_container.get = function(data, callback) {
  // Check if token is valid
  if(data.tokenState.valid) {
    callback(statusCode.SUCCESS);
  } else {
    callback(statusCode.UNAUTHORIZED);
  }
  
}

_container.put = function(data, callback) {
  // Check if token is valid
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  const payload = data.payload;
  if(validator.isEmail(payload.email)) {
    if(validator.isNotEmpty(payload.name) || validator.isNotEmpty(payload.address) || validator.isNotEmpty(payload.password)) {
      const userModel = new UserModel(payload.email);
      userModel.get((err, userData) => {
        if(!err) {
          userData['name'] = payload.name;
          userData['address'] = payload.address;
          userModel.update(userData, (err, payload) => {
            callback(err ? statusCode.SUCCESS : statusCode.SERVER_ERROR, payload);
          });
        } else {
          callback(statusCode.NOT_FOUND, helpers.errObject('User not found'));
        }
      });
    } else {
      callback(statusCode.NOT_FOUND, helpers.errObject('Missing fields to update'));
    }
  } else {
    callback(statusCode.NOT_FOUND, helpers.errObject('Missing required fields'));
  }
}

_container.delete = function(data, callback) {
  // Check if token is valid
  const tokenState = data.tokenState;
  if(!tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }
  
  const email = data.payload.email;
  if(validator.isEmail(email)) {
    // Verify that the given token is valid for the mail
    if(email === tokenState.token.email) {
      const userModel = new UserModel(email);
      // Lookup the user
      userModel.get((err, userData) => {
        if(!err && userData){
          // Delete the user's data
          userModel.delete((err) => {
            if(!err){
              // Delete each of the token associated with the user
              var userTokens = typeof(userData.tokens) == 'object' && userData.tokens instanceof Array ? userData.tokens : [];
              var tokensToDelete = userTokens.length;
              if(tokensToDelete > 0){
                var tokensDeleted = 0;
                var deletionErrors = false;
                // Loop through the checks
                userTokens.forEach((tokenId) => {
                  // Delete the check
                  const tokenModel = new TokenModel(tokenId);
                  tokenModel.delete((err) => {
                    if(err){
                      deletionErrors = true;
                    }
                    tokensDeleted++;
                    if(tokensDeleted == tokensToDelete){
                      if(!deletionErrors){
                        callback(statusCode.SUCCESS);
                      } else {
                        callback(statusCode.SERVER_ERROR, helpers.errObject(`Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully.`))
                      }
                    }
                  });
                });
              } else {
                callback(statusCode.SUCCESS);
              }
            } else {
              callback(statusCode.SERVER_ERROR, helpers.errObject('Could not delete the specified user'));
            }
          });
        } else {
          callback(statusCode.NOT_FOUND, helpers.errObject('Could not find the specified user.'));
        }
      });
    } else {
      callback(statusCode.UNAUTHORIZED, helpers.errObject('Missing required token in header, or token is invalid.'));
    }
  } else {
    callback(statusCode.NOT_FOUND, helpers.errObject('Missing required fields'))
  }
}

const userController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = userController;