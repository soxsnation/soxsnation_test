/* soxs_factory.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */


angular.module('soxsnationApp')
	.factory('soxsFactory', ["soxsAuth", "$q",
		function(soxsAuth, $q) {



			function getData(dataType) {
				var deferred = $q.defer();

				var url = 'api/soxs/getall/' + dataType;

				soxsAuth.http_get(url)
					.then(function(data) {
						console.log('soxsAuth.http_get');
						// console.log(data);
						var items = [];
						for (var i = 0; i < data.length; ++i) {
							var nextItem = {};
							for (var property in data[i]) {
								if (property != '__proto__') {
									nextItem[property] = data[i][property];
								}
							}
							items.push(nextItem);
						}

						deferred.resolve(items);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})


				return deferred.promise;
			}

			function saveData(dataType, item, isNew) {
				var deferred = $q.defer();
				var url = '';
				if (isNew) {
					url = 'api/soxs/insert/' + dataType;
				} else {
					url = 'api/soxs/update/' + dataType + '/' + item._id;
				}

				// console.log(url);
				// console.log(item);

				soxsAuth.http_post(url, item)
					.then(function(data) {
						deferred.resolve(data);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})
				return deferred.promise;
			}

			function insertData(dataType, item) {
				var deferred = $q.defer();
				var url = 'api/soxs/insert/' + dataType;
				console.log(url);
				console.log(item);

				soxsAuth.http_post(url, item)
					.then(function(data) {
						deferred.resolve(data);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})
				return deferred.promise;
			}

			function updateData(dataType, item) {
				var deferred = $q.defer();
				var url = 'api/soxs/update/' + dataType + '/' + item._id;
				// console.log(url);
				// console.log(item);

				soxsAuth.http_post(url, item)
					.then(function(data) {
						deferred.resolve(data);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})
				return deferred.promise;
			}

			function deleteData(dataType, item) {
				var deferred = $q.defer();
				var url = 'api/soxs/delete/' + dataType + '/' + item._id;
				console.log(url);
				// console.log(item);

				soxsAuth.http_get(url)
					.then(function(data) {
						console.log('deleteData: ' + data);
						deferred.resolve(data);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})
				return deferred.promise;
			}

			function archiveData(dataType, item) {
				var deferred = $q.defer();
				var url = 'api/soxs/archive/' + dataType + '/' + item._id;
				// console.log(url);
				// console.log(item);

				soxsAuth.http_call(url, item, "DELETE")
					.then(function(data) {
						deferred.resolve(data);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})
				return deferred.promise;
			}



			return {
				users: ['John', 'James', 'Jake'],
				printName: function(name) {
					console.log(name);
				},
				names: function() {
					return 'Andrew Brown';
				},
				getData: getData,
				updateData: updateData,
				insertData: insertData,
				saveData: saveData,
				deleteData: deleteData
			}

			// var fac = {};

			// fac.users = ['John', 'James', 'Jake']; 

			// return fac;

		}
	]);