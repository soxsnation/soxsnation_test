/* users.js
 *
 * Author(s):  Andrew Brown
 * Date:      6/10/2014
 *
 */

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	User = mongoose.model('User');

function parse(req, callback) {
	// Create new empty buffer
	var buf = new Buffer('');

	// Concatenate data to buffer
	req.on('data', function(data) {
		buf = Buffer.concat([buf, data]);
	});

	// Parse object
	req.on('end', function(data) {
		var obj;
		try {
			obj = JSON.parse(buf);
		} catch (e) {
			callback({
				status_code: 400,
				message: 'Invalid JSON'
			}, null);
			return;
		}
		callback(null, JSON.parse(buf));
	});
}

function config_user_data(userData) {
	var ud = {
		_id: userData._id,
		permissions: userData.permissions,
		username: userData.username,
		email: userData.email,
		firstName: userData.firstName,
		lastName: userData.lastName
	}


	// delete userData.salt;
	// delete userData.password;
	// delete userData.tokens;
	return ud;
}


/**
 * Create user
 */

exports.create = function(req, res, next) {
	console.log('users.create');
	console.log(req.body);
	var data = req.body;
	// parse(req, function(err, data) {
	console.log(data);
	var user = new User(data);
	user.save(function(err) {
			if (err) {
				console.log(err);
				return res.send(403);
			} else {
				return res.json(user);
			}
			// manually login the user once successfully signed up
			// req.logIn(user, function(err) {
			//   if (err) return next(err)
			//   return res.redirect('/')
			// })
		})
		// })
}

exports.update = function(req, res, next) {
	User.findOne({
		username: req.params.id
	}).exec(function(err, userData) {
		if (err) {
			return res.send(407);
		}
		userData.update(req.body, function(err, data) {
			if (err) {
				res.send(404);
			} else {
				res.send(200);
			}
		})

	})
}

/**
 * Find user by id
 */

exports.user = function(req, res, next) { //, next, id) {
	console.log('users.user');
	console.log(req.params.id);
	User.findOne({
		username: req.params.id
	}).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(new Error('Failed to load User ' + id));
		}
		res.json(user);
	})
}

exports.users = function(req, res, next) {
	console.log('users.users');
	User.find({}).exec(function(err, users) {
		if (err) {
			return next(err);
		}
		if (!users) {
			return next(new Error('Failed to load users'));
		}

		var userList = [];
		for (var i = 0; i < users.length; ++i) {
			userList.push(config_user_data(users[i]));
		}

		return res.json(userList);
	});

}