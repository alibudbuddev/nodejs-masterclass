// Call the init processes after the window loads
window.onload = () => {
  // Bind logout logout button
  // app.bindLogoutButton();

  // Get the token from localstorage
  NJSMC_TOKENS.getSessionToken();

  // Check if user is authenticated
  NJSMC_AUTH.check();

  // Renew token
  // app.tokenRenewalLoop();

  // Load data on page
  // app.loadDataOnPage();
};