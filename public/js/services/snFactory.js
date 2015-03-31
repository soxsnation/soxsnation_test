/* snFactory.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/31/2015
 *
 */




angular.module('soxsnationApp')
    .factory('snFactory', ["soxsAuth", "$q",
        function(soxsAuth, $q) {

        	var snTypes = {};

        	function getTypes() {
        		var t = [];
        		for (var sn in snTypes) {
        			t.push(sn);
        		}
        		return t;
        	}

            function getData(snDataType) {
            	var deferred = $q.defer();

                var url = 'api/sn/' + snDataType;

                soxsAuth.http_get(url)
                    .then(function(data) {
                    	console.log('snFactory::getData: got data');
                    	deferred.resolve(data);

                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    });

                return deferred.promise;
            }

            function postData(snDataType, sn_data) {
				var deferred = $q.defer();

                var url = 'api/sn/' + snDataType;

                soxsAuth.http_post(url, sn_data)
					.then(function(data) {
						deferred.resolve(data);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})
				return deferred.promise;
            }


            return {
                getData: getData,
                postData: postData,
                getTypes: getTypes
            }
        }
    ]);
