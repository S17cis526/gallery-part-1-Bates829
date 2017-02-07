"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http'); //Http library
var fs = require('fs'); //Library to access Filesystem
var url = require('url'); //URL library
var port = 3433; //Listening port
var config = JSON.parse(fs.readFileSync('config.json')); //Loads config file
var stylesheet = fs.readFileSync('gallery.css'); //Load in css stylesheet

function getImageNames(callback){
	fs.readdir('images/', function(err, fileNames){
			if(err){
				callback(err, undefined);
			}
			else {
				callback(false, fileNames)
			}
	});
}

function imageNamesToTags(fileNames){
	return fileNames.map(function(fileName){
		return `<img src="${fileName}" alt="${fileName}"/>`;
	});
}

function serveGallery(req, res){
	getImageNames(function(err, imageNames){
		if(err){
			console.error(err);
			res.statusCode = 500;
			res.statusMessage = "Server Error";
			res.end();
			return;
		}
		res.setHeader('Content-Type', 'text/html');
		res.end(buildGallery(imageNames));
	});
}

function buildGallery(imageTags){
	var html = '<!doctype html>';
	html += '<head>';
	html += ' <title>'+ config.title + '</title>';
	html += ' <link href="gallery.css" rel="stylesheet" type="text/css"/>';
	html += '</head>';
	html += '<body>';
	html += ' <h1>' + config.title + '</h1>';
	html += '	<form action="">';
	html += '		<input type="text" name="title">';
	html += '		<input type="submit" value="Change Gallery Title">'
	html += '	</form>';
	html += '	<br/>'
	html +=   imageNamesToTags(imageTags).join('');
	html += '	<form action="" method="POST" enctype="multipart/form-data">'
	html += '		<input type="file" name="image"/>'
	html += '		<input type="submit" value="Upload Image"/>'
	html += '	</form>'
	html += ' <h1>Hello.</h1> Time is ' + Date.now();
	html += '</body>';
	return html;
}

function serveImage(filename, req, res){
	fs.readFile('images/' + filename, function(err, body){
			if(err){
				console.error(err);
				res.statusCode = 404;
				res.statusMessage = "Resource not found";
				res.end();
        return;
			}
		res.setHeader("Content-Type", "image/jpeg");
		res.end(body);
	});
}

function uploadImage(req, res){
	var body = '';
	req.on('error', funciton(){
		res.statusCode = 500;
		res.end();
	});
	req.on('data', function(data){
		body += data;
	});
	req.on('end', function(){
		fs.writeFile('filename', body, function(err){
			if(err){
				console.error(err);
				res.statusCode = 500;
				res.end();
				return;
			}
			serveGallery(req, res);
		});
	});
}

//Creates a server
var server = http.createServer(function(req, res){
	//At most, the url should have two parts -
	//a resourcfe and a querystring seperated by a ?
	var urlParts = url.parse(req.url);

	if(urlParts.query){
		var matches = /title=(.+)(&|$)/.exec(urlParts.query);
		if(matches && matches[1]){
			config.title = decodeURIComponent(matches[1]);
			fs.writeFile('config.json', JSON.stringify(config));
		}
	}
	switch(urlParts.pathname){
		case "/":
    case "/gallery":
		if(req.metod == 'GET'){
		serveGallery(req, res);
		}
		else if(req.method == 'POST'){
			uploadPicture(req, res);
		}
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet)
      break;
		default:
			serveImage(req.url, req, res);
			break;
	}
});

//Server is listening on port
server.listen(port, function(){
	console.log("Listening on Port: " + port);
});
