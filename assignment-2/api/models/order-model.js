const DataORM = require('../../lib/data-orm');
const helpers = require('./../../lib/helpers');

class OrderModel extends DataORM {

  constructor(primaryKey) {
    super('orders', primaryKey);
    this.data = undefined;
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
        callback(true, helpers.errObject('Could not find the specified order for '+this.primaryKey));
      }
    });
  }

  /*
   * Create/Update model data
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
   * Update model data
   * @param {object} user - JSON data
   * @param {function} callback
   */
  update(order, callback) {
    this.edit(order, (err, data) => {
      this.updateData(data);
      if(!err){
        callback(false, data);
      } else {
        callback(true, {'error' : 'Could not update order'});
      }
    });
  }

  /*
   * Create model data
   * @param {object} cartObject - JSON data
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
    this.data = data;
    this.data['total'] = this.generateTotal();
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

module.exports = OrderModel;