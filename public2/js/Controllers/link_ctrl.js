/* link_controller.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

/* Controllers */

angular.module('soxsnationApp')
	.controller('LinkController', ['$scope', '$http', '$location', 'soxsAuth',
function LinkController($scope, $http, $location) {
	$scope.mode = 'none';
	$scope.modalHidden = 'true';

	$scope.page = 'Link Page';
	$scope.links = [];
	$scope.showAlert = 'none';
	$scope.alertText = 'Alert';
	$scope.alertCss = 'alert-danger';
	$scope.modal_error = '';
	var server = 'http://localhost:3085/';
	server = '';

	function showModal(mode, link) {
		$scope.mode = mode;
		if ($scope.mode === 'edit') {
			$scope.modalTitle = 'Edit link';
			$scope.modalSubmitText = 'Update Link data';

			$scope.link_text = link.text;
			$scope.link_url = link.url;
			$scope.link_tags = link.tags;
			$scope.link_id = link._id;
		} else if ($scope.mode === 'insert') {
			$scope.modalTitle = 'Insert link';
			$scope.modalSubmitText = 'Create New Link';
		}

		$('#myModal').modal('show');
	};

	function saveLinkData() {
		var url = server + 'api/soxs/';
		if ($scope.mode === 'edit') {
			url += 'update/link/' + $scope.link_id;
		} else if ($scope.mode === 'insert') {
			url += 'insert/link'
		}

		var link = {
			name: $scope.link_text,
			text: $scope.link_text,
			url: $scope.link_url,
			tags: $scope.link_tags
		}

		$http.post(url, link).success(function(data) {
			// links.push(link);

			$scope.showAlert = 'block';
			$scope.alertText = 'Link saved!!';
			$scope.alertCss = 'alert-success';
			$('#myModal').modal('hide');

		}).error(function(data, status){
			console.log(data);
			console.log(status);
			// $scope.showAlert = 'block';
			// $scope.alertText = 'Link not saved: ' + data.substring(0, 50);
			// $scope.alertCss = 'alert-danger';
			$scope.modal_error = 'Link not saved: ' + data.substring(0, 50);
		})
	}


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
				tags: data[i].tags.split(','),
				_id: data[i]._id
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

	$scope.addTagToLink = function() {
		$scope.link_tags.push($scope.newTag);
		console.log($scope.link_tags);
	}

	$scope.filter = function(tag) {
		console.log('filter');
		console.log(tag);
		$scope.tag_filter = tag;
	}

	$scope.closeAlert = function() {
		$scope.showAlert = 'none';
	}

	$scope.insert_link_mode = function() {
		showModal('insert');
	}

	$scope.editLink = function(link) {
		console.log(link);
		showModal('edit', link);
	}

	// $scope.updateLink = function() {
	// 	console.log($scope.link_id_edit)
	// 	var link = {
	// 		name: $scope.link_text,
	// 		text: $scope.link_text,
	// 		url: $scope.link_url,
	// 		tags: $scope.link_tag
	// 	}

	// 	$http.post('http://localhost:3085/api/soxs/update/link/' + $scope.link_id_edit, link).success(function(data) {
	// 		// links.push(link);

	// 		$scope.showAlert = 'block';
	// 		$scope.alertText = 'Link updated!!';
	// 		$scope.alertCss = 'alert-success';


	// 	}).error(function(data, status){
	// 		console.log(data);
	// 		console.log(status);
	// 		$scope.showAlert = 'block'; 
	// 		$scope.alertText = 'Link not updated: ' + data;
	// 		$scope.alertCss = 'alert-danger';

	// 	})
	// }

	$scope.saveLink = function() {
		console.log('savelink');
		saveLinkData();
		// var links = []; //$scope.links;
		// var link = {
		// 	name: $scope.link_text,
		// 	text: $scope.link_text,
		// 	url: $scope.link_url,
		// 	tags: $scope.link_tags
		// }
		// console.log(link);

		// var url = 'http://localhost:3085/api/soxs/';
		// if ($scope.mode === 'edit') {
		// 	url += 'update/link/' + $scope.link_id;
		// } else if ($scope.mode === 'insert') {
		// 	url += 'insert/link'
		// }

		// $http.post(url, link).success(function(data) {
		// 	links.push(link);

		// 	$scope.showAlert = 'block';
		// 	$scope.alertText = 'Link saved!!';
		// 	$scope.alertCss = 'alert-success';


		// }).error(function(data, status){
		// 	console.log(data);
		// 	console.log(status);
		// 	$scope.showAlert = 'block';
		// 	$scope.alertText = 'Link not saved: ' + data;
		// 	$scope.alertCss = 'alert-danger';

		// })

		
	};

}
]);