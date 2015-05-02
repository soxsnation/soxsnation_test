 /* snDataController.js
  *
  * Author(s):  Andrew Brown
  * Date:       3/31/2015
  *
  */


 angular.module('soxsnationApp')
     .controller('SnDataController', ['$scope', '$compile', 'soxsFactory', 'snFactory', 'snBuilder',
         function($scope, $compile, soxsFactory, snFactory, snBuilder) {


             /***********************************************************************************************************************
              * Init scope values
              ***********************************************************************************************************************/

             $scope.snData = {};
             $scope.current_data = {};
             $scope.current_model = {};
             $scope.current_mode = 'none';
             $scope.active_data = {};
             $scope.current_model_group = {};
             $scope.current_model_formatted = {};
             $scope.current_model_formatted_fields = [];
             $scope.snModelGroups = [];
             $scope.snTypes = [];
             $scope.nav = {
                 groups_open: true,
                 items_open: false,
                 items_view_open: false
             }
             $scope.css = {
                 nav_home: "active",
                 nav_group: "",
                 nav_item: ""
             }


             /***********************************************************************************************************************
              * Common Functions
              ***********************************************************************************************************************/
             function set_Model_Groups() {
                 $scope.snModelGroups.push('rs');
                 $scope.snModelGroups.push('sn');
                 $scope.snModelGroups.push('snt');
                 $scope.snModelGroups.push('test');
                 $scope.current_model_group = 'sn';
             }

             function set_snTypes() {
                 $scope.snTypes.push("String");
                 $scope.snTypes.push("Number");
                 $scope.snTypes.push("ObjectId");
                 $scope.snTypes.push("Date");
                 $scope.snTypes.push("Boolean");
             }

             function get_element_types() {
                 snFactory.getData('snElementType')
                     .then(function(data) {
                         $scope.snElements = data;
                         console.log('Got snElementType');
                         console.log($scope.snElements);
                     }, function(err) {
                         console.log('ERROR: ' + err);
                         deferred.reject(err);
                     })
             }

             function get_soxs_type(schemaName) {
                 soxsFactory.getData(schemaName)
                     .then(function(data) {
                         console.log('got soxs types: ' + data.length)
                         $scope.snModels = data;
                     }, function(err) {
                         console.log('ERROR: SoxsDataController get_soxs_type: ' + err);
                     });
             }

             function init() {
                 console.log('SoxsDataController::init');
                 get_soxs_type('soxsSchema');
                 set_Model_Groups();
                 set_snTypes();
                 get_element_types();

             }
             init();

             function build_add_data() {
                 var markup = '<div id="myBuildElement">';
                 markup += snBuilder.build_add_data($scope.current_model_add, 'active_data', 'add_data');
                 markup += '</div>';

                 var ele = angular.element($('#myBuildElement'));
                 ele.html(markup);
                 $compile(ele.contents())($scope);
             }

             function build_update_data() {
                 var markup = '<div id="myBuildElement">';
                 markup += snBuilder.build_update_data($scope.current_model_add, 'active_data', 'update_data');
                 markup += '</div>';

                 var ele = angular.element($('#myBuildElement'));
                 ele.html(markup);
                 $compile(ele.contents())($scope);
             }

             function format_current_model() {
                 var cmf = {};
                 cmf._id = $scope.current_model._id;
                 cmf.__v = $scope.current_model.__v;
                 cmf.active = $scope.current_model.active;
                 cmf.mongo_name = $scope.current_model.mongo_name;
                 cmf.name = $scope.current_model.name;
                 $scope.current_model_formatted = JSON.stringify(cmf);

                 $scope.current_model_formatted_fields = [];
                 for (var i = 0; i < $scope.current_model.fields.length; ++i) {
                     var f = {
                         name: $scope.current_model.fields[i].name,
                         type: $scope.current_model.fields[i].type,
                         ref: $scope.current_model.fields[i].ref,
                         isArray: $scope.current_model.fields[i].isArray,
                     }
                     $scope.current_model_formatted_fields.push(JSON.stringify(f));
                 }

                 $scope.current_model_add = {
                     name: $scope.current_model.name,
                     fields: []
                 };

                 for (var i = 0; i < $scope.current_model.fields.length; ++i) {
                     if ($scope.current_model.fields[i].type == 'ObjectId') {
                         for (var j = 0; j < $scope.snModels.length; ++j) {
                             if ($scope.snModels[j].mongo_name == $scope.current_model.fields[i].ref) {
                                 $scope.current_model.fields[i].child = $scope.snModels[j];
                                 $scope.current_model_add.fields.push($scope.current_model.fields[i]);
                             }
                         }

                     } else {
                         $scope.current_model_add.fields.push($scope.current_model.fields[i]);
                     }
                 }
             }


             /***********************************************************************************************************************
              * $scope Functions
              ***********************************************************************************************************************/

             $scope.sn_model_changed = function(sn_model) {
                 console.log('sn_model_changed: ');
                 console.log(sn_model);
                 $scope.current_mode = 'view_data';
                 $scope.current_model = sn_model;
                 $scope.nav.items_view_open = true;

                 snFactory.getData(sn_model.name)
                     .then(function(data) {
                         console.log('sn_model_changed:: GOT DATA')
                         $scope.snData = data;
                     }, function(err) {
                         console.log('Could not load data for: ' + sn_model.name);
                     });
                 format_current_model();
                 build_update_data();
                 // build_add_data();
             }

             $scope.sn_data_changed = function(sn_data) {
                 console.log('sn_data_changed: ' + sn_data._id);
                 $scope.current_data = sn_data;
                 $scope.active_data = sn_data;
             }

             $scope.sn_model_group_changed = function(model_group) {
                 $scope.current_model_group = model_group;
                 $scope.nav.items_open = true;
             }

             $scope.add_data = function() {
                 console.log('$scope.add_data');
                 console.log($scope.active_data);

                 snFactory.postData($scope.current_model.name, $scope.active_data)
                     .then(function(data) {
                         console.log('Posted active data: ' + $scope.current_model.name);
                     }, function(err) {
                         console.log('ERROR: ' + err);
                         deferred.reject(err);
                     })
             }

             $scope.update_data = function() {
                 console.log('$scope.update_data');
                 console.log($scope.active_data);

                 snFactory.putData($scope.current_model.name, $scope.active_data)
                     .then(function(data) {
                         console.log('Posted active data: ' + $scope.current_model.name);
                     }, function(err) {
                         console.log('ERROR: ' + err);
                         deferred.reject(err);
                     })

             }



         }
     ]);
