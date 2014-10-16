/* soxs_Auth.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/14/2014
 *
 */

var soxsServices = angular.module('soxsServices', []);

soxsServices.factory("soxsAuth", ["$http", "$q", "$window",
    function($http, $q, $window) {
        var userInfo;
        var currentToken = null;
        var currentUser = null;

        function init() {
            console.log("SESSION INIT");
            console.log(currentSession.get());

            $http({
                url: '/api/session/validate',
                method: 'GET',
                headers: {
                    Authorization: currentToken.get()
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(res) {
                currentToken = res.body;
                $http({
                    url: '/api/session/user',
                    method: 'GET',
                    headers: {
                        Authorization: currentToken
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(function(res) {
                    currentUser = res.body;
                });
            })

        }

        function login(userName, password) {
            var deferred = $q.defer();

            // $http.post("/api/login", {
            //     userName: userName,
            //     password: password
            // })
            //     .then(function(result) {
            //         userInfo = {
            //             accessToken: result.data.access_token,
            //             userName: result.data.userName
            //         };
            //         $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            //         deferred.resolve(userInfo);
            //     }, function(error) {
            //         deferred.reject(error);
            //     });


            $http({
                method: 'GET',
                url: '/api/session/login',
                headers: {
                    Authorization: 'Basic ' + Base64.encode(userName + ':' + password)
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(res) {
                console.log("login");
                currentToken = res.data.replace('"', '');
                currentToken = currentToken.replace('"', '');
                console.log(currentToken);

                $http({
                    url: '/api/session/user',
                    method: 'GET',
                    headers: {
                        Authorization: currentToken
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(function(res) {
                    currentUser = res.data;
                    console.log(currentUser);
                    deferred.resolve(currentUser);
                }, function(error) {
                    deferred.reject(error);
                });

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function http_get(url) {
            console.log('http_get');
            // console.log(userInfo.accessToken);
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: url,
                headers: {
                    Authorization: currentToken
                },
                xhrFields: {
                    withCredentials: true
                }
            }).success(function(data) {
                deferred.resolve(data);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();

            $http({
                method: "GET",
                url: "/api/session/logout",
                headers: {
                    Authorization: currentToken
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(result) {
                // userInfo = null;
                // $window.sessionStorage["userInfo"] = null;
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getUserInfo() {
            return currentUser;
        }

        function validateUser() {
            var deferred = $q.defer();
            $http({
                url: '/api/session/validate',
                method: 'GET',
                headers: {
                    Authorization: currentToken
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(res) {
                currentToken = res.data.replace('"', '');
                currentToken = currentToken.replace('"', '');
                $http({
                    url: '/api/session/user',
                    method: 'GET',
                    headers: {
                        Authorization: currentToken
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(function(res) {
                    currentUser = res.data;
                    deferred.resolve(currentUser);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // function init() {
        //     if ($window.sessionStorage["userInfo"]) {
        //         userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        //     }
        // }
        // init();

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,
            http_get: http_get,
            validateUser: validateUser
        };
    }
]);