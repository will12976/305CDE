var restify = require('restify');

var server = restify.createServer({
  name: 'My API',
  version: '4.0.3'
});
server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

var films = require('./films.js') //Links to the maps.js module
var accounts = require('./accounts.js')

 
var mongo = require('./mongo.js')

const stdin = process.openStdin()

stdin.on('data', function(chunk) {
  console.log(typeof chunk)
  var text = chunk.toString().trim()
  console.log(typeof text)
  
  if (text.indexOf('add ') === 0) {
    var space = text.indexOf(' ')
    var item = text.substring(space+1).trim()
    console.log('adding "'+item+'"')
    /* notice the use of 'arrow function' syntax to define the anonymous function parameter. */
    mongo.addList(item, function(data) {
        console.log('returned: '+data)
    })
  }
  
  if (text.indexOf('get ') === 0) {
    var space = text.indexOf(' ')
    var item = text.substring(space+1).trim()
    console.log('finding: ID "'+item+'"')
    mongo.getById(item, function(data) {
        console.log(data)
    })
  }
  
  if (text.indexOf('list') === 0) {
    mongo.getAll( function(data){
        console.log(data)
    })
  }
  
  if (text.indexOf('clear') === 0) {
    mongo.clear( function(data) {
        console.log(data)
    })
  }
})


server.get('/', function(req, res, next) { //Incase the user doesn't retrieve via /maps, it will redirect
  res.redirect('/films', next)
})

server.get('/films', function (req, res){ //Start of getting a request back from GET, and whether it is sucessful or not
  console.log('GET /films')
  const searchPlace = req.query.title
  console.log('films='+searchPlace)
  films.search(searchPlace, function(data){
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
