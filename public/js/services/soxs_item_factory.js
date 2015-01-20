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

			var get_soxs_types = function() {
				console.log('get_soxs_types');
				var deferred = $q.defer();
				var soxs_types = [];
				soxsAuth.http_get('api/soxsType/_all')
					.then(function(data) {
						
						for (var i = 0; i < data.length; ++i) {
							soxs_types.push(data[i]);
						}
						deferred.resolve(soxs_types);
						console.log(soxs_types);

					})
					// return soxs_types;

				return deferred.promise;
			};

			return {
				get_soxs_types: get_soxs_types
			};
		}
	]);