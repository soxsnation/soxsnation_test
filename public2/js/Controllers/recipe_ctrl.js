/* recipe_controller.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

/* Controllers */

angular.module('soxsnationApp')
	.controller('RecipeController', ['$scope', '$http', '$location', 'soxsAuth',
		function RecipeController($scope, $http, $location, soxsAuth) {
			soxsAuth.validateUser().then(function(user) {

				$scope.mode = 'none';
				$scope.modalHidden = 'true';

				$scope.page = 'Recipe Page';
				$scope.links = [];
				$scope.showAlert = 'none';
				$scope.alertText = 'Alert';
				$scope.alertCss = 'alert-danger';
				$scope.modal_error = '';
				$scope.current_recipe = {};
				$scope.recipeSelected = false;

				$scope.recipe_tags = [];
				$scope.recipe_ingredients = [];
				$scope.recipe_steps = [];
				var server = 'http://localhost:3085/';
				server = '';

				function recipeUpdated(recipeData) {
					console.log('recipeUpdated');
					console.log(recipeData);
					var recp = {
						name: recipeData.name,
						description: recipeData.description,
						// tags: data[i].tags.split(','),
						steps: recipeData.steps,
						ingredients: recipeData.ingredients,
						_id: recipeData._id,
						dateUpdated: recipeData.dateUpdated,
						userUpdated: recipeData.userUpdated
					};
					$scope.current_recipe = recp;
					if ($scope.mode === 'insert') {
						$scope.recipes.push(recp);
					} else {
						for (var i = 0; i < $scope.recipes.length; ++i) {
							if ($scope.recipes[i]._id === recp._id) {
								$scope.recipes[i] = recp;
							}
						}
					}

				}

				function showModal(mode, recipe) {
					$scope.mode = mode;
					if ($scope.mode === 'edit') {
						$scope.modalTitle = 'Edit recipe';
						$scope.modalSubmitText = 'Update recipe data';

						$scope.recipe_name = recipe.name;
						$scope.recipe_desc = recipe.description;
						$scope.recipe_tags = recipe.tags;
						$scope.recipe_ingredients = recipe.ingredients;
						$scope.recipe_steps = recipe.steps;
						$scope.recipe_id = recipe._id;
					} else if ($scope.mode === 'insert') {
						$scope.modalTitle = 'Insert recipe';
						$scope.modalSubmitText = 'Create New recipe';
						$scope.recipe_name = '';
						$scope.recipe_desc = '';
						$scope.recipe_tags = '';
						$scope.recipe_ingredients = [];
						$scope.recipe_steps = [];
						$scope.recipe_id = '';
					}

					$('#myModal').modal('show');
				};

				function saveRecipeData() {
					var url = server + 'api/soxs/';
					if ($scope.mode === 'edit') {
						url += 'update/recipe/' + $scope.recipe_id;
					} else if ($scope.mode === 'insert') {
						url += 'insert/recipe'
					}
					var currentdate = new Date();
					var recipe = {
						name: $scope.recipe_name,
						description: $scope.recipe_desc,
						tags: $scope.recipe_tags,
						steps: $scope.recipe_steps,
						ingredients: $scope.recipe_ingredients,
						userUpdated: soxsAuth.getUserInfo().firstName + ' ' + soxsAuth.getUserInfo().lastName,
						dateUpdated: currentdate.toDateString()
					};
					// If its in insert mode, set the user and time it was added
					if ($scope.mode === 'insert') {
						recipe['userAdded'] = soxsAuth.getUserInfo().username;
						recipe['dateAdded'] = currentdate.toDateString();
					}

					console.log(url);
					console.log(recipe);

					$http.post(url, recipe).success(function(data) {
						// links.push(link);
						console.log('saveRecipeData-->Data');
						recipe._id = $scope.current_recipe._id;
						console.log(recipe);
						recipeUpdated(recipe);
						$scope.showAlert = 'block';
						$scope.alertText = 'recipe saved!!';
						$scope.alertCss = 'alert-success';
						$('#myModal').modal('hide');

					}).error(function(data, status) {
						console.log(data);
						console.log(status);
						// $scope.showAlert = 'block';
						// $scope.alertText = 'Link not saved: ' + data.substring(0, 50);
						// $scope.alertCss = 'alert-danger';
						$scope.modal_error = 'recipe not saved: ' + data.substring(0, 50);
					})
				};

				$scope.addTagToRecipe = function() {
					$scope.recipe_tags.push($scope.newTag);
					// console.log($scope.recipe_tags);
				}

				$scope.insert_recipe_mode = function() {
					showModal('insert');
				};

				$scope.edit_recipe_mode = function() {

					showModal('edit', $scope.current_recipe);
				};

				$scope.select_recipe = function(recipe) {
					$scope.recipeSelected = true;
					$scope.current_recipe = recipe;
				}

				$scope.saveRecipe = function() {
					console.log('saveRecipe');
					saveRecipeData();

				};

				$scope.addIngredientToRecipe = function() {
					console.log($scope.next_ingredient);
					console.log($scope.next_ingredient_quantity);
					var ing = {
						name: $scope.next_ingredient,
						quantity: $scope.next_ingredient_quantity
					}
					$scope.next_ingredient = '';
					$scope.next_ingredient_quantity = '';

					$scope.recipe_ingredients.push(ing);
					console.log($scope.recipe_ingredients);
				}

				$scope.addStepToRecipe = function() {
					console.log($scope.next_step_number);
					console.log($scope.next_step_description);
					var ing = {
						number: $scope.next_step_number,
						description: $scope.next_step_description
					}
					$scope.next_step_number = $scope.next_step_number + 1;
					$scope.next_step_description = '';

					$scope.recipe_steps.push(ing);
					console.log($scope.recipe_steps);
				}

				function populate_recipes() {
					$http.get(server + 'api/soxs/getall/recipe').success(function(data) {
						$scope.recipes = [];
						$scope.tags = [];
						for (var i = 0; i < data.length; ++i) {
							var l = {
								name: data[i].name,
								description: data[i].description,
								// tags: data[i].tags.split(','),
								steps: data[i].steps,
								ingredients: data[i].ingredients,
								_id: data[i]._id,
								dateUpdated: data[i].dateUpdated,
								userUpdated: data[i].userUpdated
							};
							// for (var j = 0; j < l.tags.length; ++j) {
							// 	var found = false;
							// 	for (var k = 0; k < $scope.tags.length; ++k) {
							// 		if (l.tags[j] == $scope.tags[k]) { found = true; break;}
							// 	}
							// 	if (!found) { $scope.tags.push(l.tags[j]); }
							// }
							$scope.recipes.push(l);
						}
					});
				};
				populate_recipes();


			}, function(error) {
				$location.path('/Login');
			});


		}
	]);