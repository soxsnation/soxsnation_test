// /* soxs_service.js
//  *
//  * Author(s):  Andrew Brown
//  * Date:       10/31/2014
//  *
//  */


// angular.module('soxsnationApp')
//   .factory('soxsAuthService', function soxsAuthService($http, Session, $location, $rootScope, $window) {

// $rootScope.currentToken = $window.sessionStorage.currentToken || null;
// $rootScope.currentUser = $window.sessionStorage.currentUser || null;

// return {

// 	login: function (credentials, cb) {
// 		$http({
//                 method: 'GET',
//                 url: '/api/session/login',
//                 headers: {
//                     Authorization: 'Basic ' + Base64.encode(credentials.userName + ':' + credentials.password)
//                 },
//                 xhrFields: {
//                     withCredentials: true
//                 }
//             }).then(function(res) {
//             	Session.create(res.data.sessionId, res.data._id, res.data.permissions);
//             	return res.data;
//             })
// 	}


// }



//   // 	var soxsAuthService = {};

//   // 	soxsAuthService.login = function (credentials) {
//   	// 	return $http({
//    //              method: 'GET',
//    //              url: '/api/session/login',
//    //              headers: {
//    //                  Authorization: 'Basic ' + Base64.encode(userName + ':' + password)
//    //              },
//    //              xhrFields: {
//    //                  withCredentials: true
//    //              }
//    //          }).then(function(res) {
//    //          	Session.create(res.data.sessionId, res.data._id, res.data.permissions);
//    //          	return res.data;
//    //          })

//   	// }

//   // 	soxsAuthService.isAuthenticated = function () {
//   //   return !!Session.userId;
//   // };
//   //   return soxsAuthService;


//   })
// //   .service('Session', function () {
// //   this.create = function (sessionId, userId, permissions) {
// //     this.id = sessionId;
// //     this.userId = userId;
// //     this.permissions = permissions;
// //   };
// //   this.destroy = function () {
// //     this.id = null;
// //     this.userId = null;
// //     this.permissions = null;
// //   };
// //   return this;
// // })