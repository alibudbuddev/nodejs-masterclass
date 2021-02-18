
/*
 * Auth Controller
 *
 */
const requestHandler = require('./../util/request-handler');
const statusCode = require('./../../lib/status-code');
const helpers = require('./../../lib/helpers');
const UserModel = require('./../models/user-model');
const TokenModel = require('./../models/token-model');

// Cart controller container
const _container  = {};

const updateUserTokens = (userModel, userData, callback) => {
  userModel.update(userData, (responseCode, payload) => {
    callback(responseCode, payload);
  });
};

_container.post = function(data, callback) {
  if(!data.tokenState.valid) {
    const payload = data.payload;
    const userModel = new UserModel(payload.email);

    userModel.get((err) => {
      if(!err) {
        if(helpers.hash(payload.password) == userModel.data.hashedPassword) {
          const randomId = helpers.createRandomString(20);
          const tokenModel = new TokenModel(randomId);
          const newUserData = userModel.data;
          const tokenObject = {
            'email' : payload.email,
            'id' : randomId,
            'expires' : helpers.expiration
          };
          
          // Update user tokens
          newUserData['tokens'] = typeof(newUserData['tokens']) == 'object' && newUserData['tokens'] instanceof Array ? newUserData['tokens'] : [];
          newUserData.tokens.push(randomId);
          updateUserTokens(userModel, newUserData, (responseCode) => {
            if(responseCode == statusCode.SUCCESS) {
              // Store the token
              tokenModel.save(tokenObject, (err, payload) => {
                callback(err ? statusCode.SERVER_ERROR : statusCode.SUCCESS, payload);
              });
            } else {
              console.log(err);
              callback(statusCode.SERVER_ERROR);
            }
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
  const tokenState = data.tokenState;
  if(tokenState.valid) {
    const tokenModel = new TokenModel(tokenState.token.id);
    tokenModel.delete((err, data) => {
      if(!err) {
        const userModel = new UserModel(tokenState.token.email);
        userModel.get((err, userData) => {
          if(!err) {
            var userTokens = typeof(userData.tokens) == 'object' && userData.tokens instanceof Array ? userData.tokens : [];

            // Remove the deleted check from their list of tokens
            var checkPosition = userTokens.indexOf(tokenState.token.id);
            if(checkPosition > -1){
              userTokens.splice(checkPosition, 1);
              // Re-save the user's data
              userData.tokens = userTokens;
              userModel.update(userData, (statusCode, payload) => {
                callback(statusCode, payload);
              });
            } else {
              callback(500,{"Error" : "Could not find the check on the user's object, so could not remove it."});
            }
          } else {
            console.error(err);
            callback(500);
          }
        });
      } else {
        console.error(err);
        callback(500);
      }
    });
  } else {
    callback(statusCode.NOT_FOUND);
  }
}


const authController = (data, callback) => {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = authController;