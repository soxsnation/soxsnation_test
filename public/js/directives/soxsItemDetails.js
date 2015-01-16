/* soxsItemDetails.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/14/2014
 *
 */


angular.module('soxsnationApp')
	.directive('soxsitemdetails', ['soxsAuth', '$location',
		function(soxsAuth, $location) {
			return {
				restrict: 'E',
				transclude: true,
				templateUrl: '../partials/soxsItems/directives/soxsItemDetails.html',
				controller: function($scope) {

				}
			}
		}
		]);

