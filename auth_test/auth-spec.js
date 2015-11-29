var auth = require('../authorisation.js')
var storage = require('node-persist');
var bcrypt = require('bcrypt')

//Since to send a request with a username and password, I would need to use Postman REST Client
//But as it runs a test, it cannot do this. 
//In this test I will use an example username and password.
//But it will still deliver the same results.

//SETUP
describe("Setting up my test for the authorisation module", function(){
    it("Should remove any node-persist storage, and should return empty", function(done){
        console.log('hello')
        //Nice simple method that clears each key in the storage
        storage.clearSync();
        //node-persist has a .length function that returns the number of keys in the storage
        //Since I cleared it, it should equal to 0.
        expect(storage.length(storage)).toBe(0)
        console.log('Number of keys : ' + storage.length(storage))
        done();
    })
})

//TESTING - PASSED

describe("Using a premade username + password, this should be stored whereas the password is encrypted", function(){
    it("Length of storage shouldn't be 0, and when retrieving data it should be undefined", function(done){
        //Manually adding a username and password
        const username = 'test123'
        const password = 'test321'
        
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)
        const account = {username: username, password: password, hash: hash}
        //setItem has the key parameter and then the value parameter.
        storage.setItem(username, account)
        //Since I know the key parameter contain the data about the account details
        //If it doesn't return anything, it will be undefined.
        expect(storage.length(storage)).toBe(1)
        console.log('Number of keys : '+storage.length(storage))
        expect(storage.getItemSync(username)).not.toBe(undefined)
        done();
        
    })
})

//TESTING - FAILED

describe("Using a premade username + password, this should be stored whereas the password is encrypted", function(){
    it("Length of storage shouldn't be 0, and when retrieving data it should be undefined", function(done){
        //Manually adding a username and password
        const username = 'test123'
        const password = 'test321'
        
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)
        const account = {username: username, password: password, hash: hash}
        //setItem has the key parameter and then the value parameter.
        storage.setItem(username, account)
        //Since I know the key parameter contain the data about the account details
        //If it doesn't return anything, it will be undefined.
        expect(storage.length(storage)).toBe(0)
        console.log('Number of keys : '+storage.length(storage))
        expect(storage.getItemSync(password)).not.toBe(undefined)
        done();
        
    })
})


//Couldn't attempt the testing of getAccount