var fs = require('fs');
var path = require('path');

class DataORM {
  baseDir = path.join(__dirname,'/../.data/');

  constructor(model, primaryKey) {
    this.model = model;
    this.primaryKey = primaryKey;
    this.jsonFile = this.baseDir+this.model+'/'+this.primaryKey+'.json';
  }

  exists(callback) {
    fs.readFile(this.jsonFile, 'utf8', function(err) {
      if(err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

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
}

module.exports = DataORM;