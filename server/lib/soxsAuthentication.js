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
var renewLength = 2;

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
		expiration: Date.UTC(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes() + tokenLength, d.getSeconds(), 0),
		username: user.username,
		name: user.firstName + ' ' + user.lastName,
		email: user.email,
		permissions: user.permissions
	};

	var token = jwt.encode(tokenData, secret);
	return token;
}

exports.getUser = function(reqHeader, cb) {
	console.log('soxsAuthentication.getUser');
	// console.log(reqHeader);
	var token = jwt.decode(reqHeader, secret);
	console.log(token);
	findUserByUsername(token.username, cb);
}


exports.login = function(reqHeader, cb) {
	console.log('soxsAuthentication.login');
	var au = reqHeader;
	var creds = utils.Base64().decode(au.substring(au.indexOf(' ') + 1));
	var username = creds.substring(0, creds.indexOf(':'));
	var password = creds.substring(creds.indexOf(':') + 1, creds.length);

	findUserByUsername(username, function(err, user) {
		if (err || !user) {
			cb(err, user);
		} else {
			if (user.password === password) {
				console.log('valid user');
				console.log(utils.getPermissionNames(user.permissions));
				var token = generateToken(user);
				user.login(token, function(err) {
					cb(null, token);
				})
			} else {
				cb(409, null);
			}
		}
	})
}

exports.logout = function(reqHeader, cb) {
	console.log('soxsAuthentication.logout');
	if (reqHeader.indexOf('.') == -1) {
		cb(401, null);
	} else {
		var token = jwt.decode(reqHeader, secret);
		findUserByUsername(token.username, function(err, user) {
			user.logout(token, function() {

			})
		})
	}
}

exports.validateToken = function(reqHeader, cb) {
	console.log('soxsAuthentication.validateToken');
	if (reqHeader === undefined) {
		cb(401, null);
	} else if (reqHeader.indexOf('.') == -1) {
		cb(401, null);
	} else {
		var token = jwt.decode(reqHeader, secret);

		findUserByUsername(token.username, function(err, user) {
			if (user.tokens === token) {
				console.log('token not found');
				cb(401, null);
			} else {
				console.log(token);
				cb(null, reqHeader);
				//Check if token needs to be renewed
			}
		})
	}
}