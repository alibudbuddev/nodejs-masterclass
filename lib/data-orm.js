var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

class DataORM {
  baseDir = path.join(__dirname,'/../.data/');

  constructor(model, primaryKey) {
    this.model = model;
    this.primaryKey = primaryKey;
    this.jsonFile = this.baseDir+this.model+'/'+this.primaryKey+'.json';
  }

  /*
   * Check if file exists.
   * @param {function} callback
   */
  exists(callback) {
    fs.readFile(this.jsonFile, 'utf8', function(err) {
      if(err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  /*
   * Find file data.
   * @param {function} callback
   */
  find(callback) {
    fs.readFile(this.jsonFile, 'utf8', function(err, data) {
      if(!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    });
  }

  /*
   * Create a file.
   * @param {object} data - JSON data
   * @param {function} callback
   */
  create(data, callback) {
    // Open the file for writing
    fs.open(this.jsonFile, 'wx', function(err, fileDescriptor) {
      if(!err && fileDescriptor){
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, function(err) {
          if(!err){
            fs.close(fileDescriptor, function(err) {
              if(!err){
                callback(false);
              } else {
                callback('Error closing new file');
              }
            });
          } else {
            callback('Error writing to new file');
          }
        });
      } else {
        callback('Could not create new file, it may already exist');
      }
    });
  
  };

  /*
   * Delete file.
   * @param {function} callback
   */
  truncate(callback) {
    fs.unlink(this.jsonFile, function(err) {
      callback(err);
    });
  };

  /*
   * Update file.
   * @param {object} data - JSON data
   * @param {function} callback
   */
  edit(data, callback) {
    // Open the file for writing
    fs.open(this.jsonFile, 'r+', function(err, fileDescriptor) {
      if(!err && fileDescriptor){
        // Convert data to string
        var stringData = JSON.stringify(data);
  
        // Truncate the file
        fs.ftruncate(fileDescriptor,function(err) {
          if(!err) {
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
              if(!err){
                fs.close(fileDescriptor, function(err) {
                  if(!err) {
                    callback(false, helpers.parseJsonToObject(stringData));
                  } else {
                    callback('Error closing existing file');
                  }
                });
              } else {
                callback('Error writing to existing file');
              }
            });
          } else {
            callback('Error truncating file');
          }
        });
      } else {
        callback('Could not open file for updating, it may not exist yet');
      }
    });
  
  };
}

module.exports = DataORM;