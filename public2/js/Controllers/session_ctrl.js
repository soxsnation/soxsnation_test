/* session_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

angular.module('soxsnationApp')
	.controller('LoginController', ['$scope', '$rootScope', '$location', 'soxsAuth',
		function($scope, $rootScope, $location, soxsAuth) {
			// if (soxsAuth.getUserInfo() == null) {
			// 	$location.path('/Login');
			// }

			// soxsAuth.validateUser().then(function(user) {
			// }, function(error) {
			// 	$location.path('/Login');
			// });

			$scope.username = '';//'soxsnation@gmail.com';

			function user_login() {
				soxsAuth.login($scope.username, $scope.password)
					.then(function(result) {
						console.log('login successful');
						$scope.userInfo = result;
						$location.path('/Home');
						$rootScope.$broadcast('login_changed', 'broadcast');
                    	$rootScope.$emit('login_changed', 'emit');

						// $scope.$emit('login_changed', true);
					}, function(error) {
						alert("Invalid credentials");
						console.log(error);
					});
			};

			$scope.login = function() {
				user_login();
			}

			$scope.getData = function () {
				console.log('$scope.getData');
				console.log(soxsAuth.getUserInfo());
			}

		}
	]);

angular.module('soxsnationApp')
	.controller('ChangePasswordController', ['$scope', '$location', 'soxsAuth',
		function($scope, $location, soxsAuth) {

			soxsAuth.validateUser().then(function(user) {
			}, function(error) {
				$location.path('/Login');
			});

			function chanegPassowrd() {

				if ($scope.password !== $scope.passwordconfirm) {
					console.log("Passwords don't match");
					alert("Passwords don't match")
				} else {

					soxsAuth.changePassword($scope.password)
						.then(function(result) {
							console.log('password change successful');


							// $scope.$emit('login_changed', true);
						}, function(error) {
							alert("password change failed:" + error);
							console.log(error);
						});
				}
			};

			$scope.change_password = function() {
				chanegPassowrd();
			}

		}
	]);