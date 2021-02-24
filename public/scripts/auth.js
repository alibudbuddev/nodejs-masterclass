const NJSMC_AUTH = {
  check: () => {
    NJSMC_HTTP.request(undefined, '/api/users', 'GET', {}, {}, (statusCode) => {
      // Redirect to products if user is authenticated and if in root URL
      if(statusCode == 200 && location.pathname == '/') {
        window.location = '/products';
      }
    });
  }
};