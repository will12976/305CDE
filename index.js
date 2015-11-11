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

server.get('/', function(req, res, next) {
  res.redirect('/maps', next)
})

server.get('/maps', function (req, res, next) {
  res.send(req.params);
  return next();
});

 server.post('/accounts', function(req, res) {
  console.log('POST /accounts')
  const auth = req.authorization
  const body = req.body
  console.log(body)
  const host = req.headers.host
  console.log(typeof req.files)
  accounts.add(host, auth, body, req.files, function(data) {
    console.log('DATA RETURNED')
    console.log(data)
    res.setHeader('content-type', 'application/json');
    res.send(data.code, data.response);
    res.end();
  })
})

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})
