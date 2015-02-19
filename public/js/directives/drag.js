/* drag.js
 *
 * Author(s):  Andrew Brown
 * Date:       2/18/2015
 *
 */

angular.module('soxsnationApp')
.directive('ngDraggable', function($document) {
  return {
    restrict: 'A',
    scope: {
      dragOptions: '=ngDraggable'
    },
    link: function(scope, elem, attr) {
        $(elem).draggable(scope.dragOptions);
    }
  }
});

angular.module('soxsnationApp')
.directive('ngDroppable', function($document) {
  return {
    restrict: 'A',
    scope: {
      dropOptions: '=ngDroppable'
    },
    link: function(scope, elem, attr) {
        $(elem).droppable({
        	drop: function( event, ui ) {
        console.log('DROPPED: ' + JSON.stringify(scope.dropOptions));
        scope.dropOptions['test'] = 'test value';
        // alert('Dropped: ' + JSON.stringify(ui.position));
        },
        accept: ".special"
        // function(dragEl) {
        //             // console.log('accept: ' + JSON.stringify(dragEl['context']));

        //             for (var prop in dragEl) {
        //             	console.log('accept: ' + prop);
        //             	// console.log('accept: ' + JSON.stringify(dragEl[prop]));
        //             }

        //             return true;
        //             // if ($scope.list1.length >= 20) {
        //             //     return false;
        //             // } else {
        //             //     return true;
        //             // }
        //         }
    });
    }
  }
})