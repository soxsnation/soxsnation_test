/* soxsDataController.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/31/2015
 *
 */


angular.module('soxsnationApp')
    .controller('SoxsDataController', ['$scope', '$location', 'soxsAuth', 'soxsFactory',
        function($scope, $location, soxsAuth, soxsFactory) {

            /***********************************************************************************************************************
             * Init scope values
             ***********************************************************************************************************************/

            $scope.current_model = {};
            $scope.current_mode = 'none';


            /***********************************************************************************************************************
             * Common Functions
             ***********************************************************************************************************************/


            function get_all_soxs_types() {

            }

            function get_soxs_type(schemaName) {
                soxsFactory.getData(schemaName)
                    .then(function(data) {
                        $scope.soxsData = data;
                    }, function(err) {
                        console.log('ERROR: SoxsDataController get_soxs_type: ' + err);
                    });
            }

            function post_soxs_type(schemaName, schemaData) {
                console.log('post_soxs_type');
                console.log(schemaData);
                soxsFactory.postData(schemaName, schemaData)
                    .then(function(data) {
                        console.log('post_soxs_type: success:' + data);
                        $scope.soxsData.push(schemaData);
                    }, function(err) {
                        console.log('ERROR: SoxsDataController post_soxs_type: ' + err);
                    });
            }

            function put_soxs_type(schemaName, schemaData) {
                soxsFactory.putData(schemaName, schemaData)
                    .then(function(data) {
                        console.log('put_soxs_type: success:' + data)
                    }, function(err) {
                        console.log('ERROR: SoxsDataController put_soxs_type: ' + err);
                    });
            }

            function put_delete_type(schemaName, schemaId) {
                soxsFactory.deleteData(schemaName, schemaId)
                    .then(function(data) {
                        console.log('put_soxs_type: success:' + data)
                    }, function(err) {
                        console.log('ERROR: SoxsDataController put_soxs_type: ' + err);
                    });
            }

            function init() {
                console.log('SoxsDataController::init');
                get_soxs_type('soxsSchema');

            }
            init();


            /***********************************************************************************************************************
             * $scope Functions
             ***********************************************************************************************************************/


            $scope.sn_model_changed = function(sn_model) {
                console.log('sn_model_changed: ');
                console.log(sn_model);
                $scope.current_mode = 'update';
                $scope.current_model = sn_model;

            }

            $scope.add_field = function() {
                $scope.current_model.fields.push({
                    name: $scope.new_field_name,
                    type: $scope.new_field_type,
                    ref: $scope.new_field_ref
                });
                $scope.new_field_name = "";
                $scope.new_field_type = "";
                $scope.new_field_ref = "";
            }

            $scope.save_model = function() {
                if ($scope.current_mode == 'update') {
                    put_soxs_type('soxsSchema', $scope.current_model);
                } else if ($scope.current_mode == 'add') {
                    post_soxs_type('soxsSchema', $scope.current_model);
                }
            }

            $scope.add_data_model = function() {
                $scope.current_mode = 'add';
                $scope.current_model = {
                    name: '',
                    mongo_name: '',
                    fields: [],
                    active: true
                }
            }

            $scope.delete_model = function() {
                put_delete_type('soxsSchema', $scope.current_model._id);
            }




        }
    ]);
