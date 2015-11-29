var bcrypt = require('bcrypt')
var storage = require('node-persist')
storage.initSync()

/* this function adds an account to the API. */
exports.addAccount = function(request, callback) {

    //This checks whether a username or password has been added
	if (request.authorization == undefined || request.authorization.scheme !== 'Basic') {
		callback(new Error('basic authorization header missing'))
	}
	const username = request.authorization.basic.username

	if (storage.getItemSync(username) !== undefined) {
		callback(new Error('account '+username+' already exists'))
	}
	const password = request.authorization.basic.password
	/* the 'salt' is the 'cost factor' for the algorithm. */
	const salt = bcrypt.genSaltSync(10)
	/* now we can apply this salt to create our password hash. */
	const hash = bcrypt.hashSync(password, salt)
	/* we store the account details. */
	const account = {username: username, hash: hash}
	storage.setItem(username, account)
	/* and pass the username back to the routes file. */
	callback(null, {message: 'account created', username: username} )
}

/* this function checks the validity of a supplied username and password. */
exports.getAccount = function(request, callback) {
	console.log("Verifying account with user ...  :  " + request.authorization.basic.username)
	/* does the request include basic authorization. */
	if (request.authorization == undefined || request.authorization.scheme !== 'Basic') {
		callback(new Error('basic authorization header missing'))
	}
	const username = request.authorization.basic.username
	/* we can look up the supplied username to see if the account exists. */
	if (storage.getItemSync(username) === undefined) {
		callback(new Error('account '+username+' does not exist'))
	}
	var account = storage.getItemSync(username)
	const password = request.authorization.basic.password
	console.log("Checking if correct password...  :  "+account.hash)
	/* we compare the supplied password to the account hash to see if it is correct. */
	if (!bcrypt.compareSync(password, account.hash)) {
		callback(new Error('invalid password'))
	}
	const data = {username: username}
	callback(null, data)
}
