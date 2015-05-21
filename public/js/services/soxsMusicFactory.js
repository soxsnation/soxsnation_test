/* soxsMusicFactory.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
 *
 */

angular.module('Audio5', []).factory('AudioService', function () {
  "use strict";

  var params = {
    swf_path:'../../../swf/audio5js.swf',
    throw_errors:true,
    format_time:false
  };

  var audio5js = new Audio5js(params);

  return audio5js;
});