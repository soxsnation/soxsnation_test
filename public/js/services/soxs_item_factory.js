/* soxs_item_factory.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/20/2015
 *
 */


// angular.module('soxsnationApp')
// 		.factory('soxsItemFactory', ["soxsAuth", "$q",
// 			function(soxsAuth, $q) {

angular.module('soxsnationApp')
	.factory('soxsItemFactory', ["soxsAuth", "$q",
		function(soxsAuth, $q) {

			// var getTemplates = function() {
			// 	return $http.get(URL + 'templates.json');
			// };

			var data = [];

			var soxs_types = function() {
				console.log('soxs_types: ' + data.length);
				var deferred = $q.defer();
				if (data.length == 0) {
					return get_soxs_types();
				}
				else {
					deferred.resolve(data);
				}
				return deferred.promise;
			}

			var get_soxs_types = function() {
				console.log('get_soxs_types');
				var deferred = $q.defer();
				var soxs_types = [];
				soxsAuth.http_get('api/soxsType/_all')
					.then(function(data) {
						
						for (var i = 0; i < data.length; ++i) {
							console.log('Data: ' + data[i]);
							soxs_types.push(data[i]);
							// data.push(data[i]);
						}
						// data.soxs_types = soxs_types;
						deferred.resolve(soxs_types);
						// console.log(soxs_types);

					})
					// return soxs_types;
				return deferred.promise;
			};

			return {
				get_soxs_types: get_soxs_types
			};
		}
	]);