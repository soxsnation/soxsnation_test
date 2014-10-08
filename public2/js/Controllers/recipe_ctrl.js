/* recipe_controller.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

/* Controllers */


function RecipeController($scope, $http) {
	$scope.mode = 'none';
	$scope.modalHidden = 'true';

	$scope.page = 'Recipe Page';
	$scope.links = [];
	$scope.showAlert = 'none';
	$scope.alertText = 'Alert';
	$scope.alertCss = 'alert-danger';
	$scope.modal_error = '';

	$scope.recipe_tags = [];
	$scope.recipe_ingredients = [];
	$scope.recipe_steps = [];


	function showModal(mode, recipe) {
		$scope.mode = mode;
		if ($scope.mode === 'edit') {
			$scope.modalTitle = 'Edit recipe';
			$scope.modalSubmitText = 'Update recipe data';

			$scope.recipe_name = recipe.name;
			$scope.recipe_desc = recipe.description;
			$scope.recipe_tags = recipe.tags;
			// $scope.recipe_ingredients = recipe.ingredients;
			// $scope.recipe_steps = recipe.steps;
			$scope.recipe_id = recipe._id;
		} else if ($scope.mode === 'insert') {
			$scope.modalTitle = 'Insert recipe';
			$scope.modalSubmitText = 'Create New recipe';
		}

		$('#myModal').modal('show');
	};

	function saveRecipeData() {
		var url = 'http://localhost:3085/api/soxs/';
		if ($scope.mode === 'edit') {
			url += 'update/recipe/' + $scope.recipe_id;
		} else if ($scope.mode === 'insert') {
			url += 'insert/recipe'
		}

		var recipe = {
			name: $scope.recipe_name,
			description: $scope.recipe_desc,
			tags: $scope.recipe_tags,
			steps: $scope.recipe_steps,
			ingredients: $scope.recipe_ingredients
		}
		console.log(url);
		console.log(recipe);

		$http.post(url, recipe).success(function(data) {
			// links.push(link);

			$scope.showAlert = 'block';
			$scope.alertText = 'recipe saved!!';
			$scope.alertCss = 'alert-success';
			$('#myModal').modal('hide');

		}).error(function(data, status){
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

	$scope.edit_recipe_mode = function(recipe) {
		console.log(recipe);
		showModal('edit', recipe);
	};

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

	$http.get('http://localhost:3085/api/soxs/getall/recipe').success(function(data) {
		$scope.recipes = [];
		$scope.tags = [];
		for (var i = 0; i < data.length; ++i) {
			var l = {
				name: data[i].name,
				description: data[i].description,
				tags: data[i].tags.split(','),
				_id: data[i]._id
			};
			for (var j = 0; j < l.tags.length; ++j) {
				var found = false;
				for (var k = 0; k < $scope.tags.length; ++k) {
					if (l.tags[j] == $scope.tags[k]) { found = true; break;}
				}
				if (!found) { $scope.tags.push(l.tags[j]); }
			}
			$scope.recipes.push(l);
		}
	});



}