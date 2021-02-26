const help = require('./responders/help');
const users = require('./responders/users');
const products = require('./responders/products');
const orders = require('./responders/orders');

const eventHandler = (e, cli) => {
  e.on('products', () => {
    products(cli);
  });

  e.on('orders', (id) => {
    orders(cli, id);
  });

  e.on('users', (email) => {
    users(cli, email);
  });

  e.on('help', () => {
    help(cli);
  });

  e.on('exit', () => {
    process.exit(0);
  });
};

module.exports= eventHandler;