

angular.module('soxsnationApp')
.directive('soxsname', function () {
	return {
      templateUrl: '../partials/directives/name.html'
    };
  })
.directive('soxsdata', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: function(elem, attr) {
			return '../partials/directives/' + attr.type + '.html';
		},
		controller: function ($scope) {
			$scope.title = 'Recipe Title';
		}
	}
})
