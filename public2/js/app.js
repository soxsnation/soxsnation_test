/* app.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */


var soxsnationApp = angular.module('soxsnationApp', [
	'ngRoute',
	'SoxsDataControllers',
	'soxsServices'
]);

soxsnationApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		// when('/Home', { controller: HomeController, templateUrl: '../partials/home.html' }).
		//       when('/Links', { controller: LinkController, templateUrl: '../partials/links.html' }).
		//       when('/Recipes', { controller: RecipeController, templateUrl: '../partials/recipes.html' }).
		when('/SoxsData', {
			controller: 'SoxsDataController',
			templateUrl: '../partials/soxsdata/soxsdata.html'
		}).
		otherwise({
			redirectTo: '/SoxsData'
		});
	}
]);