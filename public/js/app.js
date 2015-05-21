/* app.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */

  /**
 * soxsnationApp module.
 * @module soxsnationApp
 */

var soxsnationApp = angular.module('soxsnationApp', [
	'ngRoute',
	'soxsServices',
	'angularCharts',
	'ngDragDrop',
	// 'snDraggable',
	// 'snTemplateService',
	'templateCreator',
	'ui.bootstrap',
	'Audio5'
]);

/**
 * Configures the angular views
 * @param  {$routeProvider} $routeProvider Provides teh routes
 */
soxsnationApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/graph', {
			controller: 'GraphController',
			templateUrl: '../partials/graph.html'
		}).
		when('/drag', {
			controller: 'DragController',
			templateUrl: '../partials/drag.html'
		}).
		when('/template', {
			controller: 'TemplateController',
			templateUrl: '../partials/templates.html'
		}).
		when('/Home', {
			controller: 'SoxsController',
			templateUrl: '../partials/home.html'
		}).
		when('/Music', {
			controller: 'soxsMusicController',
			templateUrl: '../partials/music/playing.html'
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
			templateUrl: '../partials/soxsItems/soxsItems.html'
		}).
		when('/recipes', {
			controller: 'DataController',
			templateUrl: '../partials/soxsItems/soxsItems.html'
		}).
		when('/goals', {
			controller: 'DataController',
			templateUrl: '../partials/soxsItems/soxsItems.html'
		}).
		when('/workouts', {
			controller: 'DataController',
			templateUrl: '../partials/soxsItems/soxsItems.html'
		}).
		when('/SoxsTemplate', {
			controller: 'SoxsTemplateController',
			templateUrl: '../partials/soxsdata/soxstemplate.html'
		}).
		when('/SoxsData', {
			controller: 'SnDataController',
			templateUrl: '../partials/soxsdata/soxsData.html'
		}).
		when('/SoxsDataSetup', {
			controller: 'SoxsDataController',
			templateUrl: '../partials/soxsdata/soxsDataSetup.html'
		}).
		when('/SoxsDataLayout', {
			controller: 'SoxsDataLayoutController',
			templateUrl: '../partials/soxsdata/soxs_data_layout.html'
		}).
		when('/SoxsTypes', {
			controller: 'SoxsDataController',
			// controller: 'SoxsTypeController',
			templateUrl: '../partials/soxsdata/soxstype.html'
		}).
		when('/Users', {
			controller: 'UserController',
			templateUrl: '../partials/users/users.html'
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
