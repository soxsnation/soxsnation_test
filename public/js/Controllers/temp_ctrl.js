/* temp_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       2/18/2015
 *
 */

angular.module('soxsnationApp')
    .controller('TemplateController', ['$scope', '$location',
        function($scope, $location) {
            $scope.page = 'Templates';

            var template = [{"id":"Heading1","name":"Heading","markup":"<h2>a{{elements.Heading1.options[3].value}}</h2>","options":[{"name":"text","type":"text","$$hashKey":"019"},{"name":"enabled","type":"checkbox","$$hashKey":"01A"},{"name":"font","type":"text","$$hashKey":"01B"},{"name":"value","type":"text","$$hashKey":"01C","value":"Heading"}],"css_class":"snText_selected","css_box_class":"snText_showbox"},{"id":"Textbox2","name":"Textbox","markup":"<input type='text' class='form-control snItem' data-ng-value='elements.Textbox2.options[0].value'>","options":[{"name":"text","type":"text","value":"text"},{"name":"enabled","type":"checkbox","value":true}],"css_class":"snText_unselected","css_box_class":"snText_hidebox"},{"id":"Button3","name":"Button","markup":"<input type='button' enabled='false' class='btn btn-default container_item' value='{{elements.Button3.options[0].value}}'>","options":[{"name":"text","type":"text","value":"Click Me"},{"name":"enabled","type":"checkbox"},{"name":"action","type":"text"}],"css_class":"snText_unselected","css_box_class":"snText_hidebox"}];

            $scope.template_data = template;

            $scope.save_template = function(temp) {
                console.log('OUTSIDE: save_template');
            }

            $scope.save_layout = function() {
                console.log('save_layout');
            }
        }
    ]);

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
