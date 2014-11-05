/* sessionController.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/15/2014
 *
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jwt-simple');

var soxsAuth = require('../lib/soxsAuthentication');


var Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function(c) {
		var a = "",
			d, b, f, g, h, e, k = 0;
		for (c = Base64._utf8_encode(c); k < c.length;) d = c.charCodeAt(k++), b = c.charCodeAt(k++), f = c.charCodeAt(k++), g = d >> 2, d = (d & 3) << 4 | b >> 4, h = (b & 15) << 2 | f >> 6, e = f & 63, isNaN(b) ? h = e = 64 : isNaN(f) && (e = 64), a = a + Base64._keyStr.charAt(g) + Base64._keyStr.charAt(d) + Base64._keyStr.charAt(h) + Base64._keyStr.charAt(e);
		return a
	},
	decode: function(c) {
		var a = "",
			d, b, f, g, h, e = 0;
		for (c = c.replace(/[^A-Za-z0-9\+\/\=]/g,
			""); e < c.length;) d = Base64._keyStr.indexOf(c.charAt(e++)), b = Base64._keyStr.indexOf(c.charAt(e++)), g = Base64._keyStr.indexOf(c.charAt(e++)), h = Base64._keyStr.indexOf(c.charAt(e++)), d = d << 2 | b >> 4, b = (b & 15) << 4 | g >> 2, f = (g & 3) << 6 | h, a += String.fromCharCode(d), 64 != g && (a += String.fromCharCode(b)), 64 != h && (a += String.fromCharCode(f));
		return a = Base64._utf8_decode(a)
	},
	_utf8_encode: function(c) {
		c = c.replace(/\r\n/g, "\n");
		for (var a = "", d = 0; d < c.length; d++) {
			var b = c.charCodeAt(d);
			128 > b ? a += String.fromCharCode(b) : (127 < b && 2048 > b ? a +=
				String.fromCharCode(b >> 6 | 192) : (a += String.fromCharCode(b >> 12 | 224), a += String.fromCharCode(b >> 6 & 63 | 128)), a += String.fromCharCode(b & 63 | 128))
		}
		return a
	},
	_utf8_decode: function(c) {
		for (var a = "", d = 0, b = c1 = c2 = 0; d < c.length;) b = c.charCodeAt(d), 128 > b ? (a += String.fromCharCode(b), d++) : 191 < b && 224 > b ? (c2 = c.charCodeAt(d + 1), a += String.fromCharCode((b & 31) << 6 | c2 & 63), d += 2) : (c2 = c.charCodeAt(d + 1), c3 = c.charCodeAt(d + 2), a += String.fromCharCode((b & 15) << 12 | (c2 & 63) << 6 | c3 & 63), d += 3);
		return a
	}
};

function getToken(sessionId) {
	var token = jwt.encode({
		foo: sessionId
	}, 'secret');
	return token;
}

exports.login = function(req, res, next) {
	console.log('session login');

	soxsAuth.login(req.headers.authorization, function(err, token) {
		if (err) {
			res.send(err);
		} else if (!token) {
			res.send(401);
		} else {
			res.json(token);
		}
	})

	// var autho = req.headers.authorization.substring(req.headers.authorization.indexOf(' ') + 1);
	// var creds = Base64.decode(autho);
	// var username = creds.substring(0, creds.indexOf(':'));
	// var password = creds.substring(creds.indexOf(':') + 1, creds.length);

	// User.findOne({
	// 	username: username
	// }).exec(function(err, user) {
	// 	if (err) {
	// 		res.send(406);
	// 	}
	// 	if (!user) {
	// 		res.send(403);
	// 	}
	// 	if (user.password === password) {
	// 		user.login(function(data) {
	// 			res.json(getToken(user.sessionId));
	// 		})

	// 	} else {
	// 		res.send(409);
	// 	}
	// 	// res.json(user);
	// })
}

exports.validate = function(req, res, next) {
	if (req.headers.authorization === undefined) {
		res.send(401);
	}
	soxsAuth.validateToken(req.headers.authorization, function(err, token) {
		if (err) {
			res.send(err);
		} else if (!token) {
			res.send(401);
		} else {
			res.json(token);
		}
	})
}

exports.getSession = function(req, res, next) {
	console.log('getSession');
	console.log(req.params.id)
	if (req.params.id === undefined) {
		res.send(401);
	} else {
		var sessionId = jwt.decode(req.params.id, 'secret');

		console.log(sessionId);

		User.findOne({
			sessionId: sessionId
		}).exec(function(err, user) {
			if (err) {
				res.send(401);
			}
			if (!user) {
				res.send(401);
			}
			res.send(200);
		});
	}


	// if (sessionId === '2') {
	// 	res.send(200);
	// } else {
	// 	res.send(401);
	// }
}

exports.getUser = function(req, res, next) {
	console.log('getUser');
	// console.log(req.params.id);
	// if (req.params.id === undefined || req.params.id === '1') {
	// 	res.send(401);
	// } else {
	// 	var sessionId = jwt.decode(req.params.id, 'secret').foo;
	// 	console.log(sessionId);

	// 	User.findOne({
	// 		sessionId: sessionId
	// 	}).exec(function(err, user) {
	// 		console.log(err);
	// 		console.log(user);
	// 		if (err) {
	// 			res.send(401);
	// 		}
	// 		if (!user) {
	// 			res.send(401);
	// 		} else {
	// 			console.log(user);
	// 			res.json(user);
	// 		}
	// 	});
	// }
}

exports.logout = function(req, res, next) {
	console.log('logout');
	// var sessionId = req.params.id;
	// console.log(sessionId);

	// User.findOne({
	// 	sessionId: sessionId
	// }).exec(function(err, user) {
	// 	if (err) {
	// 		res.send(401);
	// 	}
	// 	if (!user) {
	// 		res.send(401);
	// 	}

	// 	user.logout(function(data) {
	// 		res.send(200);
	// 	})

	// });


	soxsAuth.logout(req.headers.authorization, function(err, token) {
		if (err) {
			res.send(err);
		} else if (!token) {
			res.send(404);
		} else {
			res.send(200);
		}
	})
}