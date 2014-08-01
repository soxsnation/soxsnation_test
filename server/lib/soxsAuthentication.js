/* soxsAuthentication.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/30/2014
 *
 */


var mongoose = require('mongoose');
var guid = require('guid');
var jwt = require('jwt-simple');

var utils = require('./Utils');
var User = mongoose.model('User');

var secret = "bostonredsox";
var tokenLength = 3;

function findUserByUsername(username, cb) {
	User.findOne({
		username: username
	}).exec(function(err, user) {
		if (err) {
			cb(null, err);
		} else if (!user) {
			cb(null, null);
		} else {
			cb(null, user);
		}
	})
};

function generateToken(user) {
	var d = new Date();
	var tokenData = {
		tokenId: guid.create().value,
		username: user.username,
		name: user.firstName + ' ' + user.lastName,
		email: user.email,
		expiration: Date.UTC(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes() + tokenLength, d.getSeconds(), 0)
	};

	var token = jwt.encode(tokenData, secret);
	return token;
}


exports.login = function(reqHeader, cb) {
	console.log('soxsAuthentication.login');
	console.log(reqHeader);
	var au = reqHeader;
	var creds = utils.Base64().decode(au.substring(au.indexOf(' ') + 1));
	console.log(creds);
	var username = creds.substring(0, creds.indexOf(':'));
	console.log(username);
	var password = creds.substring(creds.indexOf(':') + 1, creds.length);

	findUserByUsername(username, function(err, user) {
		if (err || !user) {
			cb(err, user);
		} else {
			if (user.password === password) {
				var token = generateToken(user);
				user.login(token, function(err) {
					console.log(err);
					cb(null, token);
				})
			} else {
				cb(409, null);
			}
		}
	})
}

exports.logout = function(reqHeader, cb) {
	console.log('soxsAuthentication.validateToken');

	var token = jwt.decode(reqHeader, secret);
	findUserByUsername(token.username, function(err, user) {
		user.logout(token, function() {

		})
	})
}

exports.validateToken = function(reqHeader, cb) {
	console.log('soxsAuthentication.validateToken');
	if (reqHeader === undefined) {
		cb(401, null);
		return;
	}

	var token = jwt.decode(reqHeader, secret);
	console.log('token');
	console.log(token);

	findUserByUsername(token.username, function(err, user) {
		console.log(user.tokens);
		if (user.tokens === token) {
			console.log('token not found');
			cb(401, null);
		} else {
			cb(null, token);
			//Check if token needs to be renewed
		}
	})


}