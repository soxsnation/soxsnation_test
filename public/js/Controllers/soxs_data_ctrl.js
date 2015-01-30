/* soxs_data_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */


angular.module('soxsnationApp')
	.controller('SoxsDataController', ['$scope', '$location', 'soxsAuth', 'soxsItemFactory',
		function($scope, $location, soxsAuth, soxsItemFactory) {

			soxsAuth.validateUser().then(function(user) {}, function(error) {
				$location.path('/Login');
			});

			$scope.page = 'Soxs Data';
			$scope.mode = 'none';
			var server = 'http://localhost:3085/';
			server = '';

			$scope.modalTitle = 'Add Data Type';
			$scope.modalSubmitText = 'Add Data Type';

			$scope.newObj_name = 'name';
			$scope.newObj_description = 'description';

			$scope.newObjFields = [{
				name: 'name',
				type: 'String'
			}, {
				name: 'complete',
				type: 'Boolean'
			}, {
				name: 'description',
				type: 'String'
			}];


			$scope.fieldTypes = [{
				name: 'String',
				value: 'String'
			}];
			$scope.fieldTypes.push({
				name: 'Boolean',
				value: 'Boolean'
			});
			$scope.fieldTypes.push({
				name: 'Number',
				value: 'Number'
			});
			$scope.fieldTypes.push({
				name: 'Date',
				value: 'Date'
			});
			$scope.fieldTypes.push({
				name: 'Array',
				value: 'Array'
			});
			$scope.fieldTypes.push({
				name: 'list item',
				value: [{
					"name": "String"
				}]
			});
			$scope.fieldTypes.push({
				name: 'tags',
				value: ["String"]
			});
			$scope.fieldTypes.push({
				name: 'steps',
				value: [{
					"description": "String",
					"number": "String"
				}]
			});
			$scope.fieldTypes.push({
				name: 'ingredients',
				value: [{
					"name": "String",
					"quantity": "String"
				}]
			});

			function copyObj(obj) {
				var copy = {};
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
				}
				return copy;
			}



			$scope.newFieldName = '';
			$scope.newFieldType = '';
			$scope.model_id = '';
			$scope.currentDataModel = {};

			function stringifyFields(fields) {
				console.log('stringifyFields');
				// console.log(fields);
				var fieldList = {};
				for (var i = 0; i < fields.length; ++i) {
					fieldList[fields[i].name] = fields[i].type;
				}
				return JSON.stringify(fieldList);
			}

			function parseDataType(data) {
				var dataType = {
					name: data.name,
					description: data.description,
					_id: data._id,
					permissionIndex: data.permissionIndex,
					fields: data.fields,
					fieldItems: []
				};

				var fieldList = JSON.parse(data.fields);
				for (var prop in fieldList) {
					var field = {
						name: prop,
						type: fieldList[prop]
					}
					dataType.fieldItems.push(field);
				}

				return dataType;
			}



			function addDataType() {

				var url = server + 'api/soxsSchema/create';

				var objFields = $scope.currentDataModel.fieldItems;
				objFields.push({
					name: 'active',
					type: 'Boolean'
				});
				objFields.push({
					name: 'archived',
					type: 'Boolean'
				});
				objFields.push({
					name: 'creationDate',
					type: 'Date'
				});
				objFields.push({
					name: 'modifiedDate',
					type: 'Date'
				});
				objFields.push({
					name: 'userModified',
					type: 'String'
				});
				objFields.push({
					name: 'access',
					type: 'String'
				});

				// console.log($scope.currentDataModel);
				$scope.currentDataModel.fields = stringifyFields(objFields);
				var dm = $scope.currentDataModel;
				dm.fieldItems = JSON.stringify(dm.fieldItems);
				// console.log($scope.currentDataModel.fields);

				soxsAuth.http_post(url, dm)
					.then(function(data) {
						$('#myModal').modal('hide');
						$scope.data_models.push(parseDataType(data));
					}, function(err) {
						console.log('ERROR: ' + err);
					})
			};

			function updateDataType() {
				var url = server + 'api/soxsSchema/update/' + $scope.currentDataModel._id;

				console.log('updateDataType');
				// console.log($scope.currentDataModel);
				var dm = copyObj($scope.currentDataModel);
				dm.fields = stringifyFields(dm.fieldItems);
				dm.fieldItems = JSON.stringify(dm.fieldItems);
				// $scope.currentDataModel.fields = stringifyFields($scope.currentDataModel.fieldItems);
				// console.log($scope.currentDataModel);

				for (var i = 0; i < $scope.data_models.length; ++i) {
					if ($scope.data_models[i]._id == $scope.currentDataModel._id) {
						$scope.data_models[i] = parseDataType($scope.currentDataModel);
						break;
					}
				}
				// $scope.currentDataModel = parseDataType(saveModel);
				// console.log($scope.currentDataModel);

				

				soxsAuth.http_post(url, dm)
					.then(function(data) {
						$('#myModal').modal('hide');
						// $scope.currentDataModel = {};
					}, function(err) {
						console.log('ERROR: ' + err);
					})

			}

			function formatField(field) {
				for (var prop in field) {
					var field = {
						name: prop,
						type: field[prop]
					}
					return field;
				}
			}

			function showModal(mode, model) {
				console.log('fields');
				// console.log(model);
				// $scope.model_id = model._id;
				$scope.mode = mode;
				if ($scope.mode === 'edit') {
					$scope.modalTitle = 'Edit Data Model';
					$scope.modalSubmitText = 'Update Data Model';
				} else if ($scope.mode === 'insert') {
					$scope.modalTitle = 'Insert Data Model';
					$scope.modalSubmitText = 'Create New Data Model';
					$scope.currentDataModel.fieldItems = [];
				}

				$('#myModal').modal('show');
			};

			$scope.saveDataType = function() {
				console.log('$scope.saveDataType ' + $scope.mode)
				if ($scope.mode === 'insert') {
					addDataType();
				} else if ($scope.mode === 'edit') {
					updateDataType();
				}
			}


			$scope.addFieldToObj = function() {
				// console.log($scope.newFieldName);
				// console.log($scope.newFieldType);
				var nf = {
					name: $scope.newFieldName,
					type_id: $scope.newFieldType._id,
					type: $scope.newFieldType.value
				}

				$scope.currentDataModel.fieldItems.push(nf);
				// console.log($scope.currentDataModel);
			}

			// $scope.addFieldTextToObj = function() {
			// 	console.log($scope.newFieldText);
			// 	var fields = JSON.parse($scope.newFieldText);
			// 	for (var prop in fields) {
			// 		var field = {
			// 			name: prop,
			// 			type: fields[prop]
			// 		}
			// 		$scope.newObjFields.push(field);
			// 	}
			// }


			$scope.edit_data_model = function(model) {
				$scope.currentDataModel = model;
				showModal('edit', model);
			}

			$scope.data_model_changed = function(model) {
				console.log('model changed');
				console.log(model);
				$scope.currentDataModel = model;
				$scope.modalSubmitText = 'Update Data Model';
				$scope.mode = 'edit';
			}

			$scope.insert_data_model = function() {
				console.log('insert_data_model');
				$scope.currentDataModel = {};
				$scope.modalSubmitText = 'Create New Data Model';
				$scope.currentDataModel.fieldItems = [];
				$scope.mode = 'insert';
				// showModal('insert');
			}

			$scope.load_data = function() {
				console.log('load_data');
				initData();
			}


			function initData() {
				console.log('initData');
				soxsAuth.http_get('api/soxs/types')
					.then(function(data) {
						// console.log(data);
						$scope.data_models = [];

						for (var i = 0; i < data.length; ++i) {
							// var model = {
							// 	name: data[i].name,
							// 	description: data[i].description,
							// 	fields: [],
							// 	_id: data[i]._id,
							// 	permissionIndex: data[i].permissionIndex
							// }

							// var fields = JSON.parse(data[i].fields);
							// for (var prop in fields) {
							// 	var field = {
							// 		name: prop,
							// 		type: fields[prop]
							// 	}
							// 	model.fields.push(field);
							// }

							// $scope.data_models.push(model);
							$scope.data_models.push(parseDataType(data[i]));
						}
					})

				soxsItemFactory.get_soxs_types().then(function(soxs_types) {
					$scope.data_types = soxs_types;
					console.log('$scope.data_types');
					console.log($scope.data_types);
				})


				// soxsAuth.http_get('api/soxsType/_all')
				// 	.then(function(data) {
				// 		$scope.data_types = [];
				// 		for (var i = 0; i < data.length; ++i) {
				// 			$scope.data_types.push(data[i]);
				// 		}
				// 		console.log($scope.data_types);

				// 	})
			}
			initData();

			// function user_login() {
			// 	soxsAuth.login('andrew', '123')
			// 		.then(function(result) {
			// 			$scope.userInfo = result;

			// 			// $location.path("/");
			// 		}, function(error) {
			// 			$window.alert("Invalid credentials");
			// 			console.log(error);
			// 		});
			// };

			// user_login();



		}
	]);