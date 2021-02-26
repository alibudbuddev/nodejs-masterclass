// Dependencies
const http = require('http');
const config = require('./lib/config');
const server = require('./lib/server');
const cli = require('./lib/cli');

 // Instantiate server
var httpServer = http.createServer((req, res) => {
  server(req, res);
});

// Start the CLI
setTimeout(() => {
  cli.init();
}, 50);

// Start the server
httpServer.listen(config.httpPort,() => {
  console.log(`NodeJS server is running on port ${config.httpPort}`);
});