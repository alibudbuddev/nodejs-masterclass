const DataORM = require('../../lib/data-orm');
const helpers = require('./../../lib/helpers');

class CartModel extends DataORM {

  constructor(primaryKey) {
    super('cart', primaryKey);
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
   * Create/Update model data
   * @param {function} callback
   */
  createOrUpdate(cartObj, callback) {
    this.find((err, currentCartObj) => {
      if(!err) {
        currentCartObj.push(cartObj);
        this.update(currentCartObj, (err, payload) => {
          callback(err, payload);
        });
      } else {
        this.save([cartObj], (err, payload) => {
          callback(err, payload);
        });
      }
    });
  }

  /*
   * Update model data
   * @param {object} user - JSON data
   * @param {function} callback
   */
  update(user, callback) {
    this.edit(user, (err, data) => {
      if(!err){
        callback(false, data);
      } else {
        callback(true, {'error' : 'Could not update user'});
      }
    });
  }

  /*
   * Create model data
   * @param {object} cartObject - JSON data
   * @param {function} callback
   */
  save(cartObject, callback) {
    this.create(cartObject, (err) => {
      if(!err) {
        callback(false, cartObject);
      } else {
        callback(true, helpers.errObject('Could not create the new cart'));
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

module.exports = CartModel;