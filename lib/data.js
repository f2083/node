var fs = require('fs');
var path = require('path');

var lib ={};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, file, data, callback) {
	//open file for reading
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err,fileDescriptor){
		if(!err && fileDescriptor){
			//Convert data to string
			var stringData = JSON.stringify(data);

			//Write to file and  close it
			fs.writeFile(fileDescriptor, stringData, function(err){
				if(!err){
					fs.close(fileDescriptor, function(err){
						if(!err){
							callback(false);
						} else {
							callback('Error closing new file');
						}	
					});
				} else {
					callback('Error writing to new file');
				}
			});
		} else {
			callback('Could not create new file, it may allready exist');
		}
	});
}

module.exports = lib;