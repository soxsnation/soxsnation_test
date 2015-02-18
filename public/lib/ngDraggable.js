/*
 *
 * https://github.com/fatlinesofcode/ngDraggable
 */
angular.directive('ngDraggable', function($document) {
  return {
    restrict: 'A',
    scope: {
      dragOptions: '=ngDraggable'
    },
    link: function(scope, elem, attr) {
        $(elem).draggable(scope.dragOptions);
    }
  }
})