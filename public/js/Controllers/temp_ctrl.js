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
                containment: $("#container")

            };

            $scope.dropObject = {
                title: 'do1'
                
            };

            $scope.dropObject2 = {
                title: 'do2'
                
            };

            $scope.list1 = [];
            $scope.list5 = [{
                'title': 'Item 1',
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
                revert: 'invalid',
                helper: 'clone'
            }

            $scope.drag = {
                placeholder: true,
                animate: true,
                deepCopy: true,
                placeholder: 'keep'
            }


            $scope.optionsList1 = {
                accept: function(dragEl) {
                    console.log('$scope.optionsList1 ');
                    if ($scope.list1.length >= 20) {
                        return false;
                    } else {
                        return true;
                    }
                },
                helper: 'clone'
            }

            $scope.btn_clicked = function() {
                console.log(JSON.stringify($scope.item1));
                console.log($scope.list1);
            }

        }
    ]);
