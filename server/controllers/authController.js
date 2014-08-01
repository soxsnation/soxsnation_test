/* authController.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/30/2014
 *
 */

var soxsAuth = require('../lib/soxsAuthentication');

exports.getUser = function(req, res, next) {
	console.log('authController.getUser');
	soxsAuth.getUser(req.headers.authorization, function(err, user) {
		if (err || !user) {
			res.send(401);
		} else {
			res.json(user);
		}
	});
}

exports.login = function(req, res, next) {
	console.log('authController.login');

	soxsAuth.login(req.headers.authorization, function(err, token) {
		if (err) {
			res.send(err);
		} else if (!token) {
			res.send(401);
		} else {
			res.json(token);
		}
	});
}

exports.validate = function(req, res, next) {
	console.log('authController.validate');
	if (req.headers.authorization === undefined) {
		res.send(403);
	}
	soxsAuth.validateToken(req.headers.authorization, function(err, token) {
		if (err) {
			res.send(err);
		} else if (!token) {
			res.send(403);
		} else {
			res.json(token);
		}
	});
}

exports.logout = function(req, res, next) {
	console.log('authController.logout');
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