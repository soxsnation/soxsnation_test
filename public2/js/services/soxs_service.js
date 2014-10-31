/* soxs_service.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */


angular.module('angularPassportApp')
  .factory('Blogs', function ($resource) {
    return $resource('api/blogs/:blogId', {
      blogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });