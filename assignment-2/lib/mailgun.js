const https = require('https');
const querystring = require('querystring');
const config = require('./config');
const statusCode = require('./status-code');

class MailGun {
  send(body, callback) {
    // Configure the request payload
    const stringPayload = querystring.stringify(body);

    const options = {
      'hostname' : 'api.mailgun.net',
      'path': `/v3/${config.mailgunDomain}/messages`,
      'method': 'POST',
      'headers' : {
        'Content-Length': Buffer.byteLength(stringPayload),
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : `Basic ${config.mailgunApiKey}`    
      }
    };

    const req = https.request(options, (res) => {
      if(res.statusCode === statusCode.SUCCESS) {
        callback(false);
      } else {
        callback(true);
      }
      
      res.on('data', (data) => {
        console.log(`${data}`);
      });

    });

    // Add the payload
    req.write(stringPayload);

    // Bind to the error event so it doesn't get thrown
    req.on('error', (err) => {
      console.log(`ERROR: ${err}`);
    });

    // End the request
    req.end();
  }
}

module.exports = MailGun;