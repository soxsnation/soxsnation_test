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
				// transclude: true,
				templateUrl: '../partials/directives/soxsData/soxsModal.html',
				controller: function($scope) {

					

					$scope.addListItem = function(property) {
						console.log('$scope:' + $scope.list_Item[property]);
						console.log(property);
						if (!$scope.currentItem.hasOwnProperty(property)) {
							$scope.currentItem[property] = [];
						}
						$scope.currentItem[property].push($scope.list_Item[property]);
						$scope.list_Item[property] = '';
					}

					$scope.addListObject = function(property) {
						console.log(property);
						if (!$scope.currentItem.hasOwnProperty(property)) {
							$scope.currentItem[property] = [];
						}
						$scope.currentItem[property].push($scope.list_Item[property]);
						$scope.list_Item[property] = {};
					}

					$scope.item_clicked = function(item) {
						console.log('item_clicked' + item);
						for (var i = 0; i < $scope.currentDataModel.length; ++i) {
							if ($scope.currentDataModel[i].name == item) {
								if ($scope.currentDataModel[i].isEditable) {
									$scope.currentDataModel[i].isEditable = false;
									$scope.currentDataModel[i].buttonText = 'Edit';
								} else {
									$scope.currentDataModel[i].isEditable = true;
									$scope.currentDataModel[i].buttonText = 'Done';
								}

							}
						}
					}

					$scope.array_item_changed = function(property, index, text) {
						$scope.currentItem[property][index] = text;
					}

					$scope.array_item_remove = function(property, index) {
						$scope.currentItem[property].splice(index, 1);
					}

				}
			}
		}
	]);