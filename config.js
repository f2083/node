var environments = {};

environments.staging = {
	'httpPort': 3001,
	'httpsPort': 3002,
	'envName': 'staging' 
};

environments.production = {
	'httpPort': 5001,
	'httpsPort': 5002,
	'envName': 'production' 
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ?
							process.env.NODE_ENV.toLowerCase() 
							: '';


var environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? 
							environments[currentEnvironment] : 
							environments.staging;

module.exports = environmentToExport;