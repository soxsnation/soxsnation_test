/* link_controller.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

/* Controllers */


function LinkController($scope, $http) {
	$scope.page = 'Link Page';
	$scope.links = [];

	$http.get('data/links.json').success(function(data) {
		$scope.links = data;
	});

	$scope.saveLink = function() {
		console.log('savelink');
		var links = []; //$scope.links;
		links.push_back({
			text: $scope.link_text,
			link: $scope.link_link,
			tags: [$scope.link_tag]
		});
	};

};