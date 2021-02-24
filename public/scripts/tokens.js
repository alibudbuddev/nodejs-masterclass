const NJSMC_TOKENS = {
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
  }
}