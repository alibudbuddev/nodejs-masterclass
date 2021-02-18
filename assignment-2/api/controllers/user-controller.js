
/*
 * User Controller
 *
 */

const requestHandler = require('./../util/request-handler');
const validator = require('./../../lib/validator');
const statusCode = require('./../../lib/status-code');
const UserModel = require('./../models/user-model');
const helpers = require('../../lib/helpers');

// User controller container
const _container  = {};

// Required data: name, email, address, password
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
      userModel.update(payload, (err, payload) => {
        callback(err ? statusCode.SUCCESS : statusCode.SERVER_ERROR, payload);
      });
    } else {
      callback(statusCode.NOT_FOUND, helpers.errObject('Missing fields to update'));
    }
  } else {
    callback(statusCode.NOT_FOUND, helpers.errObject('Missing required fields'));
  }
}

_container.delete = function(data, callback) {
  const email = data.payload.email;
  if(validator.isEmail(email)) {

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // // Verify that the given token is valid for the phone number
    // handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
    //   if(tokenIsValid){
    //     // Lookup the user
    //     _data.read('users',phone,function(err,userData){
    //       if(!err && userData){
    //         // Delete the user's data
    //         _data.delete('users',phone,function(err){
    //           if(!err){
    //             // Delete each of the checks associated with the user
    //             var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
    //             var checksToDelete = userChecks.length;
    //             if(checksToDelete > 0){
    //               var checksDeleted = 0;
    //               var deletionErrors = false;
    //               // Loop through the checks
    //               userChecks.forEach(function(checkId){
    //                 // Delete the check
    //                 _data.delete('checks',checkId,function(err){
    //                   if(err){
    //                     deletionErrors = true;
    //                   }
    //                   checksDeleted++;
    //                   if(checksDeleted == checksToDelete){
    //                     if(!deletionErrors){
    //                       callback(200);
    //                     } else {
    //                       callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."})
    //                     }
    //                   }
    //                 });
    //               });
    //             } else {
    //               callback(200);
    //             }
    //           } else {
    //             callback(500,{'Error' : 'Could not delete the specified user'});
    //           }
    //         });
    //       } else {
    //         callback(400,{'Error' : 'Could not find the specified user.'});
    //       }
    //     });
    //   } else {
    //     callback(403,{"Error" : "Missing required token in header, or token is invalid."});
    //   }
    // });
  } else {
    callback(statusCode.NOT_FOUND,{'error' : 'Missing required field'})
  }
}

const userController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = userController;