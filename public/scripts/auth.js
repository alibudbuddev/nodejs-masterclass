const NJSMC_AUTH = {
  check: (callback) => {
    NJSMC_HTTP.request(undefined, '/api/users', 'GET', {}, {}, (statusCode) => {
      // Redirect to products if user is authenticated and if in root URL
      if(statusCode == 200 && location.pathname == '/') {
        window.location = '/products';
      } else if(statusCode == 200 && location.pathname != '/') {
        callback(true);
      }
    });
  },

  // Log the user out then redirect them
  logUserOut: (redirectUser) => {
    // Set redirectUser to default to true
    redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

    // Get the current token id
    var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

    // Send the current token to the tokens endpoint to delete it
    var queryStringObject = {
      'id' : tokenId
    };
    NJSMC_HTTP.request(undefined,'api/auth','DELETE',queryStringObject,undefined, (statusCode,responsePayload) => {
      // Set the app.config token as false
      NJSMC_TOKENS.setSessionToken(false);

      // Send the user to the logged out page
      if(redirectUser) {
        window.location = '/';
      }

    });
  }
};