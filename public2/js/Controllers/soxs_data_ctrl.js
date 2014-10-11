/* soxs_data_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

/* Controllers */


function SoxsDataController($scope, $http) {
	$scope.page = 'Soxs Data';
	$scope.mode = 'none';
	var server = 'http://localhost:3085/';

	$scope.modalTitle = 'Add Data Type';
	$scope.modalSubmitText = 'Add Data Type';

	$scope.newObj_name = 'name';
	$scope.newObj_description = 'description';

	$scope.newObjFields = [
			{ name: 'name', type:'String'},
			{ name:'complete', type: 'Boolean'},
			{ name: 'description', type: 'String'}
		];


	$scope.fieldTypes = [{name:'String', value:'String'}];
	$scope.fieldTypes.push({name:'Boolean', value:'Boolean'});
	$scope.fieldTypes.push({name:'Number', value:'Number'});
	$scope.fieldTypes.push({name:'Date', value:'Date'});
	$scope.fieldTypes.push({name:'Array', value:'Array'});
	$scope.fieldTypes.push({name: 'list item', value:[{"name":"String"}]});
	$scope.fieldTypes.push({name: 'tags', value:["String"]});
	$scope.fieldTypes.push({name: 'steps', value: [{"description":"String", "number":"String"}]});
	$scope.fieldTypes.push({name: 'ingredients', value:[{"name":"String", "quantity":"String"}]});



	$scope.newFieldName = '';
	$scope.newFieldType = '';
	$scope.model_id = '';

	function addDataType() {

		var url = server + 'api/soxs/create/soxsSchema';
		var newObjFields = {};

		for(var i = 0; i < $scope.newObjFields.length; ++i) {
			var nextField = $scope.newObjFields[i];
			console.log(nextField);
			newObjFields[nextField.name] = nextField.type;
		}

		var newObj = {
			name: $scope.newObj_name,
			description: $scope.newObj_description,
			fields: JSON.stringify(newObjFields)
		};

		console.log(newObj);

		$http.post(url, newObj).success(function(data) {
			$('#myModal').modal('hide');
		}).error(function(data, status){
			console.log(data);
			console.log(status);
		})

	};

	function updateDataType() {
		var url = server + 'api/soxs/update/soxsSchema/' + $scope.model_id;

		var newObj = {
			name: $scope.newObj_name,
			description: $scope.newObj_description,
			fields: JSON.stringify($scope.newObjFields)
		};

		$http.post(url, newObj).success(function(data) {
			$('#myModal').modal('hide');
		}).error(function(data, status){
			console.log(data);
			console.log(status);
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
		console.log(model);
		// $scope.model_id = model._id;
		$scope.mode = mode;
		if ($scope.mode === 'edit') {
			$scope.modalTitle = 'Edit Data Model';
			$scope.modalSubmitText = 'Update Data Model';

			$scope.newObj_name = model.name;
			$scope.newObj_description = model.description;
			$scope.newObjFields = model.fields;
			$scope.link_id = model._id;
		} else if ($scope.mode === 'insert') {
			$scope.modalTitle = 'Insert Data Model';
			$scope.modalSubmitText = 'Create New Data Model';
		}

		$('#myModal').modal('show');
	};

	$scope.saveDataType = function() {
		// This is only here until i figure out how updating model data
		$scope.mode ='insert';
		
		if ($scope.mode === 'insert') {
			addDataType();
		} else if ($scope.mode === 'edit') {
			updateDataType();
		}
	}


	$scope.addFieldToObj = function() {
		console.log($scope.newFieldName);
		console.log($scope.newFieldType);
		var nf = {
			name: $scope.newFieldName,
			type: $scope.newFieldType.value
		}

		$scope.newObjFields.push(nf);
		console.log($scope.newObjFields);
	}

	$scope.addFieldTextToObj = function() {
		console.log($scope.newFieldText);
		var fields = JSON.parse($scope.newFieldText);
			for (var prop in fields) {
				var field = {
					name: prop,
					type: fields[prop]
				}
				$scope.newObjFields.push(field);
			}
	}


	$scope.edit_data_model = function(model) {
		showModal('edit', model);
	}

	$scope.insert_data_model = function() {
		console.log('insert_data_model');
		$scope.newObjFields = [];
		$scope.newObj_name = '';
		$scope.newObj_description = '';
		showModal('insert');
	}


	$http.get(server + 'api/soxs/types').success(function(data) {
		console.log(data);
		$scope.data_models = [];

		for (var i = 0; i < data.length; ++i) {
			var model = {
				name: data[i].name,
				description: data[i].description,
				fields: []
			}

			var fields = JSON.parse(data[i].fields);
			for (var prop in fields) {
				var field = {
					name: prop,
					type: fields[prop]
				}
				model.fields.push(field);
			}
			
			$scope.data_models.push(model);
		}


		
		// $scope.tags = [];
		// for (var i = 0; i < data.length; ++i) {
		// 	var l = {
		// 		name: data[i].name,
		// 		text: data[i].text,
		// 		url: data[i].url,
		// 		tags: data[i].tags.split(','),
		// 		_id: data[i]._id
		// 	};
		// 	for (var j = 0; j < l.tags.length; ++j) {
		// 		var found = false;
		// 		for (var k = 0; k < $scope.tags.length; ++k) {
		// 			if (l.tags[j] == $scope.tags[k]) { found = true; break;}
		// 		}
		// 		if (!found) { $scope.tags.push(l.tags[j]); }
		// 	}
		// 	$scope.links.push(l);
		// }
	});





}