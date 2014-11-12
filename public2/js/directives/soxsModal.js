/* soxsModal.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/11/2014
 *
 */


angular.module('soxsnationApp')
	.directive('soxsmodal', ['soxsAuth', '$location',
		function(soxsAuth, $location) {
			return {
				restrict: 'E',
				transclude: true,
				templateUrl: '../partials/directives/soxsModal.html',
				controller: function($scope) {

					// $scope.currentItem = 'currentItem'

				}
			}
		}
	]);