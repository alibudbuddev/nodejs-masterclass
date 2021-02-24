var environments = {};

// Default environment
environments.local = {
  'httpPort' : 3000,
  'envName' : 'local',
  'hashingSecret': 'nodejsMasterClass',
  'stripeSecretKey': 'c2tfdGVzdF81MUlNRHVzRWhtSUxCUE1vU1VhQkZETjY0TzRWcHZ1SmxVdWswRXRzWFpockJKRkFRVHRoZXAydmNsc2dQVnhtenJpS0prdFlzYzNIbTdhOUxKZjJvY3l4cDAweExYRkRYSHM6',
  'mailgunApiKey': 'YXBpOmVhNTNmNDRmNTJiZGY3ZDJlZDViNzdlZjZkOTZmMTZiLWQzMmQ4MTdmLTY4ZTYzZGQy',
  'mailgunDomain': 'sandboxf857737fb6a349b7ba0a74a152cd06bd.mailgun.org'
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.local;

module.exports = environmentToExport;