const mock = require('./../../../api/util/mock');

const products = (cli) => {
  mock.products.forEach((product) => {
      console.log(product);
      cli.verticalSpace();
  });
};

module.exports = products;