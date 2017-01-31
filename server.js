"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http'); //Http library
var fs = require('fs'); //Library to access Filesystem
var port = 3433; //Listening port
var stylesheet = fs.readFileSync('gallery.css');
var imageNames = ['ace.jpg', 'bubble.jpg', 'fern.jpg', 'chess.jpg', 'mobile.jpg'];


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
    case "/gallery":
      var gHtml = imageNames.map(function(filename){
        return '<img src="' + filename + '"alt=""/>';
      });
      var html = '<!doctype html>';
      html += '<head>';
      html += ' <title>Gallery</title>';
      html += ' <link href="gallery.css" rel="stylesheet" type="text/css"/>';
      html += '</head>';
      html += '<body>';
      html += ' <h1>Gallery</h1>';
      html +=   gHtml;
      html += ' <h1>Hello.</h1> Time is ' + Date.now();
      html += '</body>';
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      break;
		case "/chess":
    case "/chess/":
    case "/chess.jpg":
    case "/chess.jpeg":
			serveImage('chess.jpg', req, res);
			break;
		case "/fern":
		case "/fern/":
		case "/fern.jpg":
		case "/fern.jpeg":
			serveImage('fern.jpg', req, res);
			break;
    case "/ace":
    case "/ace/":
    case "/ace.jpg":
    case "/ace.jpeg":
      serveImage('ace.jpg', req, res);
      break;
    case "/mobile":
    case "/mobile/":
    case "/mobile.jpg":
    case "/mobile.jpeg":
      serveImage('mobile.jpg', req, res);
      break;
    case "/bubble":
    case "/bubble/":
    case "/bubble.jpg":
    case "/bubble.jpeg":
      serveImage('bubble.jpg', req, res);
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet)
      break;
		default:
			res.statusCode = 404;
			res.statusMessage = "Not found";
			res.end("Not found");
			break;
	}
});

//Server is listening on port
server.listen(port, function(){
	console.log("Listening on Port: " + port);
});
