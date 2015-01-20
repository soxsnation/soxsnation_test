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

        if ($window.sessionStorage.token) {
            console.log('found token in session storage')
            $rootScope.currentToken = $window.sessionStorage.token;
        }

        if ($window.sessionStorage.user) {
            console.log('found token in session storage')
            $rootScope.currentUser = JSON.parse($window.sessionStorage.user);
        }

        function init() {
            // console.log("SESSION INIT");
            // console.log(currentSession.get());

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
            // console.log('soxs_Auth.login ' + userName + password)

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
                // console.log("login");
                $rootScope.currentToken = res.data.replace('"', '');
                $rootScope.currentToken = $rootScope.currentToken.replace('"', '');
                $window.sessionStorage.token = $rootScope.currentToken;
                // console.log($rootScope.currentToken);

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
                    // console.log('User Data:');
                    // console.log(res.data);
                    $rootScope.currentUser = res.data;
                    $window.sessionStorage.user = JSON.stringify($rootScope.currentUser);
                    // console.log($rootScope.currentUser);
                    $rootScope.$emit('login_changed', 'emit');
                    deferred.resolve($rootScope.currentUser);
                }, function(error) {
                    deferred.reject(error);
                });

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function http_get(url) {
            // console.log('http_get');
            // console.log($rootScope.currentToken);

            var deferred = $q.defer();
            $http({
                method: "GET",
                url: url,
                headers: {
                    Authorization: $rootScope.currentToken
                }
                // ,xhrFields: {
                //     withCredentials: true
                // }
            }).success(function(data) {
                // console.log('http_get2: ' + data);
                deferred.resolve(data);
            }, function(error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function http_post(url, data) {
            var deferred = $q.defer();

            $http({
                method: "POST",
                url: url,
                headers: {
                    Authorization: $rootScope.currentToken
                },
                data: data,
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

        function http_call(url, data, method) {
            var deferred = $q.defer();

            $http({
                method: method,
                url: url,
                headers: {
                    Authorization: $rootScope.currentToken
                },
                data: data,
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
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                deferred.resolve(result);
            }, function(error) {
                console.log(error);
                $rootScope.lastError = error;
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getUserInfo() {
            if ($rootScope.currentUser == null && $rootScope.currentToken != null) {
                console.log("getUserInfo: have a token but no user info")
                return $rootScope.currentUser;
            } else {
                return $rootScope.currentUser;
            }
        }

        function userLoggedIn() {
            return ($rootScope.currentUser != null);
        }

        function changePassword(password) {
            // console.log('soxs_Auth::changePassword');
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
            http_post: http_post,
            validateUser: validateUser,
            userLoggedIn: userLoggedIn,
            changePassword: changePassword,
            isAdminUser: isAdminUser,
            hasPermission: hasPermission,
            http_call: http_call
        };
    }
]);




