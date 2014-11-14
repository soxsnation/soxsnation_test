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
				$scope.listItem = '';

				var dataType = $location.url();
				dataType = dataType.substring(1, dataType.length - 1);
				$scope.dataType = dataType;
				$scope.page = dataType + ' Page';

				var ignoreProps = ['__v', '_id'];


				function getData() {
					soxsFactory.getData(dataType).then(function(data) {
						$scope.soxsItems = data;

						// console.log('Current Props')
						for (var prop in $scope.soxsItems[0]) {
							// console.log(prop);
							// console.log(Object.prototype.toString.call($scope.soxsItems[0][prop]))
							if (ignoreProps.indexOf(prop) == -1) {
								var field = {
										name: prop,
										isEditable: false,
										buttonText: 'Edit',
										type: Object.prototype.toString.call($scope.soxsItems[0][prop]),
										isArray: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object Array]'),
										isString: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object String]'),
										isBoolean: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object Boolean]'),
										isObject: (Object.prototype.toString.call($scope.soxsItems[0][prop]) == '[object Object]')
									}
									// console.log(field)
								$scope.currentDataModel.push(field);
							}
						}
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

				$scope.addListItem = function(listItem, property) {
					console.log(listItem);
					console.log(property);
					$scope.currentItem[property].push(listItem);
					listItem = '';
				}

				$scope.message = $scope.lastError;

				$scope.insertItem_clicked = function() {
					console.log('insertItem_clicked');
					showModal('insert');
				}

				$scope.editItem_clicked = function(item) {
					console.log('editItem_clicked');
					showModal('update', item)
				}

				$scope.item_clicked = function(item) {
					console.log('item_clicked' + item);
					for (var i = 0; i < $scope.currentDataModel.length; ++i) {
						console.log($scope.currentDataModel[i].name);
						if ($scope.currentDataModel[i].name == item) {
							if ($scope.currentDataModel[i].isEditable) {
								$scope.currentDataModel[i].isEditable = false;
								$scope.currentDataModel[i].buttonText = 'Edit';
							} else {
								$scope.currentDataModel[i].isEditable = true;
								$scope.currentDataModel[i].buttonText = 'Done';
							}

						}
					}
				}

				$scope.array_item_changed = function(property, index, text) {
					$scope.currentItem[property][index] = text;
				}

				$scope.array_item_remove = function(property, index) {
					$scope.currentItem[property].splice(index, 1);
				}

				$scope.saveItem = function() {
					if ($scope.mode === 'insert') {
						insertData();
					} else if ($scope.mode === 'update') {
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