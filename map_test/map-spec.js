var request = require('request')
var mongo = require('../mongo.js')
var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=cv2'
//Shows the details for Coventry.

//The testing code is similar for the films API, I will be testing the same tasks, but different parameters

//SETUP -- Clears any list from other tests

describe("Clears the list that might clash with other tests", function(){
    it("should have no elements in the list before testing", function(done){
        
        mongo.clear(function(results){
            expect(results).toEqual('lists removed')
            done();
            
        })
    })
})

//THESE TESTS PASSES
describe("Using /GET to retrieve map data from the third-party API", function() {
  it("should return a status code of 200 when sending the /GET request", function(done){
      //I will be requesting from an already made url request
      request.get(url, function(error, response, body){
          expect(response.statusCode).toBe(200);
          console.log(response.statusCode)
          done();
      })
  })
  
  it("should return the formatted address of the query that is requested using /GET", function(done){
      
      request.get(url, function(error, response, body){
          var change = JSON.parse(body);

          var maps = change.results.map(function(element){
              return {'Address': element.formatted_address}
          })
          console.log(maps)
          expect(maps).toEqual([ { Address: 'Coventry CV2, UK' } ])
          done();
      })
  })
  
  it("should store the returned data into MongoDB", function(done){
      request.get(url, function(error, response, body) {
          var change = JSON.parse(body);
          var maps = change.results.map(function(element){
              return {'Address': element.formatted_address}
          })
          //This is since I can't look up the ID's as they are all unique, hopefully I can find this out on Wednesday
          mongo.addList(maps, function(data){
              expect(data).not.toBe(maps)
              done();
          })
      })
  })
})


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
      var change = JSON.parse(body)
      var maps = change.results.map(function(element){
        return {'Address': element.formatted_address}
      })
      console.log(maps)
      expect(maps).toEqual([ { Address: 'CV2, UK' } ])
      done();
    })
    
  })
});
