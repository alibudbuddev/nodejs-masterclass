const DataORM = require('./../../lib/data-orm');
const helpers = require('./../../lib/helpers');
const statusCode = require('./../../lib/status-code');

class UserModel extends DataORM {
  
  constructor(primaryKey) {
    super('users', primaryKey);
    this.data = undefined;
  }

  /*
   * Get model data
   * @param {function} callback
   */
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

  /*
   * Check model if exist
   * @param {function} callback
   */
  notExist(callback) {
    this.exists((exists) => {
      if(!exists) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  /*
   * Create model data
   * @param {object} cartObject - JSON data
   * @param {function} callback
   */
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

  /*
   * Update model data
   * @param {object} user - JSON data
   * @param {function} callback
   */
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