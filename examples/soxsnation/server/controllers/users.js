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
	User = mongoose.model('User')

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


/**
 * Create user
 */

exports.create = function(req, res, next) {
	console.log('users.create');
	parse(req, function(err, data) {
		console.log(data);
		var user = new User(data)
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
	})
}

/**
 * Find user by id
 */

exports.user = function(req, res, next) { //, next, id) {
	console.log('users.user');
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