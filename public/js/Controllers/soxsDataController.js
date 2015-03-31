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
                soxsFactory.postData(schemaName, schemaData)
                    .then(function(data) {

                    }, function(err) {
                        console.log('ERROR: SoxsDataController post_soxs_type: ' + err);
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
                $scope.current_model = sn_model;

            }




        }
    ]);
