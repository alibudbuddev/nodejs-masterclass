const DataORM = require('./../../data-orm');
const OrderModel = require('./../../../api/models/order-model');

const getOrder = (orderId) => {
  const orderModel = new OrderModel(orderId);
    orderModel.get((err, payload) => {
      if(!err) {
        console.log(payload);
      } else {
        console.log(`Order ID: ${orderId} doesn't exist`);
      };
    });
}

const orders = (cli, id) => {
  const arr = id.split('--');

  if(arr[1]) {
    const orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    getOrder(orderId);
  } else {
    const dataOrm = new DataORM('orders', undefined);
    dataOrm.list('orders', (err, orderIds) => {
      if(!err && orderIds && orderIds.length > 0){
        cli.verticalSpace();
        orderIds.forEach((orderId) => {
          getOrder(orderId);
        });
      }
    });
  }
};

module.exports = orders;