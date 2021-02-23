const DataORM = require('../../lib/data-orm');
const helpers = require('./../../lib/helpers');

class TokenModel extends DataORM {

  constructor(primaryKey) {
    super('tokens', primaryKey);
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
        callback(true, helpers.errObject('Could not find the specified token for '+this.primaryKey));
      }
    });
  }

  /*
   * Create model data
   * @param {object} cartObject - JSON data
   * @param {function} callback
   */
  save(tokenObject, callback) {
    this.create(tokenObject, (err) => {
      if(!err) {
        callback(false, tokenObject);
      } else {
        callback(true, helpers.errObject('Could not create the new token'));
      }
    });
  }

  /*
   * Delete model data
   * @param {function} callback
   */
  delete(callback) {
    this.truncate((err) => {
      if(!err) {
        callback(false, {});
      } else {
        callback(true, helpers.errObject('Could not delete the specified token'));
      }
    });
  }
}

module.exports = TokenModel;