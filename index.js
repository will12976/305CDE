var restify = require('restify');
var mongoose = require('mongoose');
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
  if (text.indexOf('list') === 0) {
    mongo.getAll( function(data){
        console.log(data)
    })
  }
})

server.get('/', function(req, res, next) { //Incase the user doesn't retrieve via /maps, it will redirect
  res.redirect('/films', next)
})
//data is the callback

server.get('/films', function (req, res){ //Start of getting a request back from GET, and whether it is sucessful or not
  console.log('///////////////////////// NEW SEARCH ////////////////////////////////////////')
  console.log('GET /films')
  const searchPlace = req.query.title
  console.log('films='+searchPlace)
  films.search(searchPlace, function(data){
    console.log('/////////////////////////////////////////////////////////////////////////////')
    const hold = data.response.data//This is the JSON data of the film 
    mongo.addList(hold, function(data) {
      console.log('added '+data)
      console.log('Movie Details stored in Database')
      console.log('//////////////////////// END OF SEARCH //////////////////////////////////////')
    })
    res.setHeader('content-type', 'application/json') // The results that come back, will return as JSON text
    res.send(data.code, data.response);
    res.end();
  })
});

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})
