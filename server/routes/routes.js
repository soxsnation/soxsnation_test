/* routes.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

/**
 * Controllers
 */

var session = require('../controllers/sessionController');
var soxsController = require('../controllers/soxsController');
var authControl = require('../controllers/authController');
var users = require('../controllers/users');
var recipes = require('../controllers/recipes');
var express = require('express');
var fpath = require('path');
var User = require('../models/User');
var Auth = require('../lib/authorization');

var _ = require('underscore');
var jwt = require('jwt-simple');
/**
 * Expose routes
 */

module.exports = function(app, passport) {

	// TODO: I had to add this in to support CORS requests. I'm not sure this is the way to do this.
	// app.use(function(req, res, next) {
	// 	res.header("Access-Control-Allow-Origin", "*");
	// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	// 	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
	// 	res.header("Access-Control-Allow-Credentials", "true");
	// 	next();
	// });

	/***********************************************************************************************************************
	 * Public Routes
	 ***********************************************************************************************************************/

	// app.use('/alia', express.static('../../../../src'));
	// app.use('/', express.static('../../public'));
	// app.use('/', function(req, res, next) {
	// 	res.sendfile(fpath.join(__dirname, '../../public', 'index.html'));
	// });


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	/***********************************************************************************************************************
	 * Session Routes
	 ***********************************************************************************************************************/

	app.set('jwtTokenSecret', '123456ABCDEF');
	var tokens = [];

	function requiresAuthentication(request, response, next) {
		console.log('requiresAuthentication');
		// console.log(request.headers);
		if (request.headers.access_token) {
			var token = request.headers.access_token;
			if (_.where(tokens, token).length > 0) {
				var decodedToken = jwt.decode(token, app.get('jwtTokenSecret'));
				if (new Date(decodedToken.expires) > new Date()) {
					next();
					return;
				} else {
					removeFromTokens();
					response.end(401, "Your session is expired");
				}
			}
		}
		response.end(401, "No access token found in the request");
	}

	function removeFromTokens(token) {
		for (var counter = 0; counter < tokens.length; counter++) {
			if (tokens[counter] === token) {
				tokens.splice(counter, 1);
				break;
			}
		}
	}

	app.post('/api/login', function(request, response) {
		console.log('api/login');

		var userName = request.body.userName;
		var password = request.body.password;

		if (userName === "andrew" && password === "123") {
			var expires = new Date();
			expires.setDate((new Date()).getDate() + 5);
			var token = jwt.encode({
				userName: userName,
				expires: expires
			}, app.get('jwtTokenSecret'));

			tokens.push(token);

			response.send(200, {
				access_token: token,
				userName: userName
			});
		} else {
			response.send(401, "Invalid credentials");
		}
	});

	// app.post('/api/login', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(200);
	// 	});

	// app.post('/api/session/login', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(req.user);
	// 	});

	// app.post('/api/session/session', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(req.user);
	// 	});

	// app.post('/api/session/user', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(req.user);
	// 	});

	/***********************************************************************************************************************
	 * API Routes
	 ***********************************************************************************************************************/

	/*****************************************************************************************
	 * Session Routes
	 *****************************************************************************************/

	app.get('/api/session/validate', authControl.validate);
	app.get('/api/session/login', authControl.login);
	app.get('/api/session/logout', authControl.logout);
	app.get('/api/session/user', authControl.getUser);

	// app.get('/api/session/user/:id', session.getUser);
	// app.get('/api/session/get/:id', session.getSession);

	/*****************************************************************************************
	 * soxsObjects Routes
	 *****************************************************************************************/

	app.post('/api/soxs/create/:type', soxsController.create);
	app.get('/api/soxs/get/:type/:id', soxsController.get);
	app.get('/api/soxs/getall/:type', soxsController.getall);
	app.post('/api/soxs/insert/:type', soxsController.insert);

	app.get('/api/soxs/types', requiresAuthentication, soxsController.get_types);
	app.post('/api/soxs/update/:type/:id', soxsController.update);

	/*****************************************************************************************
	 * User Routes
	 *****************************************************************************************/

	app.get('/api/user/:id', users.user);
	app.post('/api/user', users.create);


	/*****************************************************************************************
	 * Recipe Routes
	 *****************************************************************************************/

	app.post('/api/recipes/add', recipes.create);

	app.get('/api/recipes/list', recipes.list);
	app.get('/api/recipes/:id', recipes.recipe);
	// app.post('/api/recipes/update', recipes.update);
	// app.post('/api/recipes/update', recipes.update);


	/****************************************************
	 * Step Routes
	 ****************************************************/

	app.post('/api/recipe/step/add/:id', recipes.addStep);
	app.post('/api/recipe/step/edit/:id', recipes.editStep);


	/****************************************************
	 * Ingredient Routes
	 ****************************************************/

	app.post('/api/recipe/ingredient/add/:id', recipes.addIngredient);
	app.post('/api/recipe/ingredient/edit/:id', recipes.editIngredient);


}