/* app.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */


var soxsnationApp = angular.module('soxsnationApp', [
	'ngRoute',
	'soxsServices'
]);

soxsnationApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/Home', {
			controller: 'SoxsController',
			templateUrl: '../partials/home.html'
		}).
		when('/Login', {
			controller: 'LoginController',
			templateUrl: '../partials/session/login.html'
		}).
		when('/ChangePassword', {
			controller: 'ChangePasswordController',
			templateUrl: '../partials/session/changePassword.html'
		}).
		when('/links', {
			controller: 'DataController',
			templateUrl: '../partials/soxsItem.html'
		}).
		when('/tasks', {
			controller: 'DataController',
			templateUrl: '../partials/soxsItem.html'
		}).
		when('/recipes', {
			controller: 'DataController',
			templateUrl: '../partials/soxsItems/soxsItems.html'
		}).
		// when('/recipes', {
		// 	controller: 'DataController',
		// 	templateUrl: '../partials/soxsItem.html'
		// }).
		// when('/recipes', {
		// 	controller: 'RecipeController',
		// 	templateUrl: '../partials/recipes.html'
		// }).
		when('/SoxsData', {
			controller: 'SoxsDataController',
			templateUrl: '../partials/soxsdata/soxsdata.html'
		}).
		when('/Settings', {
			controller: 'SoxsController',
			templateUrl: '../partials/settings.html'
		}).
		when('/404', {
			controller: 'SoxsController',
			templateUrl: '../partials/Error/404.html'
		}).
		otherwise({
			redirectTo: '/Home'
		});
	}
])
.run(function ($rootScope, soxsAuth, $location) {
console.log('app.run');
$rootScope.$on('event:auth-loginRequired', function() {
      $location.path('/login');
      return false;
    });

})
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})