var https = require('https');
var querystring = require('querystring');
const { callbackify } = require('util');

class Stripe {
  constructor(secretKey) {
    this.secretKey = secretKey;
    this.defaultRequestOptions = {
      'hostname' : 'api.stripe.com',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : `Basic ${secretKey}`    
      }
    };
  }

  authenticate() {
    // Configure the request payload
    const stringPayload = querystring.stringify({});

    // Instantiate the request object
      const req = this.request('/v1/charges', 'GET', stringPayload, (res) => {
      console.log(res.statusCode);
      console.log(res.headers);
      res.on('data', (body) => {
        console.log('BODY: ' + body);
      });
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      console.log(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  }

  charge() {
    // Configure the request payload
    const stringPayload = querystring.stringify({
      amount: 100,
      currency: 'cad',
      source: 'tok_mastercard',
      description: 'My First Test Charge'
    });

    // Instantiate the request object
    const req = this.request('/v1/charges', 'POST', stringPayload, (res) => {
      console.log(res.statusCode);
      console.log(res.headers);
      res.on('data', (body) => {
        console.log('BODY: ' + body);
      });
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      console.log(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  }



  request(path, method, stringPayload, callback) {
    let options = this.defaultRequestOptions;
    options['path'] = path;
    options['method'] = method;
    options.headers['Content-Length'] = Buffer.byteLength(stringPayload);
    return https.request(options, (res) => {
      callback(res);
    });
  }
}

const stripe = new Stripe('c2tfdGVzdF81MUlNRHVzRWhtSUxCUE1vU1VhQkZETjY0TzRWcHZ1SmxVdWswRXRzWFpockJKRkFRVHRoZXAydmNsc2dQVnhtenJpS0prdFlzYzNIbTdhOUxKZjJvY3l4cDAweExYRkRYSHM6');
stripe.authenticate();