/* app.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */



angular.module('SoxsnationApp', []).config(function ($routeProvider) {
    $routeProvider.
		when('/Home', { controller: HomeController, templateUrl: '../partials/home.html' }).
        when('/Agents', { controller: AgentController, templateUrl: '../partials/agents.html' }).
		when('/Contact', { controller: ContactController, templateUrl: '../partials/contact.html' }).
		when('/About', { controller: AboutController, templateUrl: '../partials/about.html' }).
		when('/Community', { controller: CommunityController, templateUrl: '../partials/community.html' }).
		when('/Listings', { controller: ListingsController, templateUrl: '../partials/listingtable.html' }).
		when('/ListingSearch', { controller: ListingSearchController, templateUrl: '../partials/listingsearch.html' }).
		otherwise({redirectTo: '/Home'});        
});