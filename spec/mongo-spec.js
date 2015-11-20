var test = require('../mongo.js');

describe('Getting and storing data', function(){
    
    it('should clear the database'), function(){
        test.clear();
        expect(test.toBe(1))
    }
})