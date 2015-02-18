/* temp_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       2/18/2015
 *
 */

angular.module('soxsnationApp')
	.controller('DragController', ['$scope', '$location', 'soxsFactory',
		function($scope, $location, soxsFactory) {
 

			$scope.dragOptions = {
				start: function(e) {
					console.log("STARTING");
				},
				drag: function(e) {
					console.log("DRAGGING");
				},
				stop: function(e) {
					console.log("STOPPING");
				},
					container: 'container-id'
			}

		}
	]);