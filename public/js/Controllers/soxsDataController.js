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
            $scope.snModels = [];
            $scope.snTypes = [];
            $scope.new_field_name = "";
            $scope.new_field_type = "";
            $scope.new_field_ref = {
            	name: ""
            };

            $scope.tabs = [{
                title: 'Data Layout',
                content: 'Dynamic content 1'
            }, {
                title: 'Design',
                content: 'Dynamic content 2'
            }];


            /***********************************************************************************************************************
             * Common Functions
             ***********************************************************************************************************************/

            var substringMatcher = function(strs) {
                return function findMatches(q, cb) {
                    var matches, substrRegex;

                    // an array that will be populated with substring matches
                    matches = [];

                    // regex used to determine if a string contains the substring `q`
                    substrRegex = new RegExp(q, 'i');

                    // iterate through the pool of strings and for any string that
                    // contains the substring `q`, add it to the `matches` array
                    $.each(strs, function(i, str) {
                        if (substrRegex.test(str)) {
                            // the typeahead jQuery plugin expects suggestions to a
                            // JavaScript object, refer to typeahead docs for more info
                            matches.push({
                                value: str
                            });
                        }
                    });

                    cb(matches);
                };
            };

            function copy_sn_field(sn_field) {
                var f = {
                    __v: sn_field.__v,
                    _id: sn_field._id,
                    default_value: sn_field.default_value,
                    isArray: sn_field.isArray,
                    name: sn_field.name,
                    ref: sn_field.ref,
                    type: sn_field.type
                }
                return f;
            }


            function get_all_soxs_types() {

            }

            function get_soxs_type(schemaName) {
                soxsFactory.getData(schemaName)
                    .then(function(data) {
                        $scope.snModels = data;
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
                        $scope.snModels.push(schemaData);
                    }, function(err) {
                        console.log('ERROR: SoxsDataController post_soxs_type: ' + err);
                    });
            }

            function format_schema_data(schemaData) {
                console.log('format_schema_data');
                console.log(schemaData);
                var s = {
                    name: schemaData.name,
                    mongo_name: schemaData.mongo_name,
                    fields: [],
                    active: schemaData.active,
                    _v: schemaData._v,
                    _id: schemaData._id
                };
                for (var i = 0; i < schemaData.fields.length; ++i) {

                    if (typeof schemaData.fields[i].ref == 'object' && schemaData.fields[i].ref.hasOwnProperty('mongo_name')) {
                        console.log('format_schema_data::obj: ' + schemaData.fields[i].name);
                        var f = copy_sn_field(schemaData.fields[i]);
                        f.ref = schemaData.fields[i].ref.mongo_name;
                        s.fields.push(f)
                    } else {
                        s.fields.push(schemaData.fields[i]);
                    }
                }
                return s;
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

            function set_snTypes() {
                // $scope.snTypes.push({ text: "String", value: "String"});
                // $scope.snTypes.push({ text: "Number", value: "Number"});
                // $scope.snTypes.push({ text: "ObjectId", value: "ObjectId"});

                $scope.snTypes.push("String");
                $scope.snTypes.push("Number");
                $scope.snTypes.push("ObjectId");
            }

            function init() {
                console.log('SoxsDataController::init');
                get_soxs_type('soxsSchema');
                set_snTypes();

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
            	console.log('add_field: ' + $scope.new_field_ref)
                $scope.current_model.fields.push({
                    name: $scope.new_field_name,
                    type: $scope.new_field_type,
                    ref: $scope.new_field_ref,
                    isArray: $scope.new_field_isArray
                });
                $scope.new_field_name = "";
                $scope.new_field_type = "";
                $scope.new_field_ref = {};
            }

            $scope.save_model = function() {

                if ($scope.current_mode == 'update') {
                    put_soxs_type('soxsSchema', format_schema_data($scope.current_model));
                } else if ($scope.current_mode == 'add') {
                    post_soxs_type('soxsSchema', format_schema_data($scope.current_model));
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
