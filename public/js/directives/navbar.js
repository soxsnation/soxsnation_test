/* navbar.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */


angular.module('soxsnationApp')
	.directive('navbar', ['soxsAuth', '$location',
		function(soxsAuth, $location) {
			return {
				restrict: 'E',
				transclude: true,
				templateUrl: '../partials/directives/navbar.html',
				controller: function($scope, $rootScope) {

							// console.log('NAVBAR Userlogged in');

							$scope.configItems = [];
							$scope.configAdminItems = [];
							$scope.configAdminLinks = [];
							$scope.isLoggedIn = false; //soxsAuth.userLoggedIn();
							$scope.isAdminUser = false; //soxsAuth.isAdminUser(); 

							// $scope.isAdmin = function() {
							// 	return soxsAuth.isAdminUser();
							// }

							function init_navbar() {
								// console.log('init_navbar');
								$scope.isLoggedIn = soxsAuth.userLoggedIn();
								$scope.isAdminUser = soxsAuth.isAdminUser();
								// console.log($scope.isLoggedIn);
								// console.log($scope.isAdminUser);
								load_nav_menu();
							};
							init_navbar();

							function configMenuItems() {
								var adminUser = soxsAuth.isAdminUser();
								// console.log('configMenuItems' + adminUser);
								$scope.configItems = [];
								if (adminUser) {
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

							function configAdminMenuItems() {
								$scope.configAdminItems = [];
								$scope.configAdminLinks = [];
								if (soxsAuth.isAdminUser() !== false) {
									$scope.configAdminLinks.push({
										text: 'Data Setup',
										value: 'SoxsData'
									});
									$scope.configAdminLinks.push({
										text: 'Data Type Setup',
										value: 'SoxsTypes'
									});
									$scope.configAdminLinks.push({
										text: 'User Administration',
										value: 'Users'
									});
									$scope.configAdminItems.push({
										text: 'Load Data',
										value: 'load_data'
									});
									$scope.configAdminItems.push({
										text: 'Debug Data',
										value: 'debug_data'
									});
								}
							}

							function debug_data_function() {
								console.log('debug_data_function');
							}

							$scope.admin_menu_item = function(clicked_item) {
								// console.log('$scope.admin_menu_item:' + clicked_item);

								if (clicked_item === 'load_data') {
									load_nav_menu();
								} else if (clicked_item === 'debug_data') {
									debug_data_function();
								}
							}

							$scope.admin_menu_link = function(clicked_link) {
								console.log('$scope.admin_menu_link:' + clicked_link);
								$location.path('/' + clicked_link);
								// if (clicked_link === 'soxsData') {
								// 	$location.path('/SoxsData');
								// }
							}

							$scope.logout = function() {
								soxsAuth.logout().then(function(result) {
									// console.log('logout result' + result)
									if (result.status === 200) {
										$location.path('/Login');
									} else {
										$location.path('/404');
									}
								}, function(error) {
									$location.path('/404');
								});
							}

							$scope.data_setup = function() {
								$location.path('/SoxsData');
							}


							// $scope.load_data = function() {
							function load_nav_menu() {
								// console.log('load_nav_menu');
								$scope.data_models = [];
								var userData = soxsAuth.getUserInfo();
								if (userData == null) {
									$location.path('/Login');
								}
								// console.log('User');
								// console.log(JSON.stringify(userData));

								soxsAuth.http_get('api/soxs/types')
									.then(function(data) {
										// console.log('Got Data for NavBar');
										// console.log(data);
										$scope.data_models = [];

										for (var i = 0; i < data.length; ++i) {
											var model = {
												name: data[i].name + 's',
												description: data[i].description,
												permissionIndex: data[i].permissionIndex,
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
											var anded = userData.permissions & model.permissionIndex;
											var hasPermission = (anded == model.permissionIndex);
											// console.log(model.name + ' ' + hasPermission + ' ' + anded);
											// console.log(userData.permissions + ' ' + model.permissionIndex);
											// console.log(model.name + ' ' + hasPermission);

											if (hasPermission) {
												$scope.data_models.push(model);
											}
										}

										var dragModel = {
											name: 'drag',
											description: 'drag',
												permissionIndex: 2,
												fields: []
										}
										var templateModel = {
											name: 'template',
											description: 'template',
												permissionIndex: 4,
												fields: []
										}
										$scope.data_models.push(dragModel);
										$scope.data_models.push(templateModel);

										configMenuItems();
										configAdminMenuItems();
									}, function(err) {
										console.log('ERROR: ' + err);
									})
							};


							$rootScope.$on('login_changed', function(event, data) {
								console.log('login_changed');
								// console.log(data);
								init_navbar();
								// $scope.isLoggedIn = soxsAuth.userLoggedIn();
								// $scope.isAdminUser = soxsAuth.isAdminUser();
								// load_nav_menu();
							});

				}

			};
		}
	])