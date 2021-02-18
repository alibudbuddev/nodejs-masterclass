const DataORM = require('./../../lib/data-orm');
const helpers = require('./../../lib/helpers');
const statusCode = require('./../../lib/status-code');

class UserModel extends DataORM {
  
  constructor(primaryKey) {
    super('users', primaryKey);
    this.data = undefined;
  }

  get(callback) {
    this.find((err, data) => {
      if(!err && data) {
        this.data = data;
        callback(false, data);
      } else {
        callback(true);
      }
    });
  }

  notExist(callback) {
    this.exists((exists) => {
      if(!exists) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  save(user, callback) {
    // Generate a hashed password
    const hashedPassword = helpers.hash(user.password);

    if(hashedPassword) {
      user['hashedPassword'] = hashedPassword;
      delete user['password'];
      // Store the user
      this.create(user, (err) => {
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

  update(user, callback) {
    this.edit(user, (err) => {
      if(!err){
        callback(statusCode.SUCCESS);
      } else {
        callback(statusCode.SERVER_ERROR, {'error' : 'Could not update user'});
      }
    });
  }

  /*
   * Delete user
   * @param {function} callback
   */
  delete(callback) {
    this.truncate((err) => {
      if(!err) {
        callback(false);
      } else {
        callback(true, helpers.errObject('Could not delete the specified user'));
      }
    });
  }
}

module.exports = UserModel;