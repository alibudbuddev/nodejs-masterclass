const DataORM = require('../../lib/data-orm');
const helpers = require('./../../lib/helpers');

class OrderModel extends DataORM {

  constructor(primaryKey) {
    super('orders', primaryKey);
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
        callback(true, helpers.errObject('Could not find the specified order for '+this.primaryKey));
      }
    });
  }

  /*
   * Create order
   * @param {function} callback
   */
  createOrUpdate(orderObj, callback) {
    this.find((err, currentOrderObj) => {
      if(!err) {
        currentOrderObj.push(orderObj);
        this.update(currentOrderObj, (err, payload) => {
          callback(err, payload);
        });
      } else {
        this.save([orderObj], (err, payload) => {
          callback(err, payload);
        });
      }
    });
  }

  /*
   * Create order
   * @param {function} callback
   */
  update(order, callback) {
    this.edit(order, (err, data) => {
      if(!err){
        callback(false, data);
      } else {
        callback(true, {'error' : 'Could not update order'});
      }
    });
  }

  /*
   * Create order
   * @param {function} callback
   */
  save(orderObject, callback) {
    this.create(orderObject, (err) => {
      console.log(err);
      if(!err) {
        callback(false, orderObject);
      } else {
        callback(true, helpers.errObject('Could not create the new order'));
      }
    });
  }

  /*
   * Delete order
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

module.exports = OrderModel;