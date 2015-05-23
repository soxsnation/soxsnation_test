/* soxsMusicController.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
 *
 */

angular.module('soxsnationApp')
    .controller('soxsMusicController', ['$scope', 'AudioService', '$http',
        function($scope, AudioService, $http) {

            // var params = {
            //     swf_path: '../../../swf/audio5js.swf',
            //     throw_errors: true,
            //     format_time: false
            // };

            // $scope.player = new Audio5js(params);

            $scope.player = AudioService.audio5js;
            // $scope.player.load('/music/ClintEastwood.mp3');
            $scope.filelist = [];
            $scope.songlist = [];
            $scope.playlists = [];
            $scope.current_song = {};
            $scope.current_index = 0;
            $scope.current_playlist = {};
            $scope.player_message = '';
            $scope.song_status = '';
            $scope.current_song_progress = 0;
            $scope.disable_controls = true;
            $scope.playpause_action = 'Play';
            $scope.volume = 50;
            $scope.isPlaying = false;

            $scope.search = '';
            $scope.searchText = '';

            // $scope.player.on('play',
            //     function() {
            //         $scope.player_message = 'Playing: ' + $scope.current_song.file_name;
            //     });

            // $scope.player.on('error',
            //     function(error) {
            //         $scope.player_message = 'ERROR: ' + error;
            //     });

            // $scope.player.on('loadedmetadata',
            //     function(data) {
            //         // $scope.player_message = 'ERROR: ' + error;
            //         // console.log('loadMetadata');
            //         // console.log(data);
            //     });

            // $scope.player.on('canplay',
            //     function() {
            //         $scope.player.play();
            //         // $scope.player_message = 'can play';
            //         $scope.disable_controls = false;
            //     });

            // $scope.player.on('progress',
            //     function(load_percent) {
            //         // console.log('progress: ' + load_percent);
            //         // $scope.player_message = load_percent + ' -Playing: ' + $scope.current_song;
            //     });

            // // $scope.player.on('timeupdate', function(position, duration) {
            // //     var percentage = (position / duration) * 100;
            // //     $scope.current_song_progress = Math.round(percentage * 100) / 100;
            // //     $scope.song_status = Math.round(position) + ' ( ' + Math.round(duration / 60) + ':' + Math.round(duration % 60) + ' )';
            // // });

            // $scope.player.on('timeupdate', function() {
            //     $scope.$apply();
            // });

            // $scope.player.on('ended', function() {
            //     console.log('Song Ended');
            //     $scope.player_message = 'Song Ended';
            //     // start_song($scope.filelist[0]);
            //     $scope.next_song();
            // })

            $scope.volume_changed = function() {
                var v = Number($scope.volume) / 100
                $scope.player_message = v;
                AudioService.volume(v);
            }

            $scope.play_pause = function() {
                console.log('play_pause: ' + $scope.isPlaying)
                if ($scope.isPlaying) {
                    $scope.isPlaying = false;
                    AudioService.pause();
                } else {
                    $scope.isPlaying = true;
                    AudioService.play();
                }
            }

            $scope.next_song = function() {
                if ($scope.current_index >= $scope.songlist.length) {
                	start_song($scope.songlist[0]);
                } else {
                	start_song($scope.songlist[$scope.current_index+1]);
                }
            }

            $scope.seek = function() {
                var seekLoc = $scope.player.position + 30;
                $scope.player_message = 'seek: ' + $scope.player.seekable;
                $scope.player.seek(seekLoc);
            }

            $scope.play = function() {
                $scope.player_message = 'play';
                AudioService.play();
                // $scope.player.play();
            }

            $scope.pause = function() {
                $scope.player_message = 'pause';
                AudioService.pause();
            }

            function getMusicFiles() {
                $http({
                    url: '/music/song',
                    method: 'GET',
                }).then(function(res) {
                    console.log('Got music file list');
                    console.log(res);
                    $scope.songlist = res.data;
                });
            }
            getMusicFiles();

            $scope.refresh_songs = function() {

                $http({
                    url: '/music/populatesongs',
                    method: 'GET',
                }).then(function(res) {
                    console.log('songs refreshed');
                    console.log(res.data);
                    // $scope.songlist = res.data;
                    getMusicFiles();
                });
            }

            $scope.getFileList = function() {
                getMusicFiles();
            }

            function start_song(song) {
                for (var i = 0; i < $scope.songlist.length; ++i) {
                    if ($scope.songlist[i].file_name == song.file_name) {
                        $scope.songlist[i].active = 'active';
                        $scope.current_index = i;
                    } else {
                        $scope.songlist[i].active = '';
                    }
                }

                console.log('Start song: ' + song);
                $scope.current_song = song;
                $scope.isPlaying = true;
                // AudioService.pause();
                // $scope.$apply();
                AudioService.load($scope.current_song.file_name.substring(1));
                $scope.player_message = 'Playing: ' + $scope.current_song.file_name;
            }

            $scope.play_song = function(song) {

                $scope.disable_controls = true;
                start_song(song);

            }

            $scope.create_playlist = function() {
                var playlist = {
                    name: $scope.new_playlist_name,
                    songs: []
                };
                $http({
                    url: '/music/playlist',
                    method: 'POST',
                    data: playlist
                }).then(function(res) {
                    console.log('Got music file list');
                    console.log(res);
                    $scope.new_playlist_name = '';
                    get_playlists();
                });
            }

            function get_playlists() {
                $http({
                    url: '/music/playlist',
                    method: 'GET',
                }).then(function(res) {
                    console.log('Got playlist');
                    console.log(res);
                    $scope.playlists = res.data;
                });
            }
            get_playlists();

            function loadPlaylist(playlistId) {
                $http({
                    url: '/music/loadplaylist/' + playlistId,
                    method: 'GET',
                }).then(function(res) {
                    console.log('loaded playlist');
                    console.log(res.data);
                    $scope.current_playlist = res.data;
                    $scope.songlist = res.data.songs;
                });
            }

            function savePlaylist(playlist) {
                $http({
                    url: '/music/playlist',
                    method: 'PUT',
                    data: playlist
                }).then(function(res) {
                    console.log('loaded playlist');
                    console.log(res.data);
                    loadPlaylist(res.data._id);
                });
            }

            $scope.load_all_songs = function() {
                getMusicFiles();
            }

            $scope.load_playlist = function(playlistId) {
                loadPlaylist(playlistId);
            }

            $scope.add_to_playlist = function(playlistId) {
                console.log('add_to_playlist: ' + playlistId);
                for (var i = 0; i < $scope.playlists.length; ++i) {
                    if ($scope.playlists[i]._id === playlistId) {
                        $scope.playlists[i].songs.push($scope.current_song._id);
                        savePlaylist($scope.playlists[i]);
                    }
                }

            }

            $scope.search_songs = function() {
                console.log($scope.searchText);
                // $scope.search.name = $scope.searchText;
                // $scope.search.artist = $scope.searchText;
                for (var i = 0; $scope.songlist.length; ++i) {
                    if ($scope.songlist[i].name.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) {
                        $scope.songlist[i].displayed = true;
                    } else if ($scope.songlist[i].artist.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) {
                        $scope.songlist[i].displayed = true;
                    } else {
                        $scope.songlist[i].displayed = false;
                    }
                }
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
