
/*
 * Product Controller
 *
 */

 requestHandler = require('./../util/request-handler');
 const statusCode = require('./../../lib/status-code');
 
// Product controller container
const _container = {};

const products = [
  { 'name': 'Cheese', 'price' : 2.50, 'location': 'Refrigerated foods'},
  { 'name': 'Crisps', 'price' : 3, 'location': 'the Snack isle'},
  { 'name': 'Pizza', 'price' : 4, 'location': 'Refrigerated foods'},
  { 'name': 'Chocolate', 'price' : 1.50, 'location': 'the Snack isle'},
  { 'name': 'Self-raising flour', 'price' : 1.50, 'location': 'Home baking'},
  { 'name': 'Ground almonds', 'price' : 3, 'location': 'Home baking'}
];

_container.get = (data, callback) => {
  // Check if token is valid
  if(!data.tokenState.valid) {
    callback(statusCode.UNAUTHORIZED);
    return;
  }

  callback(statusCode.success, products);
}

const productController = (data, callback) => {
  requestHandler.handler(data, _container, callback);
}

// Export the controller
module.exports = productController;