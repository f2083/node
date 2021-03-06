
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
	console.log(data.method);
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
};

//Users submethods container

handlers._users = {};

//required data: firstName, lastName, phone, password, tosChecked

handlers._users.post = function(data, callback){
	var payload = data.payload;
	console.log(payload)
	var firstName = typeof(payload.firstName) === 'string' && payload.firstName.trim().length > 0 
					? payload.firstName.trim() : false;
	var lastName = typeof(payload.lastName) === 'string' && payload.lastName.trim().length > 0 
					? payload.lastName.trim() : false;
	var phone = typeof(payload.phone) === 'string' && payload.phone.trim().length === 10 
					? payload.phone.trim() : false;
	var password = typeof(payload.hashedPassword) === 'string' && payload.hashedPassword.trim().length > 0 
					? payload.hashedPassword.trim() : false;
	var tosChecked = typeof(payload.tosChecked) === 'boolean' && payload.tosChecked;
	//Check if user allready exists
	if (firstName && lastName && phone && password && tosChecked) {
		_data.read('users', phone, function(err, data){
			if (err) {
				//hash the password
				var hashedPassword = helpers.hash(password);

				if(hashedPassword) {

					var userObject = {
						'firstName': firstName,
						'lastName': lastName,
						'phone': phone,
						'hashedPassword': hashedPassword,					
						'tosChecked': true
					};
					
					/*
					curl -X POST -H "Content-Type:application/json" -d '{"firstName":"firstName","lastName":"lastName","phone":"1234567890","hashedPassword":"hashedPassword","tosChecked":true}' http://localhost:3001/users

					*/

					//store the user
					_data.create('users', phone, userObject, function(err){
						if(!err){
							callback(200);
						} else {
							console.log(err);
							console.log(500, {'Error': 'Could not create the new user'})
						}
					});
				} else {
					callback(500, {'Error': 'Could not hash the users password'})
				}
				
			} else {
				callback(400, {'Error': 'User is exist'});
			}
		});
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

//required data phone
handlers._users.get = function(data, callback){
	var query = data.queryStringObj;
	var phone = typeof(query.phone) === 'string' && query.phone.trim().length === 10 
					? query.phone.trim() : false;
	if(phone){
		_data.read('users', phone, function (err,data){
			if(!err && data){
				delete data.hashedPassword;
				callback(200, data);
			} else {
				callback(404);			
			}		
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}				
};
handlers._users.put = function(data, callback){
	
};
handlers._users.delete = function(data, callback){
	
};

module.exports = handlers;