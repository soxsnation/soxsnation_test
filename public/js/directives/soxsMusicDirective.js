/* soxsMusicDirective.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
 *
 */

angular.module('Audio5').directive('audio', function(AudioService){
  return {
    restrict: 'EA',
    scope: {
      'src': '=source'
    },
    template: '' +
      '<div ng-transclude>' +
        '<button ng-click="player.playPause()">play/pause</button>' +
        '<div>position: {{position}}</div>' +
        '<div>duration: {{duration}}</div>'+
      '</div>',
    replace: true,
    transclude: true,
    controller: function($scope, $element, $attrs, $transclude) {
      $scope.player2 = AudioService.audio5js;

      $scope.player2.on('timeupdate',function(time, duration){
        $scope.$apply(function(){
          $scope.position = time;
          $scope.duration = duration;
        });
      });

      $scope.$watch('src', function(new_value, old_value){
        $scope.player2.load(new_value);
      });
    }
  }
});