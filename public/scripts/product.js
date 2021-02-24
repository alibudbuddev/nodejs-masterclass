const NJSMC_PRODUCT = {
  get: () => {
    NJSMC_HTTP.request(undefined, '/api/products', 'GET', {}, {}, (statusCode, responsePayload) => {
      console.log(responsePayload);
    });
  }
};