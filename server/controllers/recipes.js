/* recipes.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

var mongoose = require('mongoose'),
	Recipe = mongoose.model('Recipe'),
	extend = require('util')._extend;
	// Utils = require('../lib/Utils');



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
 * Create recipe
 */

exports.create = function(req, res, next) {
	console.log('recipes.create');
	// Utils.parse(req, function(err, data) {
		// console.log(data);
		var recipe = new Recipe(req.body);
		recipe.save(function(err) {
			if (err) {
				console.log(err);
				return res.send(403);
			} else {
				return res.json(recipe);
			}
		})
	// })
}

/**
 * List recipes
 */

exports.list = function(req, res, next) {
	console.log('recipes.recipe');
	Recipe.find({}).exec(function(err, recipes) {
		if (err) {
			return next(err);
		}
		if (!recipes) {
			return next(new Error('Failed to load recipe ' + id));
		}

		res.json(recipes);
	})
}

/**
 * recipe
 */

exports.recipe = function(req, res, next) {
	// console.log('recipes.recipe');
	Recipe.findOne({
		_id: req.params.id
	}).exec(function(err, recipe) {
		if (err) {
			return next(err);
		}
		if (!recipe) {
			return next(new Error('Failed to load recipe ' + req.params.id));
		}
		res.json(recipe);
	})
}

/**
 * Update recipe
 */

// exports.update = function(req, res, next) {

// 	parse(req, function(err, data) {
// 		console.log('Update Recipe');
// 		// data['user'] = 'Andrew';
// 		if (data._id == null) {
// 			res.send(405);
// 		} else {
// 			var recipe = new Recipe(data);
// 			console.log(recipe);

// 			recipe.save(function(err) {
// 				if (err) {
// 					console.log(err);
// 					return res.send(403);
// 				} else {
// 					return res.json(recipe);
// 				}
// 			})
// 		}
// 	});
// }

/***********************************************************************************************************************
 * Functions
 ***********************************************************************************************************************/



/***********************************************************************************************************************
 * Step Exports
 ***********************************************************************************************************************/

exports.addStep = function(req, res, next) {
	console.log('addStep');
	console.log(req.params.id);
	console.log(req.body);
	// parse(req, function(err, step) {
		Recipe.findOne({
			_id: req.params.id
		}).exec(function(err, recipe) {
			if (err) {
				console.log(err);
				return next(err);
			} else {
				console.log('found recipe, now to add step')
				recipe.addStep(req.body, function(data) {
					res.send(200);
					// res.json(recipe);
				});
			}
		});
	// });
}


/***********************************************************************************************************************
 * Ingredient Exports
 ***********************************************************************************************************************/

exports.addIngredient = function(req, res, next) {
	// parse(req, function(err, ingredient) {
		Recipe.findOne({
			_id: req.params.id
		}).exec(function(err, recipe) {
			if (err) {
				return next(err);
			} else {
				recipe.addIngredient(req.body, function(data) {
					console.log(data);
					res.send(200);
					// res.json(recipe);
				});
			}
		});
	// });
}