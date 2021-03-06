const NJSMC_SIGNUP = {
  init: () => {
    const signUpFormEl = document.querySelector('form');
    if(signUpFormEl) {
      signUpFormEl.addEventListener('submit', (e) => {

        // Stop it from submitting
        e.preventDefault();
        const {formId, path, method} = NJSMC_FORM.getFormMeta(e);
        NJSMC_FORM.toggleAlerts(formId);

        // Call the API
        const payload = NJSMC_FORM.serialize(signUpFormEl.elements);
        NJSMC_HTTP.request(undefined, path, method, payload, payload, (statusCode, responsePayload) => {
          // Display an error on the form if needed
          if(statusCode !== 200) {
            if(statusCode == 403) {
              // log the user out
              app.logUserOut();

            } else {
              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.error) == 'string' ? responsePayload.error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector('#'+formId+' .formError').innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector('#'+formId+' .formError').style.display = 'block';
            }
          } else {
            // If successful, send to form response processor
            NJSMC_SIGNUP.formResponseProcessor(payload, formId);
          }
        });
      });
    }
  },

  formResponseProcessor: (payload, formId) => {
    // Take the phone and password, and use it to log the user in
    var newPayload = {
      'email' : payload.email,
      'password' : payload.password
    };

    NJSMC_HTTP.request(undefined, '/api/auth', 'POST', undefined, newPayload, (newStatusCode,newResponsePayload) => {
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        NJSMC_TOKENS.setSessionToken(newResponsePayload);
        window.location = '/';
      }
    });
  }
  
};

NJSMC_SIGNUP.init();