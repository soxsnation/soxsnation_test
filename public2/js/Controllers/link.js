/* link_controller.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

/* Controllers */


angular.module('soxsnationApp')
.controller('LoginController', ['$scope','$http',  '$location', 'soxsAuth',
function LinkController($scope, $http, $location) {
	$scope.page = 'Link Page';
	$scope.links = [];
	$scope.showAlert = 'none';
	$scope.alertText = 'Alert';
	$scope.alertCss = 'alert-danger';
	var server = 'http://localhost:3085/';

	// $http.get('data/links.json').success(function(data) {
	// 	$scope.links = data;
	// });

	$http.get(server + 'api/soxs/getall/link').success(function(data) {
		$scope.links = [];
		$scope.tags = [];
		for (var i = 0; i < data.length; ++i) {
			var l = {
				name: data[i].name,
				text: data[i].text,
				url: data[i].url,
				tags: data[i].tags.split(',')
			};
			for (var j = 0; j < l.tags.length; ++j) {
				var found = false;
				for (var k = 0; k < $scope.tags.length; ++k) {
					if (l.tags[j] == $scope.tags[k]) { found = true; break;}
				}
				if (!found) { $scope.tags.push(l.tags[j]); }
			}
			$scope.links.push(l);
		}
	});

	$scope.filter = function(tag) {
console.log('filter');
		console.log(tag);
		$scope.tag_filter = tag;
	}

	$scope.closeAlert = function() {
		$scope.showAlert = 'none';
	}

	$scope.saveLink = function() {
		console.log('savelink');
		var links = []; //$scope.links;
		var link = {
			name: $scope.link_text,
			text: $scope.link_text,
			url: $scope.link_link,
			tags: $scope.link_tag
		}
		console.log(link);

		$http.post(server + 'api/soxs/insert/link', link).success(function(data) {
			links.push(link);

			$scope.showAlert = 'block';
			$scope.alertText = 'Link saved!!';
			$scope.alertCss = 'alert-success';


		}).error(function(data, status){
			console.log(data);
			console.log(status);
			$scope.showAlert = 'block';
			$scope.alertText = 'Link not saved: ' + data;
			$scope.alertCss = 'alert-danger';

		})

	};

};
]);