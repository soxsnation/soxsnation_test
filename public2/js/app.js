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
			controller: 'HomeController',
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
			controller: 'LinkController',
			templateUrl: '../partials/links.html'
		}).
		when('/recipes', {
			controller: 'RecipeController',
			templateUrl: '../partials/recipes.html'
		}).
		when('/SoxsData', {
			controller: 'SoxsDataController',
			templateUrl: '../partials/soxsdata/soxsdata.html'
		}).
		when('/Settings', {
			controller: 'SoxsController',
			templateUrl: '../partials/settings.html'
		}).
		when('/404', {
			controller: 'ErrorController',
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