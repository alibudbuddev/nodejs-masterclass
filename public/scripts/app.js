const app = {};

// Config
app.config = {
  'sessionToken' : false
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = (add) => {
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};