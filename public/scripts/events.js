const NJSMC_EVENTS = {
  // Bind the logout button
  bindLogoutButton = function(){
    document.getElementById('logoutButton').addEventListener('click', (e) => {

      // Stop it from redirecting anywhere
      e.preventDefault();

      // Log the user out
      NJSMC_EVENTS.logUserOut();
    });
  },

  // Log the user out then redirect them
  logUserOut = function(redirectUser){
    // Set redirectUser to default to true
    redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

    // Get the current token id
    var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

    // Send the current token to the tokens endpoint to delete it
    var queryStringObject = {
      'id' : tokenId
    };
    NJSMC_HTTP.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
      // Set the app.config token as false
      NJSMC_SESSION.setSessionToken(false);

      // Send the user to the logged out page
      if(redirectUser){
        window.location = '/session/deleted';
      }

    });
  }
};