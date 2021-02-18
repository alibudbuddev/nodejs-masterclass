const DataORM = require('../../lib/data-orm');
const statusCode = require('../../lib/status-code');

class TokenModel extends DataORM {

  constructor(primaryKey) {
    super('tokens', primaryKey);
    this.data = undefined;
  }
  

  /*
   * Create token
   * @param {function} callback
   */
  save(tokenObject, callback) {h
    this.create(tokenObject, (err) => {
      if(!err) {
        callback(statusCode.SUCCESS, tokenObject);
      } else {
        callback(statusCode.SERVER_ERROR, {'error' : 'Could not create the new token'});
      }
    });
  }
}

module.exports = TokenModel;