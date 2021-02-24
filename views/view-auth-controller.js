
/*
 * View Auth Controller
 *
 */

const statusCode = require('./../lib/status-code');
const helpers = require('./../lib/helpers');

// Auth view container
const viewAuthConroller = {};

viewAuthConroller.get = (data, callback) => {
 // Reject any request that isn't a GET
 if(data.method == 'get') {
  // Read in a template as a string
  helpers.getTemplate('login', {}, (err,str) => {
    if(!err && str){
      // Add the universal header and footer
      helpers.addUniversalTemplates(str, {}, (err,str) => {
        if(!err && str){
          // Return that page as HTML
          callback(200,str,'html');
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(500,undefined,'html');
    }
  });
} else {
  callback(405,undefined,'html');
}
}

viewAuthConroller.create = (data, callback) => {
  // Reject any request that isn't a GET
  if(data.method == 'get'){
   // Read in a template as a string
   helpers.getTemplate('signup', {}, (err, str) => {
     if(!err && str){
       // Add the universal header and footer
       helpers.addUniversalTemplates(str, {}, (err, str) => {
        if(!err && str){
          // Return that page as HTML
          callback(200, str, 'html');
        } else {
          callback(500, helpers.errObject(err));
        }
       });
     } else {
      callback(500, helpers.errObject(err));
     }
   });
 } else {
  callback(405, helpers.errObject(err));
 }
}


viewAuthConroller.delete = (data, callback) => {
  callback(statusCode.success);
}

// Export the controller
module.exports = viewAuthConroller;