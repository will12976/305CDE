var mongo = require('../mongo.js');
var request = require('request');
var url = 'http://www.myapifilms.com/imdb?title=Jaws'

//I will be testing the 4 methods of my mongo.js file. As a test I will use the film API to test its functionality with the database.

//PASSED TESTS

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
      mongo.addList(conversion, function(data){
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
  
  
  //My fourth test looks at the getById method, which searches the item based on its ID.
  //I expect this to not equal to an empty array [], as it should have sent something back.  
  it("should return data back from the database, based on the ID given", function(done){
    request.get(url, function(error, response, body) {
      var conversion = JSON.parse(body)
      mongo.addList(conversion, function(data){
        var dataId = data._id
        //The data that is sent to the database will have its own _id property, with the unique ID.
        //I can store this in my own variable so I can then search for it using the getById request.
        //In this test, this will never fail, because the variable will be updated after each addList request.
        mongo.getById(dataId, function(result){
          expect(result).not.toEqual([])
          done();
        })
      })

    })
  })
});


// FAILED TESTS

describe("Here are the tests that didn't make it", function(){
  
  it("should return data back from the database, based on the ID given", function(done){
    request.get(url, function(error, response, body) {
      var conversion = JSON.parse(body)
      mongo.addList(conversion, function(data){
        var dataId = data._id
        var wrong = '5654d400c21d33a930f47c4e'
        //What I learn is, sending an incorrect getById request, will return an empty array []
        //So I am searching for it to not equal to this empty array.
        //In this failed test, it uses the ID above, but since lists are removed/added they have a unique ID, this will not work.
        mongo.getById(wrong, function(result){
          expect(result).not.toEqual([])
          console.log(result)
          done();
        })
      })

    })
  })
})