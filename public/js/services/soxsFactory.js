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

            var soxsData = {};

            function set_soxsData(snDataType, data) {
                console.log('soxsFactory::set_soxsData: ' + snDataType);

                if (soxsData.hasOwnProperty(snDataType)) {
                    for (var i = 0; i < data.length; ++i) {
                        var found = false;
                        for (var j =0; j < soxsData[snDataType].length; ++j) {
                            if (soxsData[snDataType][j]._id == data[i]._id) {
                                found = true;
                                soxsData[snDataType][j] = data[i];
                                break;
                            }
                        }
                        if (!found) {
                            soxsData[snDataType].push(data[i]);
                        }
                    }
                } else {
                    soxsData[snDataType] = [];
                    for (var i = 0; i < data.length; ++i) {
                        soxsData[snDataType].push(data[i]);
                    }
                }
            }

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

                if (soxsData.hasOwnProperty(snDataType)) {
                    console.log('soxsFactory::getData: (EXISTS) ' + snDataType);
                    deferred.resolve(soxsData[snDataType]);
                } else {
                    console.log('soxsFactory::getData: (DOWNLOAD) ' + snDataType);
                    var url = base_url + snDataType;

                    soxsAuth.http_get(url)
                        .then(function(data) {
                        	console.log('snFactory::getData: got data');
                            console.log(data);
                            set_soxsData(snDataType, data);
                        	deferred.resolve(data);

                        }, function(err) {
                            console.log('ERROR: ' + err);
                            deferred.reject(err);
                        });
                }

                return deferred.promise;
            }

            function postData(snDataType, sn_data) {
				var deferred = $q.defer();

                var url = base_url + snDataType;

                soxsAuth.http_post(url, sn_data)
					.then(function(data) {
                        set_soxsData(snDataType, [data]);
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
                        set_soxsData(snDataType, [data]);
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
