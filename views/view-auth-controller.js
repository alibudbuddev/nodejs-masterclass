
/*
 * View Auth Controller
 *
 */

const statusCode = require('./../lib/status-code');

// Auth view container
const viewAuthConroller = {};

viewAuthConroller.get = (data, callback) => {
 callback(statusCode.success);
}

viewAuthConroller.delete = (data, callback) => {
  callback(statusCode.success);
 }

// Export the controller
module.exports = viewAuthConroller;