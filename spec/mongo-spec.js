var mongo = require('../mongo.js');

describe("Checking the callbacks to see if it returns correctly. It", function() {
    
  it("should log 'lists removed'", function() {

    mongo.clear(function (result){
      
      expect(result).toEqual('list') //This doesn't seem to work. Console log returns what I want.
      console.log(result); //Even equalling only 'list', it still passes.
      
    });
  });
  
  //it("should log an error instead", function() {
  //  mongo.clear(function (result){
  //    expect(result).not.toBe('lists removed')
  //    console.log(result)
  //  })
  //})
  
});