const https = require('https');
const querystring = require('querystring');
const config = require('./config');

class Stripe {
  constructor() {
    this.defaultRequestOptions = {
      'hostname' : 'api.stripe.com',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : `Basic ${config.stripeSecretKey}`    
      }
    };
  }

  authenticate() {
    // Configure the request payload
    const stringPayload = querystring.stringify({});

    // Instantiate the request object
    const req = this.request('/v1/charges', 'GET', stringPayload, (res) => {
      this.logPayload(res);
    });

    this.endReq(req);
  }

  charge(body) {
    // Configure the request payload
    const stringPayload = querystring.stringify(body);

    // Instantiate the request object
    const req = this.request('/v1/charges', 'POST', stringPayload, (res) => {
      this.logPayload(res);
    });

    // Add the payload
    req.write(stringPayload);
    this.endReq(req);
  }

  logPayload(res) {
    res.on('data', (body) => {
      console.log('BODY: ' + body);
    });
  }

  endReq(req) {
    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      console.log(e);
    });

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

const stripe = new Stripe();
stripe.charge();