const DataORM = require('./../../data-orm');
const UserModel = require('./../../../api/models/user-model');

const getUser = (email) => {
  const userModel = new UserModel(email);
    userModel.get((err, payload) => {
      if(!err) {
        console.log(payload);
      } else {
        console.log(`User ID: ${email} doesn't exist`);
      };
    });
}

const users = (cli, id) => {
  const arr = id.split('--');

  if(arr[1]) {
    const email = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    getUser(email);
  } else {
    const dataOrm = new DataORM('users', undefined);
    dataOrm.list('users', (err, emails) => {
      if(!err && emails && emails.length > 0){
        cli.verticalSpace();
        emails.forEach((email) => {
          getUser(email);
        });
      }
    });
  }
};

module.exports = users;