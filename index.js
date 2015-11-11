var restify = require('restify');
 
var server = restify.createServer({
  name: 'My API',
  version: '4.0.3'
});
server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

var maps = require('./maps.js')
var accounts = require('./accounts.js')

server.get('/maps', function (req, res, next) {
  res.send(req.params);
  return next();
});
 
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});