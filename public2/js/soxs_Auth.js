/* soxs_Auth.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/14/2014
 *
 */

var soxsServices = angular.module('soxsServices', []);

soxsServices.factory("soxsAuth", ["$rootScope", "$http", "$q", "$window",
    function($rootScope, $http, $q, $window) {
        var userInfo;
        $rootScope.currentToken = null;
        $rootScope.currentUser = null;
        $rootScope.lastError = '';

        function init() {
            console.log("SESSION INIT");
            console.log(currentSession.get());

            $http({
                url: '/api/session/validate',
                method: 'GET',
                headers: {
                    Authorization: $rootScope.currentToken.get()
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(res) {
                $rootScope.currentToken = res.body;
                $http({
                    url: '/api/session/user',
                    method: 'GET',
                    headers: {
                        Authorization: $rootScope.currentToken
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(function(res) {
                    $rootScope.currentUser = res.body;
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
                $rootScope.currentToken = res.data.replace('"', '');
                $rootScope.currentToken = $rootScope.currentToken.replace('"', '');
                console.log($rootScope.currentToken);

                $http({
                    url: '/api/session/user',
                    method: 'GET',
                    headers: {
                        Authorization: $rootScope.currentToken
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(function(res) {
                    $rootScope.currentUser = res.data;
                    console.log($rootScope.currentUser);
                    deferred.resolve($rootScope.currentUser);
                    $rootScope.$emit('login_changed', true);
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
                    Authorization: $rootScope.currentToken
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
                    Authorization: $rootScope.currentToken
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(result) {
                // userInfo = null;
                // $window.sessionStorage["userInfo"] = null;
                $rootScope.currentToken = null;
                $rootScope.currentUser = null;
                $rootScope.$emit('login_changed', false);
                deferred.resolve(result);
            }, function(error) {
                $rootScope.lastError = error;
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getUserInfo() {
            return $rootScope.currentUser;
        }

        function userLoggedIn() {
            return ($rootScope.currentUser != null);
        }

        function changePassword(password) {
            console.log('soxs_Auth::changePassword');
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/api/session/changepassword',
                headers: {
                    Authorization: 'Basic ' + Base64.encode($rootScope.currentUser.username + ':' + password)
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(res) {
                console.log("password changed successfully");


            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function validateUser() {
            var deferred = $q.defer();
            $http({
                url: '/api/session/validate',
                method: 'GET',
                headers: {
                    Authorization: $rootScope.currentToken
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function(res) {
                $rootScope.currentToken = res.data.replace('"', '');
                $rootScope.currentToken = $rootScope.currentToken.replace('"', '');
                $http({
                    url: '/api/session/user',
                    method: 'GET',
                    headers: {
                        Authorization: $rootScope.currentToken
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(function(res) {
                    $rootScope.currentUser = res.data;
                    deferred.resolve($rootScope.currentUser);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function isAdminUser() {
            return hasPermission(2);
        }

        function hasPermission(permissionIndex) {
            if (!$rootScope.currentUser) {
                return false;
            } else {
                var anded = $rootScope.currentUser.permissions & permissionIndex;
                return (anded == permissionIndex);
            }
        }

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,
            http_get: http_get,
            validateUser: validateUser,
            userLoggedIn: userLoggedIn,
            changePassword: changePassword,
            isAdminUser: isAdminUser,
            hasPermission: hasPermission
        };
    }
]);