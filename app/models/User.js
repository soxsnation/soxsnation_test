/* User.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	hash = require('../lib/hash');
var guid = require('guid');


/**
 * User Schema
 */

var UserSchema = new Schema({
	firstName: {
		type: String,
		default: ''
	},
	lastName: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		default: ''
	},
	username: {
		type: String,
		default: ''
	},
	provider: {
		type: String,
		default: ''
	},
	password: {
		type: String,
		default: ''
	},
	salt: {
		type: String,
		default: ''
	},
	authToken: {
		type: String,
		default: ''
	},
	sessionId: {
		type: String,
		default: ''
	},
	permissions: {
		type: Number,
		default: 0
	},
	tokens: {
		// tokenId: {
		type: String,
		default: ''
		// }
		// ,
		// username: {
		// 	type: String,
		// 	default: ''
		// },
		// name: {
		// 	type: String,
		// 	default: ''
		// },
		// email: {
		// 	type: String,
		// 	default: ''
		// },
		// expiration: {
		// 	type: Number,
		// 	default: Date.UTC(2014, 07, 01)
		// }		
	},
})


/**
 * Virtuals
 */

// UserSchema
// 	.virtual('password')
// 	.set(function(password) {
// 		this._password = password
// 		this.salt = this.makeSalt()
// 		this.password = this.encryptPassword(password)
// 	})
// 	.get(function() {
// 		return this._password
// 	})


/**
 * Validations
 */

var validatePresenceOf = function(value) {
	return value && value.length
}

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('firstName').validate(function(name) {
	if (this.doesNotRequireValidation()) return true
	return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function(email) {
	if (this.doesNotRequireValidation()) return true
	return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function(email, fn) {
	var User = mongoose.model('User')
	if (this.doesNotRequireValidation()) fn(true)

	// Check only when it is a new user or when email field is modified
	if (this.isNew || this.isModified('email')) {
		User.find({
			email: email
		}).exec(function(err, users) {
			fn(!err && users.length === 0)
		})
	} else fn(true)
}, 'Email already exists')

UserSchema.path('username').validate(function(username) {
	if (this.doesNotRequireValidation()) return true
	return username.length
}, 'Username cannot be blank')

UserSchema.path('password').validate(function(password) {
	if (this.doesNotRequireValidation()) return true
	return password.length
}, 'Password cannot be blank')


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
	if (!this.isNew) return next()

	if (!validatePresenceOf(this.password) && !this.doesNotRequireValidation()) {
		next();
		// next(new Error('Invalid password'))
	} else {
		next();
	}
})

/**
 * Methods
 */

UserSchema.statics.isValidUserPassword = function(email, password, done) {
	console.log('isValidUserPassword');
	console.log(email);
	console.log(password);
	this.findOne({
		email: email
	}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {
				message: 'Incorrect email.'
			})
		}
		if (password === user.password) {
			return done(null, user);
		} else {
			return done(null, false, {
				message: 'Incorrect password'
			});
		}
	})
}

UserSchema.methods = {

	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */



	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.password
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */

	makeSalt: function() {
		return Math.round((new Date().valueOf() * Math.random())) + ''
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */

	encryptPassword: function(password) {
		if (!password) return ''
		var encrypred
		try {
			encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
			return encrypred
		} catch (err) {
			return ''
		}
	},

	login: function(token, cb) {
		console.log('User.login');
		this.tokens = token;
		this.save(cb);
	},

	logout: function(token, cb) {
		// var index = this.tokens.indexOf(token);
		// this.tokens.splice(index, 1);
		this.tokens = '';
		this.save(cb);
	},
	removeToken: function(token, cb) {
		// var index = this.tokens.indexOf(token);
		// this.tokens.splice(index, 1);
		this.tokens = '';
		this.save(cb);
	},
	changePassword: function(password, cb) {
		this.password = password;
		this.save(cb);
	},

	/**
	 * Validation is not required if using OAuth
	 */

	doesNotRequireValidation: function() {
		return false;
	}
}

mongoose.model('User', UserSchema)