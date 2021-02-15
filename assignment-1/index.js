// Dependencies
var http = require('http');
var config = require('./config');
var server = require('./api/server');

 // Instantiate server
var httpServer = http.createServer(function(req, res) {
  server(req, res);
});

// Start the server
httpServer.listen(config.httpPort,function(){
  console.log(`NodeJS server is running on port ${config.httpPort}`);
});