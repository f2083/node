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
};

lib.read = function(dir, file, callback){
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data){
		callback(err, data);
	});
};

lib.update = function(dir, file, data, callback){
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err,fileDescriptor){
		if(!err && fileDescriptor){
			//Convert data to string
			var stringData = JSON.stringify(data);

			//Truncate the file
			fs.truncate(fileDescriptor, function(err){
				//Write to file and  close it
				if(!err){
					fs.writeFile(fileDescriptor, stringData, function(err){
						if(!err){
							fs.close(fileDescriptor, function(err){
								if(!err){
									callback(false);
								} else {
									callback('Error closing the file');
								}	
							});
						} else {
							callback('Error writing to existing file');
						}
					});
				} else {
					callback('Error truncating file');
				}
			});
		} else {
			callback('Could not open the file, it may not exist');
		}
	});
};

lib.delete = function(dir, file, callback){
	fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err){
		if(!err){
			callback(false);
		} else {
			callback('Error deleting file');
		}
	});
};

module.exports = lib;