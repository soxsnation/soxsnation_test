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
             $scope.current_model_group = {};
             $scope.current_model_formatted = {};
             $scope.current_model_formatted_fields = [];
             $scope.current_mode = 'none';
             $scope.snModelGroups = [];
             $scope.snModels = [];
             $scope.snTypes = [];
             $scope.new_field_name = "";
             $scope.new_field_type = "";
             $scope.new_field_ref = {
                 name: ""
             };
             $scope.show_layout = false;
             $scope.show_data = true;
             $scope.show_json = false;
             $scope.show_add_data = false;
             $scope.css_data = "active";
             $scope.css_layout = "";
             $scope.css_json = "";
             $scope.css_add_data = "";
             $scope.show_template_builder = false;
             $scope.show_data_builder = true;
             $scope.data_groups_isCollapsed = false;
             $scope.data_items_isCollapsed = true;

             $scope.tabs = [{
                 title: 'Data Layout',
                 content: 'Dynamic content 1'
             }, {
                 title: 'Design',
                 content: 'Dynamic content 2'
             }];


             $scope.templates = [];
             $scope.template_elements = [];


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
                        console.log('got soxs types: ' + data.length)
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

             function set_Model_Groups() {
                $scope.snModelGroups.push('rs');
                $scope.snModelGroups.push('sn');
                $scope.snModelGroups.push('snt');
                $scope.snModelGroups.push('test');
                $scope.current_model_group = 'sn';
             }

             function set_snTypes() {
                 // $scope.snTypes.push({ text: "String", value: "String"});
                 // $scope.snTypes.push({ text: "Number", value: "Number"});
                 // $scope.snTypes.push({ text: "ObjectId", value: "ObjectId"});

                 $scope.snTypes.push("String");
                 $scope.snTypes.push("Number");
                 $scope.snTypes.push("ObjectId");
                 $scope.snTypes.push("Date");
                 $scope.snTypes.push("Boolean");
             }

             function init() {
                 console.log('SoxsDataController::init');
                 get_soxs_type('soxsSchema');
                 set_Model_Groups();
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


                 var cmf = {};
                 cmf._id = sn_model._id;
                 cmf.__v = sn_model.__v;
                 cmf.active = sn_model.active;
                 cmf.mongo_name = sn_model.mongo_name;
                 cmf.name = sn_model.name;
                 $scope.current_model_formatted = JSON.stringify(cmf);

                 $scope.current_model_formatted_fields = [];
                 for (var i = 0; i < sn_model.fields.length; ++i) {
                     var f = {
                         name: sn_model.fields[i].name,
                         type: sn_model.fields[i].type,
                         ref: sn_model.fields[i].ref,
                         isArray: sn_model.fields[i].isArray,
                     }
                     $scope.current_model_formatted_fields.push(JSON.stringify(f));
                 }
             }

             $scope.sn_model_group_changed = function(model_group) {
                $scope.current_model_group = model_group;
                $scope.data_groups_isCollapsed = true;
                $scope.data_items_isCollapsed = false;
             }

             $scope.add_field = function() {
                 console.log('add_field: ' + $scope.new_field_name);
                 console.log($scope.new_field_name);
                 console.log($scope.new_field_type);
                 console.log($scope.new_field_ref);
                 var f = {
                     name: $scope.new_field_name,
                     type: $scope.new_field_type,
                     ref: $scope.new_field_ref,
                     isArray: $scope.new_field_isArray
                 };
                 if ($scope.new_field_type == 'ObjectId' && $scope.new_field_ref != undefined) {
                     f.ref = $scope.new_field_ref.mongo_name;
                 } else {
                     f.ref = "";
                 }
                 console.log(f);
                 $scope.current_model.fields.push(f);
                 $scope.new_field_name = "";
                 $scope.new_field_type = "";
                 $scope.new_field_ref = "";
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
                     prefix: 'sn',
                     active: true
                 }
             }

             $scope.delete_model = function() {
                 put_delete_type('soxsSchema', $scope.current_model._id);
             }

             $scope.display_data = function() {
                 $scope.show_layout = false;
                 $scope.show_json = false;
                 $scope.show_add_data = false;
                 $scope.show_data = true;
                 $scope.css_json = "";
                 $scope.css_data = "active";
                 $scope.css_layout = "";
                 $scope.css_add_data = "";
             }

             $scope.display_layout = function() {
                 $scope.show_layout = true;
                 $scope.show_json = false;
                 $scope.show_add_data = false;
                 $scope.show_data = false;
                 $scope.css_data = "";
                 $scope.css_json = "";
                 $scope.css_add_data = "";
                 $scope.css_layout = "active";
             }

             $scope.display_json = function() {
                 $scope.show_layout = false;
                 $scope.show_data = false;
                 $scope.show_add_data = false;
                 $scope.show_json = true;
                 $scope.css_data = "";
                 $scope.css_layout = "";
                 $scope.css_json = "active";
                 $scope.css_add_data = "";
             }

             $scope.display_add_data = function() {
                 $scope.show_layout = false;
                 $scope.show_data = false;
                 $scope.show_add_data = true;
                 $scope.show_json = false;
                 $scope.css_data = "";
                 $scope.css_layout = "";
                 $scope.css_json = "";
                 $scope.css_add_data = "active";
             }

             $scope.display_data_groups = function() {
                console.log('display_data_groups')
                 $scope.data_groups_isCollapsed = !$scope.data_groups_isCollapsed;
                 // $scope.data_items_isCollapsed = !$scope.data_items_isCollapsed;
             }

             $scope.display_data_items = function() {
                console.log('display_data_items:' + $scope.data_models.length)
                 // $scope.data_groups_isCollapsed = !$scope.data_groups_isCollapsed;
                 $scope.data_items_isCollapsed = !$scope.data_items_isCollapsed;
             }

             /***********************************************************************************************************************
              * Template Builder
              ***********************************************************************************************************************/


             $scope.load_layout_builder = function() {
                 console.log('$scope.load_layout_builder');
                 soxsService.get_template_elements()
                     .then(function(data) {
                         console.log(JSON.stringify(data));
                         $scope.template_elements = data;
                     });
                 $scope.show_template_builder = true;
                 $scope.show_data_builder = false;
             }

             $scope.save_template = function(temp) {
                 console.log('SoxsTemplateController: save_template');
                 console.log(JSON.stringify(temp));
                 $scope.show_template_builder = false;
                 $scope.show_data_builder = true;
                 // create_template(temp);
             }

             $scope.cancel_edit = function() {
                 $scope.show_template_builder = false;
                 $scope.show_data_builder = true;
             }




         }
     ]);
