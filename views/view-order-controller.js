
/*
 * View Auth Controller
 *
 */

const statusCode = require('./../lib/status-code');
const helpers = require('./../lib/helpers');

// Account view container
const viewOrderConroller = {};

viewOrderConroller.get = (data, callback) => {
  // Reject any request that isn't a GET
  if(data.method == 'get'){
   // Prepare data for interpolation
   var templateData = {
     'head.title' : 'Login to your account.',
     'head.description' : 'Please enter your phone number and password to access your account.',
     'body.class' : 'sessionCreate'
   };
   // Read in a template as a string
   helpers.getTemplate('order', templateData, (err, str) => {
     if(!err && str){
       // Add the universal header and footer
       helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if(!err && str){
          // Return that page as HTML
          callback(statusCode.SUCCESS, str, 'html');
        } else {
          callback(statusCode.SERVER_ERROR, helpers.errObject(err));
        }
       });
     } else {
      callback(statusCode.SERVER_ERROR, helpers.errObject(err));
     }
   });
 } else {
  callback(statusCode.NOT_ALLOWED_METHOD, helpers.errObject(err));
 }
}

// Export the controller
module.exports = viewOrderConroller;