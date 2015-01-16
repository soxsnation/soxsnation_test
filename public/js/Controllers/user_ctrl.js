/* user_strl.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/15/2015
 *
 */


angular.module('soxsnationApp')
	.controller('UserController', ['$scope', '$location', 'soxsAuth',
		function($scope, $location, soxsAuth) {

			$scope.selectedUser = {};
			$scope.mode = 'view';

			$scope.add_user_clicked = function() {
				console.log('$scope.add_user_clicked');
				$scope.selectedUser = {
					username: '',
					permissions: 0,
					firstName: '',
					lastName: '',
					email: '',
					password: ''
				};
				$scope.mode = 'insert';
				$scope.button_submitText = 'Insert User';

				for (var i = 0; i < $scope.app_list.length; ++i) {
					$scope.app_list[i].checked = false;
				}

				// $scope.selectedUser = {};
				// $scope.button_submitText = 'Create New User';
			};

			$scope.user_clicked = function(user) {
				console.log('$scope.user_clicked()');
				$scope.selectedUser = user;
				$scope.mode = 'edit';
				$scope.button_submitText = 'Update User';

				for (var i = 0; i < $scope.app_list.length; ++i) {
					if ((user.permissions & $scope.app_list[i].permissionIndex) == $scope.app_list[i].permissionIndex) {
						$scope.app_list[i].checked = true;
					}
				}
			};

			function get_permissions() {
				var userPermission = new Number(0);;
				for (var i = 0; i < $scope.app_list.length; ++i) {
					if ($scope.app_list[i].checked) {
						userPermission += new Number($scope.app_list[i].permissionIndex);
					}
				}
				return userPermission;
			}

			function insert_user() {
				$scope.selectedUser.permissions = get_permissions();
				soxsAuth.http_post('/api/insert/user', $scope.selectedUser)
					.then(function(data) {
						console.log('USER INSERTED');
						$scope.users.push($scope.selectedUser);
					}, function(err) {
						console.log('ERROR: ' + err);
					})
			};

			function update_user() {
				console.log('$scope.update_user: ' + $scope.selectedUser);
				
				$scope.selectedUser.permissions = get_permissions();
				soxsAuth.http_post('/api/update/user/' + $scope.selectedUser.username, $scope.selectedUser)
					.then(function(data) {
						console.log('USER UPDATED');
					}, function(err) {
						console.log('ERROR: ' + err);
					})
			}

			$scope.user_submit_clicked = function() {
				if ($scope.mode === 'edit') {
					update_user();
				} else if ($scope.mode === 'insert') {
					insert_user();
				}
			};

			function get_user_permissions() {
				$scope.app_list = [];
				soxsAuth.http_get('api/soxs/types')
					.then(function(apps) {
						for (var i = 0; i < apps.length; ++i) {
							$scope.app_list.push({
								name: apps[i].name,
								permissionIndex: apps[i].permissionIndex,
								checked: false
							});
						}

					}, function(err) {
						console.log('ERROR: ' + err);
					})
			};

			function get_users() {
				soxsAuth.http_get('api/users').then(function(users) {
					$scope.users = users;
				})
			};
			get_users();
			get_user_permissions();


		}
	]);