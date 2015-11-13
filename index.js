var restify = require('restify');
 
var server = restify.createServer({
  name: 'My API',
  version: '4.0.3'
});
server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

var maps = require('./maps.js') //Links to the maps.js module
var accounts = require('./accounts.js')

server.get('/', function(req, res, next) { //Incase the user doesn't retrieve via /maps, it will redirect
  res.redirect('/maps', next)
})

server.get('/maps', function (req, res){ //Start of getting a request back from GET, and whether it is sucessful or not
  console.log('GET /maps')
  const searchPlace = req.query.q
  console.log('address='+searchPlace)
  maps.search(searchPlace, function(data){
    console.log(data)
    res.setHeader('content-type', 'application/json') // The results that come back, will return as JSON text
    res.send(data.code, data.response);
    res.end();
  })
});

//server.post('/accounts', function(req, res) {
//  console.log('POST /accounts')
//  const auth = req.authorization
//  const body = req.body
//  console.log(body)
//  const host = req.headers.host
//  console.log(typeof req.files)
//  accounts.add(host, auth, body, req.files, function(data) {
//    console.log('DATA RETURNED')
//    console.log(data)
//    res.setHeader('content-type', 'application/json');
//    res.send(data.code, data.response);
//    res.end();
//  })
//})

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})
