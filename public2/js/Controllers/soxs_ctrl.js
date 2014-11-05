/* soxs_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/3/2014
 *
 */

/* Controllers */

angular.module('soxsnationApp')
	.controller('SoxsController', ['$scope', 'soxsAuth', '$location', 'soxsDataService',
		function($scope, soxsAuth, $location, soxsDataService) {
			soxsAuth.validateUser().then(function(user) {
				console.log('User is logged in');



				$scope.name = soxsAuth.getUserInfo().firstName + ' ' + soxsAuth.getUserInfo().lastName;
				$scope.page = 'Home Page';
				if (soxsAuth.isAdminUser()) {
					$scope.user = user;
				}

				$scope.message = $scope.lastError;

				$scope.$on('login_changed', function(event, data) {
					console.log('login_changed');
					console.log(data);
				});

				$scope.names = soxsDataService.users;

			}, function(error) {
				$location.path('/Login');
			});


		}
	]);

angular.module('soxsnationApp')
	.controller('SoxsController2', //['$scope', 'soxsAuth', '$location',
		function($scope, soxsAuthService, USER_ROLES, $location) {

			$scope.currentUser = null;
			$scope.userRoles = USER_ROLES;
			$scope.isAuthorized = AuthService.isAuthorized;

			$scope.setCurrentUser = function(user) {
				console.log('setCurrentUser' + user);
				$scope.currentUser = user;
			};

			// soxsAuth.validateUser().then(function(user) {
			// 	// console.log('User is logged in');



			// 	$scope.name = soxsAuth.getUserInfo().firstName + ' ' + soxsAuth.getUserInfo().lastName;
			// 	$scope.page = 'Home Page';
			// 	if (soxsAuth.isAdminUser()) {
			// 		$scope.user = user;
			// 	}

			// 	$scope.message = $scope.lastError;

			// 	$scope.$on('login_changed', function(event, data) {
			// 		console.log('login_changed');
			// 		console.log(data);
			// 	});

			// }, function(error) {
			// 	$location.path('/Login');
			// });


		}
// ]
);



// angular.module('soxsnationApp')
// 	.controller('HomeController', ['$scope', '$location', 'soxsAuth',
// 		function($scope, $location, soxsAuth) {

// 			soxsAuth.validateUser().then(function(user) {
// 				$scope.name = soxsAuth.getUserInfo().firstName + ' ' + soxsAuth.getUserInfo().lastName;
// 				$scope.page = 'Home Page';
// 				$scope.isAdminUser = soxsAuth.isAdminUser();
// 				if ($scope.isAdminUser) {
// 					$scope.user = user;
// 				}

// 				$scope.logout = function() {
// 					soxsAuth.logout()
// 						.then(function(result) {
// 							console.log('logout successful');
// 							$location.path('/Login');
// 						}, function(error) {
// 							alert(error);
// 							console.log(error);
// 						});
// 				}


// 			}, function(error) {
// 				$location.path('/Login');
// 			});

// 			$scope.load_data = function() {
// 				console.log('load_data');
// 				// initData();
// 			}



// 		}
// 	]);