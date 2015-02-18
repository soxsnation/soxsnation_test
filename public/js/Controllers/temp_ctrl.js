/* temp_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       2/18/2015
 *
 */

angular.module('soxsnationApp')
	.controller('DragController', ['$scope', '$location', 'soxsFactory',
		function($scope, $location, soxsFactory) {

			$scope.list1 = [];
			$scope.list5 = [{
				'title': 'Item 1',
				'drag': true
			}, {
				'title': 'Item 2',
				'drag': true
			}, {
				'title': 'Item 3',
				'drag': true
			}, {
				'title': 'Item 4',
				'drag': true
			}, {
				'title': 'Item 5',
				'drag': true
			}, {
				'title': 'Item 6',
				'drag': true
			}, {
				'title': 'Item 7',
				'drag': true
			}, {
				'title': 'Item 8',
				'drag': true
			}];

			$scope.item1 = {
				'title': 'Item 1',
				'drag': true
			}

			$scope.item2 = {
				'title': 'Item 2',
				'drag': true
			}

			$scope.drag_options = {
				revert: 'invalid'
			}

			$scope.drag = {
				placeholder: true,
				animate: true,
				deepCopy: true
			}


			$scope.optionsList1 = {
				accept: function(dragEl) {
					console.log('$scope.optionsList1 ');
					if ($scope.list1.length >= 2) {
						return false;
					} else {
						return true;
					}
				}
			}

			$scope.btn_clicked = function() {
				console.log(JSON.stringify($scope.item1));
				console.log($scope.list1);
			}

		}
	]);