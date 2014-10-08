/* soxs_data_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

/* Controllers */


function SoxsDataController($scope, $http) {
	$scope.page = 'Soxs Data';

	$scope.modalTitle = 'Add Data Type';
	$scope.modalSubmitText = 'Add Data Type';

	$scope.newObj_name = 'name';
	$scope.newObj_description = 'description';
	// $scope.newObjFields = [
	// 		{name: 'String'},
	// 		{complete: 'Boolean'},
	// 		{description: 'String'}
	// 	];
	$scope.newObjFields = [
			{ name: 'name', type:'String'},
			{ name:'complete', type: 'Boolean'},
			{ name: 'description', type: 'String'}
		];
	$scope.fieldTypes = [{name:'String'}, {name:'Boolean'}, {name:'Number'}, {name:'Date'}, {name:'Array'}];

	$scope.newFieldName = '';
	$scope.newFieldType = '';

	function addDataType() {

		var url = 'http://localhost:3085/api/soxs/create/soxsSchema';
		var newObjFields = $scope.newObjFields;

		var newObj = {
			name: $scope.newObj_name,
			description: $scope.newObj_description,
			fields: newObjFields
		};


		$http.post(url, newObj).success(function(data) {

		}).error(function(data, status){
			console.log(data);
			console.log(status);
		})

	};


	$scope.addFieldToObj = function() {
		console.log($scope.newFieldName);
		console.log($scope.newFieldType);
		var nf = {
			name: $scope.newFieldName,
			type: $scope.newFieldType.name
		}

		$scope.newObjFields.push(nf);
		console.log($scope.newObjFields);
	}











}