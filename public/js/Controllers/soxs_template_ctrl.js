/* soxs_templete_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

angular.module('soxsnationApp')
    .controller('SoxsTemplateController', ['$scope', '$location', 'soxsAuth', 'soxsService',
        function($scope, $location, soxsAuth, soxsService) {

            soxsAuth.validateUser().then(function(user) {}, function(error) {
                $location.path('/Login');
            });

            $scope.templates = [];
            $scope.template_elements = [];
            $scope.show_template_creator = false;
            $scope.show_template_list = true;
            var server = '';

            $scope.show_creator = function() {
                $scope.show_template_creator = true;
                $scope.show_template_list = false;
            }


            function create_template(temp) {
                var t = {
                    name: 'first template',
                    markup: JSON.stringify(temp),
                    created_by: 'Andrew'
                }

                console.log('create_template');
                console.log(t);

                soxsService.insert_template(t)
                    .then(function(data) {
                        console.log(JSON.stringify(data));
                        console.log('Template Created');
                    }, function(err) {
                        console.log('Error Creating template: ' + err);
                    });
            };

            function initData() {
                console.log('getting soxs templates');

                soxsService.get_template_elements()
                    .then(function(data) {
                        console.log(JSON.stringify(data));
                        $scope.template_elements = data;
                    });
            }
            initData();




            // Gets called from the templateCreator directive to save the tempate
            $scope.save_template = function(temp) {
                console.log('SoxsTemplateController: save_template');
                $scope.show_template_creator = false;
                $scope.show_template_list = true;
                create_template(temp);
            }

            $scope.cancel_edit = function() {
                $scope.show_template_creator = false;
                $scope.show_template_list = true;
            }


        }
    ]);
