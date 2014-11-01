/* soxs_service.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */


angular.module('soxsnationApp')
  .factory('soxsFactory', function ($resource) {
    return $resource('api/soxs/types');
  });