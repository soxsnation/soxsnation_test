/* app.js
 *
 * Author(s):  Andrew Brown
 * Date:       9/30/2014
 *
 */



angular.module('soxsnation', []).config(function ($routeProvider) {
    $routeProvider.
		when('/Home', { controller: HomeController, templateUrl: '../partials/home.html' }).
        when('/Links', { controller: LinkController, templateUrl: '../partials/links.html' }).
		when('/SoxsData', { controller: SoxsDataController, templateUrl: '../partials/soxsdata/soxsdata.html' }).
		// when('/About', { controller: AboutController, templateUrl: '../partials/about.html' }).
		// when('/Community', { controller: CommunityController, templateUrl: '../partials/community.html' }).
		// when('/Listings', { controller: ListingsController, templateUrl: '../partials/listingtable.html' }).
		// when('/ListingSearch', { controller: ListingSearchController, templateUrl: '../partials/listingsearch.html' }).
		otherwise({redirectTo: '/Home'});        
});