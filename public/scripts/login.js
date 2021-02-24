const NJSMC_LOGIN = {
  init: () => {
    const loginFormEl = document.querySelector('.js-login-form');
    if(loginFormEl) {
      loginFormEl.addEventListener("submit", (e) => {

        // Stop it from submitting
        e.preventDefault();
        const formId = e.target.getAttribute('id');
        const path = e.target.getAttribute('action');
        const method = e.target.getAttribute('method').toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown due to a previous error)
        if(document.querySelector("#"+formId+" .formSuccess")){
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }

        const payload = NJSMC_FORM.serialize(loginFormEl.elements);
        console.log(payload);

        // If the method is DELETE, the payload should be a queryStringObject instead
        const queryStringObject = method == 'DELETE' ? payload : {};

        // Call the API
        NJSMC_HTTP.request(undefined, path, method, queryStringObject, payload, (statusCode, responsePayload) => {
          // Display an error on the form if needed
          if(statusCode !== 200){

            if(statusCode == 403){
              // log the user out
              app.logUserOut();

            } else {

              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.error) == 'string' ? responsePayload.error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            // If successful, send to form response processor
            app.formResponseProcessor(formId, payload, responsePayload);
          }

        });
      });
    }
  }
};

NJSMC_LOGIN.init();