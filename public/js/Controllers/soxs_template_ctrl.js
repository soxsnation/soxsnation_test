/* soxs_templete_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

angular.module('soxsnationApp')
    .controller('SoxsTemplateController', ['$scope', '$location', 'soxsAuth', 'soxsItemFactory',
        function($scope, $location, soxsAuth, soxsItemFactory) {

            soxsAuth.validateUser().then(function(user) {}, function(error) {
                $location.path('/Login');
            });

            $scope.show_template_creator = false;
            $scope.show_template_list = true;

            $scope.show_creator = function() {
                $scope.show_template_creator = true;
                $scope.show_template_list = false;
            }


            var template = [{
                "id": "Heading1",
                "name": "Heading",
                "markup": "<h2>a{{elements.Heading1.options[3].value}}</h2>",
                "options": [{
                    "name": "text",
                    "type": "text",
                    "$$hashKey": "019"
                }, {
                    "name": "enabled",
                    "type": "checkbox",
                    "$$hashKey": "01A"
                }, {
                    "name": "font",
                    "type": "text",
                    "$$hashKey": "01B"
                }, {
                    "name": "value",
                    "type": "text",
                    "$$hashKey": "01C",
                    "value": "Heading"
                }],
                "css_class": "snText_selected",
                "css_box_class": "snText_showbox"
            }, {
                "id": "Textbox2",
                "name": "Textbox",
                "markup": "<input type='text' class='form-control snItem' data-ng-value='elements.Textbox2.options[0].value'>",
                "options": [{
                    "name": "text",
                    "type": "text",
                    "value": "text"
                }, {
                    "name": "enabled",
                    "type": "checkbox",
                    "value": true
                }],
                "css_class": "snText_unselected",
                "css_box_class": "snText_hidebox"
            }, {
                "id": "Button3",
                "name": "Button",
                "markup": "<input type='button' enabled='false' class='btn btn-default container_item' value='{{elements.Button3.options[0].value}}'>",
                "options": [{
                    "name": "text",
                    "type": "text",
                    "value": "Click Me"
                }, {
                    "name": "enabled",
                    "type": "checkbox"
                }, {
                    "name": "action",
                    "type": "text"
                }],
                "css_class": "snText_unselected",
                "css_box_class": "snText_hidebox"
            }];

            // Loads a template into the templateCreator
            $scope.template_data = template;

            // Gets called from the templateCreator directive to save the tempate
            $scope.save_template = function(temp) {
                console.log('SoxsTemplateController: save_template');
                $scope.show_template_creator = false;
                $scope.show_template_list = true;
            }


        }
    ]);
