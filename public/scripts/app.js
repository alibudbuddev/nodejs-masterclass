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

app.prepareControllers = () => {
  const cartTotalItemCountEl = document.querySelector('.js-cart-total-items');
  if(cartTotalItemCountEl) {
    app['cartTotalItemCountEl'] = cartTotalItemCountEl;
  }

  const cartAlertHeaderEl = document.querySelector('.js-cart-alert-header');
  if(cartAlertHeaderEl) {
    app['cartAlertHeaderEl'] = cartAlertHeaderEl;
  }
};

app.getTotalCartItems = () => {
  NJSMC_HTTP.request(undefined, '/api/cart', 'GET', {}, {}, (statusCode, responsePayload) => {
    if(statusCode == 200 && responsePayload.length > 0) {
      app.cart = responsePayload;
      app.cartTotalItemCountEl.innerHTML = responsePayload.length;
      app.cartAlertHeaderEl.style.display = 'flex';
    }
  });
};