"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require('http'); //Http library
var fs = require('fs'); //Library to access Filesystem
var port = 3433; //Listening port

function serveImage(filename, req, res){
	fs.readFile('images/' + filename, function(err, body){
			if(err){
				console.error(err);
				res.statusCode = 500;
				res.statusMessage = "Whoops, server error";
				res.end("Uh-oh");
				return;
			}
		res.setHeader("Content-Type", "image/jpeg");
		res.end(body);
	});
			
	}

//Creates a server
var server = http.createServer(function(req, res){
	
	switch(req.url){
		case "/chess":
			serveImage('chess.jpg', req, res);
			break;
		case "/fern":
		case "/fern/":
		case "/fern.jpg":
		case "/fern.jpeg":
			serveImage('fern.jpg', req, res);
			break;
		default:
			res.statusCode = 404;
			res.statusMessage = "Not found";
			res.end();
			break;
	}
});

//Server is listening on port
server.listen(port, function(){
	console.log("Listening on Port: " + port);
});




