const orders = (cli, id) => {
  const arr = id.split('--');

  if(arr[1]) {
    const orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    console.log('display order details');
  } else {
    console.log('display orders list');
  }
};

module.exports = orders;