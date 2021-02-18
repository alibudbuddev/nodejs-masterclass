var DataORM = require('./../../lib/data-orm');
var helpers = require('./../../lib/helpers');
var statusCode = require('./../../lib/status-code');

class UserModel extends DataORM {
  constructor(primaryKey) {
    super('users', primaryKey);
  }

  // isExist(callback) {
  //   return this.exists(callback);
  // }

  get(callback) {
    this.find(function(err, data) {
      if(!err && data) {
        callback(true, data);
      } else {
        callback(false);
      }
    });
  }

  notExist(callback) {
    this.exists(function(exists) {
      if(!exists) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  save(user, callback) {
    // Generate a hashed password
    var hashedPassword = helpers.hash(user.password);

    if(hashedPassword) {
      user['hashedPassword'] = hashedPassword;
      delete user['password'];
      // Store the user
      this.create(user, function(err) {
        if(!err){
          callback(statusCode.SUCCESS);
        } else {
          callback(statusCode.SERVER_ERROR, {'error' : 'Could not create the new user'});
        }
      });
    } else {
      callback(statusCode.SERVER_ERROR, {'error' : 'Could not hash the user\'s password.'});
    }
  }
}

module.exports = UserModel;