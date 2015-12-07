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
// var accounts = require('./accounts.js')
var mongo = require('./mongo.js')
var maps = require('./maps.js')
var authorisation = require('./authorisation.js')


const stdin = process.openStdin()

stdin.on('data', function(chunk) {
  console.log(typeof chunk)
  var text = chunk.toString().trim()
  console.log(typeof text)
  //Typing list into node.js retrieves all of the data from mongo.db and displays it in the terminal.
  if (text.indexOf('list') === 0) {
    mongo.getAll( function(data){
        console.log(data)
    })
  }
  //Typing get 5649ce08d7da945978bc5674, this retrieves the film data with that certain ID.
  if (text.indexOf('get ') === 0) {
    var space = text.indexOf(' ')
    var item = text.substring(space+1).trim()
    console.log('finding: ID "'+item+'"')
    mongo.getById(item, function(data) {
        console.log(data)
    })
  }
  //Typing clear into node.js clears the whole list, so then typing list will give a blank array
  if (text.indexOf('clear') === 0) {
    mongo.clear( function(data) {
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
  const searchFilm = req.query.title
  console.log('films='+searchFilm)
  films.search(searchFilm, function(data){
    //console.log('///////////////////// AUTHENTICATING ACCOUNT ////////////////////////////')
    const hold = data.response.data//This is the JSON data of the film 
    
    mongo.addList(hold, function(data) {
      console.log('/////////////////////////////////////////////////////////////////////////////')
            //console.log('Welcome back ' + user + '!')
            //console.log('added '+data)
            //console.log('Address Details stored in Database')
            //console.log('//////////////////////// END OF SEARCH //////////////////////////////////////')
    }) 
          
    res.setHeader('content-type', 'application/json') // The results that come back, will return as JSON text
    res.send(data.code, data.response);
    res.end();
  })
});

server.get('/maps', function (req, res){ //Start of getting a request back from GET, and whether it is sucessful or not
  console.log('///////////////////////// NEW SEARCH ////////////////////////////////////////')
  console.log('GET /maps')
  const searchPlace = req.query.address
  console.log('address='+searchPlace)
  maps.search(searchPlace, function(data){
    console.log('///////////////////// AUTHENTICATING ACCOUNT ////////////////////////////')
    const hold = data.response.data
    //This is the JSON data of the film 
    //The same goes for my maps API, I could have used mongo.addList in my maps.js module.
    //However, I wanted to have a 'END OF SEARCH' part to tell the users that it has ended.
    //I will include the mongo.addList in the modules when testing. 
    //authorisation.getAccount(req, function(err, data) {

    //res.setHeader('content-type', 'application/json')
    //if (err) {
      //res.send(401, {status: 'error', 'server_message': err.message, database_message: 'This map data has NOT been added to the database', data: hold })
          //console.log('//////////////////////// END OF SEARCH //////////////////////////////////////')
        //} else {
          //res.send(200, {status: 'success', message: 'Account Authenticated. Welcome back ' + data.username + '!', database_message: 'This map data has been added to the database!', data: hold})
          //const user = data.username;
          //mongo.addList(hold, function(data) {
            //console.log('/////////////////////////////////////////////////////////////////////////////')
            //console.log('Welcome back ' + user + '!')
            //console.log('added '+data)
            //console.log('Address Details stored in Database')
            //console.log('//////////////////////// END OF SEARCH //////////////////////////////////////')
          //})        
         
       //}
     //})

    res.setHeader('content-type', 'application/json') // The results that come back, will return as JSON text
    res.send(data.code, data.response)
    res.end();
  })
});

/* POST is used to create new accounts. The url points to the 'accounts' collection. */
server.post('/accounts', function(req, res) {
  /* we pass the request object to an async function that takes a callback. The first callback parameter is an Error object or null if no errors are returned. The second paramter is the returned data. */
  authorisation.addAccount(req, function(err, data) {
    /* we will return json data on success or failure */
    res.setHeader('content-type', 'application/json')
    if (err) {
      /* if an error occurs respond with a suitable error code and message. */
      res.send(400, {status: 'error', message: err.message })
    } else {
      /* success! so we return suitable data. */
      res.send(201, {status: 'success', message: 'Account Created!', description: 'Now you can store /GET data into a database!', data: data})
    }
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
