/* soxsItemDetails.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/14/2014
 *
 */


angular.module('soxsnationApp')
    .directive('soxsitemdetails', ['soxsAuth', '$location',
        function(soxsAuth, $location) {

        	function link(scope, element, attrs) {



        	}

            return {
                restrict: 'E',
                link: link,
                transclude: true,
                templateUrl: '../partials/soxsItems/directives/soxsItemDetails.html',
                controller: function($scope) {

                	console.log('scope.currentDataModel');
        			console.log($scope.currentDataModel);


                }
            }
        }
    ]);
