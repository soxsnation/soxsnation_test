/* user_strl.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/15/2015
 *
 */


angular.module('soxsnationApp')
	.controller('UserController', ['$scope', '$location', 'soxsAuth',
		function($scope, $location, soxsAuth) {

			$scope.add_user_clicked = function() {
				console.log('$scope.add_user_clicked');
			}


		}
	]);