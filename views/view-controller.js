
/*
 * View Controller
 *
 */

const statusCode = require('./../lib/status-code');
const helpers = require('./../lib/helpers');

// Auth view container
const viewConroller = {};

// Public assets
viewConroller.public = (data, callback) => {
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Get the filename being requested
    var trimmedAssetName = data.path.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, (err,data) => {
        if(!err && data){

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          // Callback the data
          callback(statusCode.SUCCESS, data, contentType);
        } else {
          callback(statusCode.NOT_FOUND);
        }
      });
    } else {
      callback(statusCode.NOT_FOUND);
    }

  } else {
    callback(statusCode.NOT_ALLOWED_METHOD);
  }
};

// Not Found handler
viewConroller.notFound = (data, callback) => {
  callback(statusCode.NOT_FOUND, helpers.errObject('Page or Request not found'));
};

// Export the controller
module.exports = viewConroller;