var mongo = require('../mongo.js');
var request = require('request');
var url = 'http://www.myapifilms.com/imdb?title=Jaws'

describe("Checking whether my database methods are working correctly", function() {
  
  //My first test clears the list in MongoDB, and I am checking whether the log returns 'lists removed'.
  //This is what is sent back if it is cleared successfully.
  it("should remove the items from the list and logs 'lists removed'", function(done) {
    
    mongo.clear(function (result){
      expect(result).toEqual('lists removed')
      done();
    
    });
  });
  //My second test then checks whether the list has been cleared. It should return an empty array [].
  //I will be testing the getAll method from mongo.js
  it("the clear method should make the list an empty Array", function(done) {
    
    mongo.getAll(function (result){
      expect(result).toEqual([])
      done();
      
    })
  })
  
  
  //My third test then requests from my third-party api, taking only the year data from Jaws
  //Then uses the addList method from mongo.js, to test if it has been added to the database.
  it("should add my /GET request to MongoDB and checks if something has been added", function(done){
    request.get(url, function(error, response, body){
      var conversion = JSON.parse(body)
      var film = conversion.map(function (element){
        return {'Year': element.year}
      })
      mongo.addList(film, function(data){
      })
      //Adding data into the database will have its own unique ID, so there is no way of testing the whole output. 
      //Since in the previous tests that the lists are cleared successfully, I will test if it isn't an empty string
      //If not, then I know that something has been added.
      mongo.getAll(function (result){
        expect(result).not.toEqual([])
        done();
      })
    })
  })
});