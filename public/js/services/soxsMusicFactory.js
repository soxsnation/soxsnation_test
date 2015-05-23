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

    // var audio5js = new Audio5js(params);

    var audioReady = function() {
        //this points to the Audio5js instance
        this.on('play', function() {
            console.log('play');
        }, this);
        this.on('pause', function() {
            console.log('pause');
        }, this);
        this.on('ended', function() {
            console.log('ended');
        }, this);

        // timeupdate event passes audio
        // duration and position to callback
        this.on('timeupdate', function(position, duration) {
            console.log(duration, position);
        }, this);

        // progress event passes load_percent to callback
        this.on('progress', function(load_percent) {
            // console.log(load_percent);
        }, this);

        //error event passes error object to callback
        this.on('error', function(error) {
            console.log(error.message);
        }, this);
    }

    // var audio5js = {};
    var audio5js = new Audio5js({
        swf_path: '../../../swf/audio5js.swf',
        throw_errors: true,
        format_time: false
    });


    // var audio5js = new Audio5js({
    //     swf_path: './swf/audio5js.swf',
    //     codecs: ['mp4', 'vorbis', 'mp3'],
    //     ready: function(player) {
    //         var audio_url;
    //         switch (player.codec) {
    //             case 'mp4':
    //                 audio_url = '/audio/song.mp4';
    //                 break;
    //             case 'vorbis':
    //                 audio_url = '/audio/song.ogg';
    //                 break;
    //             default:
    //                 audio_url = '/audio/song.mp3';
    //                 break;
    //         }
    //         this.load(audio_url);
    //         this.play();
    //     }
    // });

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    function play() {
        audio5js.play();
    }

    function pause() {
        audio5js.pause();
    }

    function load(filename) {
        // if (audio5js.hasOwnProperty(('volume'))) { audio5js.destroy(); }
        // var audioReady = function() {
        //     this.load(filename);
        // }
        // audio5js.ready = audioReady;
        // audio5js = new Audio5js({
        //     ready: audioReady
        // });

        audio5js.load(filename);
        audio5js.play();
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
