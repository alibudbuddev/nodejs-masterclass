const NJSMC_SESSION = {
  // Get the session token from localstorage and set it in the app.config object
  getSessionToken: () => {
    var tokenString = localStorage.getItem('token');
    if(typeof(tokenString) == 'string'){
      try{
        var token = JSON.parse(tokenString);
        app.config.sessionToken = token;
        if(typeof(token) == 'object'){
          app.setLoggedInClass(true);
        } else {
          app.setLoggedInClass(false);
        }
      }catch(e){
        app.config.sessionToken = false;
        app.setLoggedInClass(false);
      }
    }
  },

  // Set the session token in the app.config object as well as localstorage
  setSessionToken: (token) => {
    app.config.sessionToken = token;
    var tokenString = JSON.stringify(token);
    localStorage.setItem('token',tokenString);
    if(typeof(token) == 'object'){
      app.setLoggedInClass(true);
    } else {
      app.setLoggedInClass(false);
    }
  },

  // Renew the token
  renewToken: (callback) => {
    var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    if(currentToken){
      // Update the token with a new expiration
      var payload = {
        'id' : currentToken.id,
        'extend' : true,
      };
      app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
        // Display an error on the form if needed
        if(statusCode == 200){
          // Get the new token details
          var queryStringObject = {'id' : currentToken.id};
          app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
            // Display an error on the form if needed
            if(statusCode == 200){
              app.setSessionToken(responsePayload);
              callback(false);
            } else {
              app.setSessionToken(false);
              callback(true);
            }
          });
        } else {
          app.setSessionToken(false);
          callback(true);
        }
      });
    } else {
      app.setSessionToken(false);
      callback(true);
    }
  }
}