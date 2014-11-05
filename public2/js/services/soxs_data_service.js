/* soxs_service.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */


angular.module('soxsnationApp')
.factory('soxsDataService', function(){
     
	return {
		users: ['John', 'James', 'Jake'],
		printName: function (name) {
			console.log(name);
		}
	}

    // var fac = {};
     
    // fac.users = ['John', 'James', 'Jake']; 
     
    // return fac;
 
});