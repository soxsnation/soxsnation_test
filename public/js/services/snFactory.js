/* snFactory.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/31/2015
 *
 */



/**
 * @class snFactory
 */
angular.module('soxsnationApp')
    .factory('snFactory', ["soxsAuth", "$q",
        function(soxsAuth, $q) {

            var snTypes = {};
            var snData = {};

            function set_snData(snDataType, data) {
                console.log('snFactory::set_soxsData: ' + snDataType);
                if (snData.hasOwnProperty(snDataType)) {
                    for (var i = 0; i < data.length; ++i) {
                        var found = false;
                        for (var j = 0; j < snData[snDataType].length; ++j) {
                            if (snData[snDataType][j]._id == data[i]._id) {
                                found = true;
                                snData[snDataType][j] = data[i];
                                break;
                            }
                        }
                        if (!found) {
                            snData[snDataType].push(data[i]);
                        }
                    }
                } else {
                    snData[snDataType] = [];
                    for (var i = 0; i < data.length; ++i) {
                        snData[snDataType].push(data[i]);
                    }
                }
            }

            /**
             * @function getTypes
             * @desc Gets data types
             * @memberof snFactory
             * @returns {string} An array of the different data type names
             */
            function getTypes() {
                var t = [];
                for (var sn in snTypes) {
                    t.push(sn);
                }
                return t;
            }

            /**
             * @function getData
             * @desc Gets data from the server using the current users {@link soxs_Auth.http_get|Authentication} 
             * @memberof snFactory
             * @param  {string} snDataType The data type to get from the server
             * @returns {promise} A promise to the data of the given type
             */
            function getData(snDataType) {
                var deferred = $q.defer();
                if (snData.hasOwnProperty(snDataType)) {
                    console.log('snFactory::getData: (EXISTS) ' + snDataType);
                    deferred.resolve(snData[snDataType]);
                } else {
                    console.log('snFactory::getData: (DOWNLOAD) ' + snDataType);
                    var url = 'api/sn/' + snDataType;

                    soxsAuth.http_get(url)
                        .then(function(data) {
                            console.log('snFactory::getData: got data: ' + snDataType);
                            set_snData(snDataType, data);
                            deferred.resolve(data);

                        }, function(err) {
                            console.log('ERROR: ' + err);
                            deferred.reject(err);
                        });
                }

                return deferred.promise;
            }

            /**
             * @function postData
             * @desc Posts data back to server
             * @memberof snFactory
             * @param  {string} snDataType The data type to be posted
             * @param  {object} sn_data The data to be posted
             */
            function postData(snDataType, sn_data) {
                var deferred = $q.defer();

                var url = 'api/sn/' + snDataType;

                soxsAuth.http_post(url, sn_data)
                    .then(function(data) {
                        set_snData(snDataType, [data]);
                        deferred.resolve(data);
                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    })
                return deferred.promise;
            }

            /**
             * @function putData
             * @desc Puts data back to server
             * @memberof snFactory
             * @param  {string} snDataType The data type to be put
             * @param  {object} sn_data The data to be put
             */
            function putData(snDataType, sn_data) {
                var deferred = $q.defer();

                var url = 'api/sn/' + snDataType;

                soxsAuth.http_put(url, sn_data)
                    .then(function(data) {
                        set_snData(snDataType, [data]);
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
                getTypes: getTypes
            }
        }
    ]);
