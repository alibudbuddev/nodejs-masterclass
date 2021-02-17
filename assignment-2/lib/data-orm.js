var fs = require('fs');
var path = require('path');

class DataORM {
  baseDir = path.join(__dirname,'/../.data/');

  constructor(model, primaryKey) {
    this.model = model;
    this.primaryKey = primaryKey;
    this.jsonFile = this.baseDir+this.model+'/'+this.primaryKey+'.json';
  }

  /*
   * Check if user data exists.
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
   * Create a new user data.
   * @param {object} data - User object.
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
   * Delete user data.
   * @param {function} callback
   */
  delete(callback) {
    fs.unlink(this.jsonFile, function(err) {
      callback(err);
    });
  };

  /*
   * Update user data.
   * @param {object} data - User updates object.
   * @param {function} callback
   */
  update(data, callback) {
    // Open the file for writing
    fs.open(this.jsonFile, 'r+', function(err, fileDescriptor) {
      if(!err && fileDescriptor){
        // Convert data to string
        var stringData = JSON.stringify(data);
  
        // Truncate the file
        fs.truncate(fileDescriptor,function(err) {
          if(!err) {
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
              if(!err){
                fs.close(fileDescriptor, function(err) {
                  if(!err) {
                    callback(false);
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