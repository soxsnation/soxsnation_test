/* data_ctrl.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/11/2014
 *
 */

/* Controllers */

angular.module('soxsnationApp')
	.controller('DataController', ['$scope', 'soxsAuth', '$location', 'soxsFactory', '$timeout',

		function($scope, soxsAuth, $location, soxsFactory, $timeout) {

			soxsAuth.validateUser().then(function(user) {
				console.log('User is logged in');


				$scope.showAlert = 'none';
				$scope.alertText = 'Alert';
				$scope.alertCss = 'alert-danger';
				$scope.modal_error = '';
				$scope.mode = 'none';
				$scope.modalHidden = 'true';
				$scope.currentItem = {};
				$scope.currentDataModel = [];
				$scope.list_Item = {};


				var dataType = $location.url();
				dataType = dataType.substring(1, dataType.length - 1);
				$scope.dataType = dataType;
				$scope.page = dataType + ' Page';

				var ignoreProps = ['__v', '_id', 'userAdded', 'userUpdated', 'dateAdded', 'dateUpdated'];

				soxsAuth.http_get('api/soxs/type/' + $scope.dataType)
					.then(function(data) {
						console.log('Got Data Type ' + $scope.dataType);
						console.log(data);
						$scope.dataModel = JSON.parse(data.fields);
						$scope.list_Item = {};
						console.log($scope.dataModel);

						for (var prop in $scope.dataModel) {
							if (ignoreProps.indexOf(prop) == -1) {
								var field = {
									name: prop,
									isEditable: false,
									buttonText: 'Edit',
									isString: ($scope.dataModel[prop] === 'String'),
									isBoolean: ($scope.dataModel[prop] === 'Boolean'),
									isArray: (Object.prototype.toString.call($scope.dataModel[prop]) == '[object Array]')
								};
								console.log(prop);
								console.log($scope.dataModel[prop]);

								if (field.isArray) {
									if (Object.prototype.toString.call($scope.dataModel[prop][0]) == '[object String]') {
										field.isArrayObject = false;
									} else if (Object.prototype.toString.call($scope.dataModel[prop][0]) == '[object Object]') {
										field.isArray = false;
										field.isArrayObject = true;
										$scope.list_Item[prop] = {};
										field.arrayItems = [];
										for (var arrayProp in $scope.dataModel[prop][0]) {
											field.arrayItems.push(arrayProp);
										}
									}
								}

								$scope.currentDataModel.push(field);
							}
						}
						console.log($scope.currentDataModel);


					}, function(err) {
						console.log('ERROR: ' + err);
					});
			

				function getData() {
					$scope.soxsItems = [];
					soxsFactory.getData(dataType).then(function(data) {
						console.log(data);
						$scope.soxsItems = data;

						// console.log('Current Props')
						// for (var prop in $scope.soxsItems[0]) {
						// 	// console.log(prop);
						// 	// console.log(Object.prototype.toString.call($scope.soxsItems[0][prop]))
						// 	if (ignoreProps.indexOf(prop) == -1) {
						// 		var field = {
						// 				name: prop,
						// 				isEditable: false,
						// 				buttonText: 'Edit',
						// 				type: Object.prototype.toString.call($scope.soxsItems[0][prop]),
						// 				isArray: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object Array]'),
						// 				isString: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object String]'),
						// 				isBoolean: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object Boolean]'),
						// 				isObject: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object Object]')
						// 			}
						// 			// console.log(field)
						// 		// $scope.currentDataModel.push(field);
						// 	}
						// }
					});


				}
				getData();

				function insertData() {
					console.log('insertData');
					soxsFactory.saveData(dataType, $scope.currentItem, true)
						.then(function(data) {
							console.log(data);
							$scope.soxsItems.push(data);
							$('#myModal').modal('hide');
							showAlert('Successful Insert', false);
						}, function(err) {
							showAlert(err, true);
						})

				}

				function updateData() {
					console.log('updateData');
					console.log($scope.currentItem)
					soxsFactory.updateData(dataType, $scope.currentItem).then(function(data) {
						console.log(data);
						$('#myModal').modal('hide');
						showAlert('Successful Update', false);

					}, function(err) {
						showAlert(err, true);
					})
				}

				function showModal(mode, soxsItems) {
					$scope.mode = mode;
					if ($scope.mode === 'update') {
						$scope.currentItem = soxsItems;
						$scope.modalTitle = 'Edit ' + dataType;
						$scope.modalSubmitText = 'Update ' + dataType;

					} else if ($scope.mode === 'insert') {
						$scope.currentItem = {};
						$scope.modalTitle = 'Insert ' + dataType;
						$scope.modalSubmitText = 'Insert New ' + dataType;
					}

					$('#myModal').modal('show');
				};

				$scope.message = $scope.lastError;

				$scope.insertItem_clicked = function() {
					console.log('insertItem_clicked');
					showModal('insert');
				}

				$scope.addItem_clicked = function() {
					$scope.mode ='insert';
					$scope.modalSubmitText = 'Add ' + $scope.dataType;
					$scope.currentItem = {};
					$('#addItemModal').modal('show');
				}

				$scope.deleteItem_clicked = function() {
					$scope.mode ='delete';

					soxsFactory.deleteData(dataType, $scope.currentItem).then(function(data) {						
						// $('#myModal').modal('hide');
						console.log('Successfully Deleted');
						showAlert('Successfully Deleted', false);
						$scope.currentItem = {};
						getData();

					}, function(err) {
						showAlert(err, true);
					})

					// getData();
				}

				$scope.archiveItem_clicked = function() {
					$scope.mode ='delete';
					console.log($scope.mode);
					var item = $scope.currentItem;
					item.archive = true;

					soxsFactory.archiveData(dataType, $scope.currentItem).then(function(data) {			
						showAlert('Successfully Archived', false);
						$scope.currentItem = {};
						getData();

					}, function(err) {
						showAlert(err, true);
					})
				}

				$scope.addItem_submit = function() {
					$scope.currentItem = {};
					$scope.currentItem.name = $scope.addItemName;
					$scope.mode = 'edit';
					$scope.submitText = 'Update ' + $scope.dataType;
					insertData();

					$('#addItemModal').modal('hide');
				}

				$scope.editItem_clicked = function(item) {
					console.log('editItem_clicked');
					showModal('update', item)
				}

				$scope.item_clicked = function(item) {
					if ($scope.currentItem == item) {
						if ($scope.mode == 'view') {
							$scope.mode = 'edit';
						} else {
							$scope.mode ='view';
						}
					}
					else {
						$scope.currentItem = item;
						$scope.mode = 'view';
						$scope.submitText = 'Update ' + $scope.dataType;
					}
					console.log($scope.mode)
				}


				$scope.saveItem = function() {
					if ($scope.mode === 'insert') {
						insertData();
					} else if ($scope.mode === 'edit') {
						updateData();
					}
				}


				function showAlert(text, isError) {
					$scope.showAlert = 'block';
					$scope.alertText = text;
					if (isError) {
						$scope.alertCss = 'alert-danger';
					} else {
						$scope.alertCss = 'alert-success';
					}

					$timeout(hideAlert, 3000);
				}

				function hideAlert() {
					$scope.showAlert = 'none';
				}


				$scope.names = soxsFactory.users;

				$scope.name = soxsAuth.getUserInfo().firstName + ' ' + soxsAuth.getUserInfo().lastName;

				if (soxsAuth.isAdminUser()) {
					$scope.user = user;
				}

			}, function(error) {
				$location.path('/Login');
			});


		}
	]);