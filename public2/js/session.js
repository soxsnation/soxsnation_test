/* session.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */


var soxsnationSession = angular.module('soxsnationSession', [
	'ngRoute',
	'soxsServices'
]);


soxsnationSession.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/Home', {
			controller: 'HomeController',
			templateUrl: '../partials/home.html'
		}).
		when('/Login', {
			controller: 'LoginController',
			templateUrl: '../partials/login.html'
		}).
		when('/logout', {
			controller: 'LogoutController',
			templateUrl: '../partials/logout.html'
		}).
		otherwise({
			redirectTo: '/Home'
		});
	}
]);
