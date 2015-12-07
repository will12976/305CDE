var request = require('request');
var mongo = require('../mongo.js')
var url = 'http://www.myapifilms.com/imdb?title=Jaws'

//SETUP
describe("Clears the list from other tests", function(){
  it("should have no elements in the list before testing", function(done){
    
    mongo.clear(function(result){
      
      expect(result).toEqual('lists removed')
      done();
    });
  })
})
//PASS TESTING

// First describe goes through the tests that works - achieves what it is asking.
// It first checks if the status code is 200 (OK!) - Depends on the request URL.
// It then checks if I can extract the data so it only prints out 
describe("Using /GET to retrieve film data from the third-party API", function() {
  it("returns status code 200 when sending a /GET request", function(done) {
    //Unlike index.js this testing will use an already made url request to third-party api.
    request.get(url, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      console.log(response.statusCode)
      done(); // If the test passes, it runs the done method, marking it as passed.
    });
  });
  
  // This test checks whether I can collect just the title data of Jaws.
  
  it("returns only the year data for a film from the request using /GET", function(done){
    request.get(url, function(error, response, body){
      var conversion = JSON.parse(body)
      //I still map the parsed body, and only collect the title element
      var film = conversion.map(function(element){
        return {'Year': element.year}
      })
      // console.log(film)  -- Debugging
      expect(film).toEqual([ { Year : '1975' } ]) //I check if the data returned is equal to the data for Jaws.
      done(); // If the test passes, it runs the done method
    })
    
  })
  
  //This test stores the data about the Year of the film into MongoDB
  it("should store the returned data into MongoDB", function(done){
    request.get(url, function(error, response, body){
      var conversion = JSON
      //Since I can't look up the ID's as they're all unique, I am checking if the data that I have passed onto the database
      //isn't just returning back, so you will know that something has occurred. 
      //I might know this on Wednesday, this links to the problem from mongo-spec.js
      mongo.addList(film, function(data){
        expect(data).not.toBe(film)
        done();
      })
    })
  })
});


//FAIL TESTING 

//This is testing the same thing, but is checking if the status code is 201.
//This uses the same url as before, but this is checking whether the testing is checking for this correctly. 

describe("Here are the tests that failed", function() {
  it("should return a status code of 201", function(done) {
    request.get(url, function(error, response, body) {
      expect(response.statusCode).toBe(201);
      //Console.log to check what I am getting back
      done();
    });
  });
  
  it("returns the title data from the request", function(done){
    request.get(url, function(error, response, body){
      var conversion = JSON.parse(body)
      var film = conversion.map(function(element){
        return {'Year': element.year}
      })
      console.log(film)
      expect(film).toEqual([ { Year : '1985' } ])
      done();
    })
    
  })
});
