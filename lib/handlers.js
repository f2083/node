
var _data = require('./data');
var helpers = require('./helpers');
//handlers
var handlers = {};

handlers.notFound = function(data, callback){
	callback(404);
};

handlers.ping = function(data, callback){
	callback(200);
};

handlers.users = function(data, callback){
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._users(data, callback);
	} else {
		callback(405);
	}
};

//Users submethods container

var handlers._users = {};

//required data: firstName, lastName, phone, password, tosChecked

handlers._users.get = function(data, callback){
	var payload = data.payload;
	var firstName = typeOf(payload.firstName) === 'string' && payload.firstName.trim().length > 0 
					? payload.firstName.trim() : false;
	var lastName = typeOf(payload.lastName) === 'string' && payload.lastName.trim().length > 0 
					? payload.lastName.trim() : false;
	var phone = typeOf(payload.phone) === 'string' && payload.phone.trim().length === 10 
					? payload.phone.trim() : false;
	var password = typeOf(payload.password) === 'string' && payload.password.trim().length > 0 
					? payload.password.trim() : false;
	var tosChecked = typeOf(payload.tosChecked) === 'boolean' && payload.tosChecked;
	//Check if user allready exists
	if (firstName && lastName && phone && password && tosChecked) {
		_data.read('users', phone, function(err, data){
			if (err) {
				//hash the password
				var hashedPassword = helpers.hash(password);

				var userObject = {
					'firstName': firstName,
					'lastName': lastName,
					'phone': phone,
					'hashedPassword': hashedPassword,					
					'tosChecked': true
				};

				//store the user
				
			} else {
				callback(400, {'Error': 'User is exist'});
			}
		});
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};
handlers._users.post = function(data, callback){
	
};
handlers._users.put = function(data, callback){
	
};
handlers._users.delete = function(data, callback){
	
};

module.export = handlers;