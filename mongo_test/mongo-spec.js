var mongo = require('../mongo.js');
var request = require('request');
var url = 'http://www.myapifilms.com/imdb?title=Jaws'

describe("Checking whether my database methods are working correctly", function() {
    
  it("should remove the items from the list and logs 'lists removed'", function(done) {

    mongo.clear(function (result){
      
      expect(result).toEqual('lists removed')
      done();
      
    });
  });
  
  it("should add my /GET request to MongoDB", function(done){
    request.get(url, function(error, response, body){
      var conversion = JSON.parse(body)
      var film = conversion.map(function (element){
        return {'Year': element.year}
      })
      mongo.addList(film, function(data){
        console.log(data)
      })
      
    })
    
  })
});