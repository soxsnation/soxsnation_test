/* soxsItemEdit.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/14/2014
 *
 */


angular.module('soxsnationApp')
	.directive('soxsitemedit', ['soxsAuth', '$location',
		function(soxsAuth, $location) {
			return {
				restrict: 'E',
				transclude: true,
				templateUrl: '../partials/soxsItems/directives/soxsItemEdit.html',
				controller: function($scope) {

				}
			}
		}
		]);