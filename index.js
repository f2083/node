var http = require('http');
var https = require('https');
var url = require('url');
var fs =require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var _data = require('./lib/data');
var handlers = require('./lib/handlers');

//http server
var httpServer = http.createServer(function(req, res){
	unifiedServer(req, res);
});

httpServer.listen(config.httpPort, console.log('httpServer up end running on port ' + config.httpPort));

//https server
var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res){
	unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, console.log('httpsServer up end running on port ' + config.httpsPort));


var unifiedServer = function(req, res){
	var parsedUrl = url.parse(req.url, true);
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/\/+|\/+$/g, '');
	var method = req.method.toLowerCase();
	var queryStringObj = parsedUrl.query;
	var headers = req.headers;
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data', function(data){
		buffer += decoder.write(data);
	});

	req.on('end', function(){
		buffer += decoder.end();

		//choose the handler
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		//construct data obj
		var data = {
			'trimmedPath': trimmedPath,
			'method': method,
			'queryStringObj': queryStringObj,
			'headers': headers,
			'payload': buffer
		};

		//route the request

		chosenHandler(data, function(statusCode, payload){
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};

			var payloadString = JSON.stringify(payload);

			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			console.log('return this respons: ' + statusCode, payloadString);
		});		
		
	});
};

// request router
var router = {
	'ping': handlers.sample,
	'users': handlers.users
};