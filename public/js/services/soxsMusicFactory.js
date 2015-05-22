/* soxsMusicFactory.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
 *
 */

angular.module('Audio5', []).factory('AudioService', function() {
    "use strict";

    var params = {
        swf_path: '../../../swf/audio5js.swf',
        throw_errors: true,
        format_time: false
    };

    var audio5js = new Audio5js(params);


    function play() {
        audio5js.play();
    }

    function pause() {
        audio5js.pause();
    }

    function load(filename) {
        audio5js.load(filename);
    }

    function volume(level) {
        audio5js.volume(level);
    }

    return {
        audio5js: audio5js,
        play: play,
        pause: pause,
        load: load,
        volume: volume
    }


});
