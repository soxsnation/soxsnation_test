'use strict';

alia.defineService({
	name: 'sox',
	dependencies: ['$request']
}, function($request) {

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Private functions


	function parseBody(res) {
		return res.body;
	};

	function recipeList() {
		return [{
				name: 'Corn Beef',
				user: 'Andrew',
				date: new Date(),
				ingredients: [{
					name: 'Corn Beef'
				}, {
					name: 'Carrots'
				}, {
					name: 'Potatoes'
				}],
				steps: [{
					number: 1,
					text: 'Boil the corn beef'
				}, {
					number: 2,
					text: 'Chop up the veggies'
				}, {
					number: 3,
					text: 'Add the veggies to the boiling water'
				}]
			}, {
				name: 'Chicken',
				user: 'Joan',
				date: new Date()
			}, {
				name: 'Chex Mix',
				user: 'Joan',
				date: new Date()
			}

		]
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Service functions

	var sox = {};
	var server = 'http://localhost:3085/api/';

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Recipe functions

	sox.getRecipes = function() {
		console.log('sox.getRecipes()');
		// return recipeList();
		return $request.get(server + 'recipes/list', {}, {}).then(parseBody);
	};

	sox.getRecipeById = function(id) {
		console.log('sox.getRecipeById()');
		return $request.get(server + 'recipes/:id', {
			id: id
		}, {}).then(parseBody);
	};

	sox.getRecipeByName = function(recipeName) {
		console.log('sox.getRecipeByName()');
		return recipeList()[0];
		// return $request.get(server + 'recipe', {}, {}).then(parseBody);
	};

	sox.insertRecipe = function(recipe) {
		console.log('sox.insertRecipe');
		return $request.post(server + 'recipe/add', recipe).then(parseBody);
	}

	sox.updateRecipe = function(recipe) {
		console.log('sox.updateRecipe');
		return $request.post(server + 'recipes/update', recipe).then(parseBody);
	};

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Steps functions

	sox.addStep = function(id, step) {
		console.log('sox.addStep');
		return $request.post(server + 'recipe/step/add/:id', { id: id }, {}, step).then(parseBody);
	};

		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Ingredient functions

	sox.addIngredient = function(id, ingredient) {
		console.log('sox.addIngredient');
		return $request.post(server + 'recipe/ingredient/add/:id', { id: id }, {}, ingredient).then(parseBody);
	};


	return sox;

});