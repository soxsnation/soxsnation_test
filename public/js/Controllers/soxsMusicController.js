/* soxsMusicController.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
 *
 */

angular.module('soxsnationApp')
    .controller('soxsMusicController', ['$scope', 'AudioService', '$http',
        function($scope, AudioService, $http) {

            $scope.player = AudioService;
            // $scope.player.load('/music/ClintEastwood.mp3');
            $scope.filelist = {};
            $scope.current_song = 'ClintEastwood.mp3';
            $scope.player_message = '';
            $scope.song_status = '';
            $scope.current_song_progress = 0;
            $scope.disable_controls = true;

            $scope.player.on('play',
                function() {
                    $scope.player_message = 'Playing: ' + $scope.current_song;
                });

            $scope.player.on('error',
                function(error) {
                    $scope.player_message = 'ERROR: ' + error;
                });

            $scope.player.on('loadedmetadata',
                function(data) {
                    // $scope.player_message = 'ERROR: ' + error;
                    // console.log('loadMetadata');
                    // console.log(data);
                });

            $scope.player.on('canplay',
                function() {
                	$scope.player.play();
                    // $scope.player_message = 'can play';
                    $scope.disable_controls = false;
                });

            $scope.player.on('progress',
                function(load_percent) {
                    // console.log('progress: ' + load_percent);
                    // $scope.player_message = load_percent + ' -Playing: ' + $scope.current_song;
                });

            $scope.player.on('timeupdate', function(position, duration) {
                // var c_position = Number(position.substring(3)) + Number(position.substring(0, 2) * 60);
                var percentage = (position / duration) * 100;
                // $scope.player_message = position + ' :: ' + duration + ' :: ' + c_position + '  -- ' + percentage;
                $scope.current_song_progress = percentage;
                $scope.song_status = Math.round(position) + ' ( ' + Math.round(duration / 60) + ':' + Math.round(duration % 60) + ' )';
                //    console.log('timeupdate: ' + c_duration + ' : ' + c_position + ' : ' + percentage);
            });

            $scope.player.on('timeupdate', function() {
                $scope.$apply();
            });

            $scope.player.on('ended', function() {
                console.log('Song Ended');
                $scope.player_message = 'Song Ended';
                start_song($scope.filelist[2]);
            })

            $scope.seek = function() {
                var seekLoc = $scope.player.position + 30;
                $scope.player_message = 'seek: ' + $scope.player.seekable;
                $scope.player.seek(seekLoc);
            }

            $scope.play = function() {
                $scope.player_message = 'play';
                $scope.player.play();
            }

            $scope.pause = function() {
                $scope.player_message = 'pause';
                $scope.player.pause();
            }

            function getMusicFiles() {
                $http({
                    url: '/music/song',
                    method: 'GET',
                }).then(function(res) {
                    console.log('Got music file list');
                    console.log(res);

                    // for (var i = 0; i < res.length; ++i) {

                    // }


                    $scope.filelist = res.data;

                });
            }
            getMusicFiles();

            $scope.getFileList = function() {
                getMusicFiles();
            }

            function start_song(song) {
                console.log('Start song: ' + song);
                $scope.current_song = song.substring(1);
                $scope.player.load($scope.current_song);
                $scope.player_message = 'Playing: ' + $scope.current_song;
            }

            $scope.play_song = function(song) {
                $scope.disable_controls = true;

                for (var i = 0; i < $scope.filelist.length; ++i) {
                    if ($scope.filelist[i].file_name == song) {
                        $scope.filelist[i].active = 'active';
                    } else {
                        $scope.filelist[i].active = '';
                    }
                }

                start_song(song);

            }

        }
    ]);

// var soxsMusicController = function($scope, $http, AudioService) {
// $scope.player = AudioService;
//             $scope.player.load('/music/ClintEastwood.mp3');
//             $scope.filelist = {};

//             $scope.player.on('timeupdate', function() {
//                 $scope.$apply();
//             });
// 	}
