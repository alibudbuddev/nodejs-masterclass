/*
 * Reusable module to route controller's requests based on supported methods
 *
 */

var requestHandler = {};

requestHandler.supportedMethods = ['post','get','put','delete'];

// Reusable method to handle diffrent request method
requestHandler.handler = function(data, container, callback) {
  if(requestHandler.supportedMethods.indexOf(data.method) > -1){
    if(container[data.method]) {
      container[data.method](data, callback);
    } else {
      callback(405);
    }
  } else {
    callback(405);
  }
};

module.exports = requestHandler;