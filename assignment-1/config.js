var environments = {};

// Default environment
environments.local = {
  'httpPort' : 3000,
  'envName' : 'local'
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.local;

module.exports = environmentToExport;