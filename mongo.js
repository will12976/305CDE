//Copied from web2


var mongoose = require('mongoose')
/* the database name is stored in a private variable instead of being 'hard-coded' so it can be replaced using the 'rewire' module. This avoids the need for the unit tests to run against the 'live' database. */
var database = 'api'
/* the server connections string includes both the database server IP address and the name of the database. */
const server = 'mongodb://'+process.env.IP+'/'+database
console.log(server)
/* the mongoose drivers connect to the server and return a connection object. */
mongoose.connect(server)
const db = mongoose.connection

/* all documents in a 'collection' must adhere to a defined 'schema'. Here we define a new schema that includes a mandatory string and an array of strings. */
const listSchema = new mongoose.Schema({
    title: { type: Array, required: true } //The type of data is an Array.
    //In the schema, it is a requirement that title is an Array, if not it will return an error as callback
})
/* the schema is associated with the 'List' collection which means it will be applied to all documents added to the collection. */
const List = mongoose.model('List', listSchema)
/* END OF MONGOOSE SETUP */

/* notice we are using the 'arrow function' syntax. In this example there are more than one parameter so they need to be enclosed in brackets. */
exports.addList = function(data, callback) {
//Extracted the data we can use it to create a new 'List' object that adopts the correct schema. */

    //I have moved the data that I want into this module. 
    //Since this data is an array, I need to find a way of having a variable with this data so I can manipulate it
    const title = data[0]; //Since there is only one index in this Array, I equalled it to the first index number
    const newList = new List({title})
    newList.save( function(err, data) {
      if (err) {
        callback('error: '+err)
      }
      callback(data)
    
  })
  
}

exports.getAll = function(callback) {
  /* the List object contains several useful properties. The 'find' property contains a function to search the MongoDB document collection. */
  List.find( function(err, data){
    if (err) {
      callback('error: '+err)
    }
    const list = data.map( function(item){
      return {data}
    })
    callback(list)
  })
}


exports.getById = function(id, callback) {
  /* the 'find' property function can take a second 'filter' parameter. */
  List.find({_id: id}, function(err, data) { //This finds the section containing _id
    if (err) {
      callback(err)
    }
    callback(data)
  })
}
exports.clear = function(callback) {
  /* the 'remove()' function removes any document matching the supplied criteria. */
  List.remove({}, function(err)  {
    if (err) {
      callback('error!')
    }
    callback('lists removed')
  })
}
