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

  charge(body, callback) {
    // Configure the request payload
    const stringPayload = querystring.stringify(body);

    // Instantiate the request object
    const req = this.request('/v1/charges', 'POST', stringPayload, (res) => {
      this.handlePayload(res, (payload) => {
        callback(payload);
      });
    });

    // Add the payload
    req.write(stringPayload);
    this.endReq(req);
  }

  handlePayload(res, callback) {
    res.on('data', (data) => {
      const payload = {
        statusCode: res.statusCode,
        payload: JSON.parse(data)
      };
      callback(payload);
    });
  }

  endReq(req) {
    // Bind to the error event so it doesn't get thrown
    req.on('error', (err) => {
      console.log(`ERROR: ${err}`);
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

module.exports = Stripe;