const users = (cli, email) => {
  const arr = email.split('--');

  if(arr[1]) {
    const email = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    console.log('display user details');
  } else {
    console.log('display user list');
  }
};

module.exports = users;
