const DataORM = require('../../lib/data-orm');
const helpers = require('./../../lib/helpers');

class CartModel extends DataORM {

  constructor(primaryKey) {
    super('cart', primaryKey);
    this.data = {
      items: [],
      total: 0
    };
  }

  /*
   * Get model data
   * @param {function} callback
   */
  get(callback) {
    this.find((err, data) => {
      if(!err && data) {
        this.updateData(data);
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

  /*
   * Updates the data property
   * @param {object} data - JSON data
   */
  updateData(data) {
    this.data.items = data;
    this.data.total = this.generateTotal();
  }

  /*
   * Generate total order based on items
   */
  generateTotal() {
    let total = 0;
    const items = this.data.items;
    const length = items.length;
    for (let i = 0; i < length; i++) {
      total += items[i]['price'];
    }

    return total;
  }
}

module.exports = CartModel;