const NJSMC_PRODUCT = {
  get: (callback) => {
    NJSMC_HTTP.request(undefined, '/api/products', 'GET', {}, {}, (statusCode, responsePayload) => {
      if(statusCode == 200) {
        callback(responsePayload);
      } else {
        callback([]);
      }
    });
  }
};