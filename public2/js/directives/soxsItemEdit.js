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
					$scope.addListObject = function(property) {
						console.log(property);
						if (!$scope.currentItem.hasOwnProperty(property)) {
							$scope.currentItem[property] = [];
						}
						$scope.currentItem[property].push($scope.list_Item[property]);
						$scope.list_Item[property] = {};
					}

					$scope.array_item_remove = function(property, index) {
						$scope.currentItem[property].splice(index, 1);
					}
				}
			}
		}
	]);