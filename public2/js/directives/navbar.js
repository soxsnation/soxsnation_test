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
					}, {
						name: 'Recipes',
						description: 'Recipes'
					}];


					$scope.isLoggedIn = soxsAuth.userLoggedIn();
					$scope.configItems = [];



					// function isAdminUser() {
					// 	var user = soxsAuth.getUserInfo();
					// 	if (user == null) { 
					// 		return false;
					// 	}
					// 	else {
					// 		var anded = user.permissions & 2;
					// 		console.log("is admin: " + anded + ' ' + anded == 2);
					// 		return (anded == 2);
					// 	}						
					// }

					$scope.isAdmin = function() {
						return soxsAuth.isAdminUser();
					}

					function configMenuItems() {
						var adminUser = soxsAuth.isAdminUser();
						console.log('configMenuItems' + adminUser);
						$scope.configItems = [];
						if (adminUser) {
							$scope.configItems.push({
								text: 'Load Data',
								link: 'load_data'
							});
							$scope.configItems.push({
								text: 'Data Setup',
								link: '/#/SoxsData'
							});
							$scope.configItems.push({
								text: 'Change Password',
								link: '/#/ChangePassword'
							});
						} else {
							$scope.configItems.push({
								text: 'Change Password',
								link: '/#/ChangePassword'
							});
						}
					}

					$scope.logout = function() {
						soxsAuth.logout().then(function(result) {
							if (result.status === 200) {
								$location.path('/Login');
							} else {
								$location.path('/404');
							}
						});
					}

					$scope.data_setup = function() {
						console.log('$scope.data_setup');
						$location.path('/SoxsData');
					}

					// $scope.changePassword = function() {
					// 	console.log('$scope.changePassword');
					// 	soxsAuth.changePassword('2')
					// 		.then(function(result) {
					// 			console.log('password change successful');


					// 			// $scope.$emit('login_changed', true);
					// 		}, function(error) {
					// 			alert("password change failed");
					// 			console.log(error);
					// 		});
					// }

					$scope.load_data = function() {
						$scope.data_models = [];
						var user = soxsAuth.getUserInfo();

						soxsAuth.http_get('api/soxs/types')
							.then(function(data) {
								console.log('Got Data for NavBar');
								console.log(data);
								$scope.data_models = [];

								for (var i = 0; i < data.length; ++i) {
									var model = {
										name: data[i].name + 's',
										description: data[i].description,
										permissionIndex: data[i].permissionIndex,
										fields: []
									}

									console.log(model);

									var fields = JSON.parse(data[i].fields);
									for (var prop in fields) {
										var field = {
											name: prop,
											type: fields[prop]
										}
										model.fields.push(field);
									}
									var anded = user.permissions & model.permissionIndex;
									var hasPermission = (anded == model.permissionIndex);
									console.log(model.name + ' ' + hasPermission + ' ' + anded);
									console.log(user.permissions + ' ' + model.permissionIndex);
									// console.log(model.name + ' ' + hasPermission);

									if (hasPermission) {
										$scope.data_models.push(model);
									}
								}

								configMenuItems();
							}, function(err) {
								console.log('ERROR: ' + err);
							})
					}


					$scope.$on('login_changed', function(event, data) {
						console.log('login_changed');
						console.log(data);
						$scope.isLoggedIn = soxsAuth.userLoggedIn();
						$scope.load_data();
						configMenuItems();
					});


				}
			};
		}
	])