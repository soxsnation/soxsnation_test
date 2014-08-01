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
var authControl = require('../controllers/authController');
var users = require('../controllers/users');
var recipes = require('../controllers/recipes');
var express = require('express');
var fpath = require('path');
var User = require('../models/User');
var Auth = require('../lib/authorization');

/**
 * Expose routes
 */

module.exports = function(app, passport) {

	// TODO: I had to add this in to support CORS requests. I'm not sure this is the way to do this.
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
		res.header("Access-Control-Allow-Credentials", "true");
		next();
	});

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


	/****************************************************
	 * Ingredient Routes
	 ****************************************************/

	app.post('/api/recipe/ingredient/add/:id', recipes.addIngredient);


}