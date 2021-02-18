const DataORM = require('../../lib/data-orm');
const helpers = require('./../../lib/helpers');

class TokenModel extends DataORM {

  constructor(primaryKey) {
    super('tokens', primaryKey);
    this.data = undefined;
  }

  /*
   * Get token data
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
   * Create token
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
}

module.exports = TokenModel;