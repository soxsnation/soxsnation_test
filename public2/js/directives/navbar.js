/* navbar.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */


angular.module('soxsnationApp')
	.directive('navbar', ['soxsAuth', '$http', '$location',
		function(soxsAuth, $http, $location) {
			return {
				restrict: 'E',
				transclude: true,
				templateUrl: '../partials/directives/navbar.html',
				controller: function($scope) {
					$scope.data_models = [{
						name: 'Home',
						description: 'description'
					},
					{
						name: 'Recipes',
						description: 'Recipes'
					}];

					$scope.load_data = function() {
						soxsAuth.http_get('api/soxs/types')
					.then(function(data) {
						console.log('Got Data for NavBar');
						console.log(data);
						$scope.data_models = [];

						for (var i = 0; i < data.length; ++i) {
							var model = {
								name: data[i].name,
								description: data[i].description,
								fields: []
							}

							var fields = JSON.parse(data[i].fields);
							for (var prop in fields) {
								var field = {
									name: prop,
									type: fields[prop]
								}
								model.fields.push(field);
							}

							$scope.data_models.push(model);
						}
					}, function(err){
						console.log('ERROR: ' + err);
					})
					}

				


				}
			};
		}
	])