/** @module router */

module.exports = Router;
var url = require('url');

function Router(){
  this._getRoutes = [];
  this._postRoutes = [];
}

function pathToRegularExpression(path){
  var tokens = path.split('/');
  var keys = [];
  var part = tokens.map(function(token){
    if(token.charAt(0) == ":"){
      keys.push(token.slice(1));
      return "(\\w+)"
    }
    else{
      return token;
    }
  });
  var regexp = new RegExp('^' + parts.join('/') + '/?$');
  return {
    regexp: regexp,
    keys: keys
  }
}

Router.prototype.get = function(path, handler){
  var route = pathToRegularExpression(path);
  route.handler = handler;
  this._getRoutes.push(route);

Router.prototype.post = function(pather, handler){
  var route = pathToRegularExpression(path)
  route.handler = handler;
  this._postRoutes.push(route);
}

Router.prototype.route = function(req, res){
  var urlParts = url.parse(req.url);

  switch(req.method){
    case 'get':
      for(var i = 0; i < this._getRoutes.length; i++){
        var route = this._getRoutes[i]  ;
        var match = route.regexp.exec(urlParts.pathname);
        if(match){
          req.params = {};
          for(var j = 1; j < match.length; j++){
            req.params[route.keys[j-1]] = match[j];
          }
          return route.handler(req, res);
        }
      }
      res.statusCode = 404;
      res.stausMessage = "Resource not found";
      res.end();
      break;
    case 'post':
    for(var i = 0; i < this._postRoutes.length; i++){
      var match = this._postRoutes[i].exec(urlParts.pathname);
      if(match){
        return this._postActions[i](req, res);
      }
    }
      break;
    default:
     var msg = "Unknown method " + req.method;
      res.statusCode = 400;
      res.stausMessage = msg;
      console.error(msg);
      res.end(msg);
  }
}
