/* routes.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

/**
 * Controllers
 */

var users = require('../controllers/users');
var recipes = require('../controllers/recipes');
var express = require('express');
var fpath = require('path');

/**
 * Expose routes
 */

module.exports = function(app) {

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
	 * API Routes
	 ***********************************************************************************************************************/
	app.get('/api/users/:id', users.user);
	app.post('/api/user/', users.create);


	/*****************************************************************************************
	 * Recipe Routes
	 *****************************************************************************************/

	// app.post('/api/recipe/add', recipes.create);

	app.get('/api/recipes/list', recipes.list);
	// app.get('/api/recipes/:id', recipes.recipe);
	// app.post('/api/recipes/update', recipes.update);
	// app.post('/api/recipes/update', recipes.update);
	

	/****************************************************
	 * Step Routes
	 ****************************************************/

	// app.post('/api/recipe/step/add/:id', recipes.step.add);


	/****************************************************
	 * Ingredient Routes
	 ****************************************************/

	// app.post('/api/recipe/ingredient/add/:id', recipes.ingredient.add);
	

}