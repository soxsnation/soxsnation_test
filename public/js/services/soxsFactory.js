/* soxsFactory.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/31/2015
 *
 */




angular.module('soxsnationApp')
    .factory('soxsFactory', ["soxsAuth", "$q",
        function(soxsAuth, $q) {

        	var snTypes = {};
            var base_url = 'api/sox/';

        	function getTypes() {
        		var t = [];
        		for (var sn in snTypes) {
        			t.push(sn);
        		}
        		return t;
        	}

            function getData(snDataType) {
                console.log('soxsFactory::getData: ' + snDataType);
            	var deferred = $q.defer();

                var url = base_url + snDataType;

                soxsAuth.http_get(url)
                    .then(function(data) {
                    	console.log('snFactory::getData: got data');
                        console.log(data);
                    	deferred.resolve(data);

                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    });

                return deferred.promise;
            }

            function postData(snDataType, sn_data) {
				var deferred = $q.defer();

                var url = base_url + snDataType;

                soxsAuth.http_post(url, sn_data)
					.then(function(data) {
						deferred.resolve(data);
					}, function(err) {
						console.log('ERROR: ' + err);
						deferred.reject(err);
					})
				return deferred.promise;
            }

            function putData(snDataType, sn_data) {
                var deferred = $q.defer();

                var url = base_url + snDataType + '/' + sn_data._id;

                soxsAuth.http_put(url, sn_data)
                    .then(function(data) {
                        deferred.resolve(data);
                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    })
                return deferred.promise;
            }

            function deleteData(snDataType, id) {
                var deferred = $q.defer();

                var url = base_url + snDataType + '/' + id;

                soxsAuth.http_delete(url)
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
                putData: putData,
                deleteData: deleteData,
                getTypes: getTypes
            }
        }
    ]);
