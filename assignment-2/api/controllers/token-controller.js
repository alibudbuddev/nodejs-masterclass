
/*
 * Token Controller
 *
 */

const requestHandler = require('./../util/request-handler');
const validator = require('./../../lib/validator');
const statusCode = require('./../../lib/status-code');
const helpers = require('./../../lib/helpers');
const TokenModel = require('./../models/token-model');
const UserModel = require('./../models/user-model');
const { stat } = require('fs/promises');

// Token controller container
const _container = {};

// Tokens - post
// Required data: email, password
_container.post = (data, callback) => {
  const payload = data.payload;
  if(validator.isNotEmpty(payload.password) && validator.isEmail(payload.email)) {
    const userModel = new UserModel(data.payload.email);
    userModel.get(err => {
      if(!err) {
        // Validate password
        if(helpers.hash(data.payload.password) == userModel.data.hashedPassword) {
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
        callback(statusCode.NOT_FOUND,  {'error' : 'Could not find the specified user for '+data.payload.email});
      }
    });
  } else {
    callback(statusCode.NOT_FOUND, {'error' : 'Missing required field(s).'});
  }
}

_container.get = function(data, callback) {
  const validTokenId = helpers.validTokenId(data.queryStringObject.id);
  if(validTokenId) {
    const tokenModel = new TokenModel(validTokenId);
    tokenModel.get(err => {
      if(!err) {
        callback(err ? statusCode.SERVER_ERROR : statusCode.SUCCESS, tokenModel.data);
      } else {
        callback(statusCode.NOT_FOUND, helpers.errObject('Could not find the specified user for '+data.payload.email));
      }
    });
  } else {
    callback(400, helpers.errObject('Token invalid'));
  }
}

// NOT NEEDED YET
_container.put = function(data, callback) {
  // var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  // var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  // if(id && extend){
  //   // Lookup the existing token
  //   _data.read('tokens',id,function(err,tokenData){
  //     if(!err && tokenData){
  //       // Check to make sure the token isn't already expired
  //       if(tokenData.expires > Date.now()){
  //         // Set the expiration an hour from now
  //         tokenData.expires = Date.now() + 1000 * 60 * 60;
  //         // Store the new updates
  //         _data.update('tokens',id,tokenData,function(err){
  //           if(!err){
  //             callback(200);
  //           } else {
  //             callback(500,{'Error' : 'Could not update the token\'s expiration.'});
  //           }
  //         });
  //       } else {
  //         callback(400,{"Error" : "The token has already expired, and cannot be extended."});
  //       }
  //     } else {
  //       callback(400,{'Error' : 'Specified user does not exist.'});
  //     }
  //   });
  // } else {
  //   callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
  // }
}

_container.delete = function(data, callback) {
  const validTokenId = helpers.validTokenId(data.queryStringObject.id);
  if(validTokenId) {
    const tokenModel = new TokenModel(validTokenId);
    tokenModel.get((err, data) => {
      if(!err) {
        tokenModel.delete((err, data) => {
          callback(err ? statusCode.SERVER_ERROR : statusCode.success, data);
        });
      } else {
        callback(statusCode.NOT_FOUND, data);
      }
    });
  } else {
    callback(statusCode.NOT_FOUND, helpers.errObject('Token invalid'))
  }
}

_container.verifyToken = function(id, phone, callback) {
  // // Lookup the token
  // _data.read('tokens',id,function(err,tokenData){
  //   if(!err && tokenData){
  //     // Check that the token is for the given user and has not expired
  //     if(tokenData.phone == phone && tokenData.expires > Date.now()){
  //       callback(true);
  //     } else {
  //       callback(false);
  //     }
  //   } else {
  //     callback(false);
  //   }
  // });
}

var tokenController = function(data, callback) {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = tokenController;