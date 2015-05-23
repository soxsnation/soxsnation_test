/* musicController.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
 */

/**
 * musicController module.
 * @module musicController
 */

var mongoose = require('mongoose');
var songSchema = mongoose.model('soxs.Music.Song');
var playlistSchema = mongoose.model('soxs.Music.Playlist');
var fs = require('fs');
var id3 = require('id3js');
var Promise = require('promise');

var soxsLog = require('../lib/soxsLog')('musicController');

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

/**
 * Gets a list of all the files
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.getFileList = function(req, res, next) {
    console.log('exports.getFileList');

    res.json(getFiles('./music/'));

}

function getSongDataById(id, cb) {
    songSchema.findById(id).exec(function(err, data) {
        if (err) {
            soxsLog.error('getSongs: ' + err);
            cb(err, null);
        } else {
            cb(null, data);
        }
    })
}

/**
 * Gets songs from db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.getSongs = function(req, res, next) {
    console.log('exports.getSongs');
    var query = {};
    songSchema.find(query).exec(function(err, data) {
        if (err) {
            soxsLog.error('getSongs: ' + err);
            res.send(406);
        } else {
            res.json(data);
        }
    })
}

function populate_song_info(song_file, cb) {
    id3({
        file: song_file,
        type: id3.OPEN_LOCAL
    }, function(err, tags) {
        if (err) {
            soxsLog.error('getSongInfo: ' + err);
        }
        cb(err, tags);
    });
}

exports.getSongInfo = function(req, res, next) {
    console.log('exports.getSongInfo');
    getSongDataById(req.params.id, function(err, songData) {
        if (err) {
            res.send(403);
        } else {
            populate_song_info(songData.file_name, function(err, tags) {
                if (err) {
                    soxsLog.error('getSongInfo: ' + err);
                    soxsLog.debug_info(songData.file_name);
                    res.send(406)
                } else {
                    res.json(tags);
                }
            });
        }
    });
}

function getSongDataById_async(id) {
    return new Promise(function(fulfill, reject) {
        songSchema.findById(id).exec(function(err, data) {
            if (err) {
                soxsLog.error('getSongs: ' + err);
                reject(err);
            } else {
                fulfill(data);
            }
        })
    });
}

/**
 * Loads playlists from db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.loadPlaylists = function(req, res, next) {
    console.log('exports.loadPlaylists');

    playlistSchema.findById(req.params.id).exec(function(err, data) {
        if (err) {
            soxsLog.error('getSongs: ' + err);
            res.send(406)
        } else {
            var playlist = {
                name: data.name,
                songs: []
            }
            Promise.all(data.songs.map(getSongDataById_async)).done(function(song_list) {
                playlist.songs = song_list;
                res.json(playlist);
            })
        }
    })
}

/**
 * Gets playlists from db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.getPlaylists = function(req, res, next) {
    console.log('exports.getPlaylists');
    var query = {};
    playlistSchema.find(query).exec(function(err, data) {
        if (err) {
            soxsLog.error('getSongs: ' + err);
            res.send(406)
        } else {
            res.json(data);
        }
    });
}

/**
 * Inserts songs to db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.insertSongs = function(req, res, next) {
    console.log('exports.insertSongs');
    songSchema.create(req.body, function(err, data) {
        if (err) {
            soxsLog.error('insertSongs: ' + err);
            res.json(420);
        } else {
            res.json(data);
        }
    });
}

/**
 * Inserts playlists to db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.insertPlaylists = function(req, res, next) {
    console.log('exports.insertPlaylists');
    playlistSchema.create(req.body, function(err, data) {
        if (err) {
            soxsLog.error('insertSongs: ' + err);
            res.json(420);
        } else {
            res.json(data);
        }
    });
}

/**
 * Updates playlists to db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.updatePlaylists = function(req, res, next) {
    console.log('exports.updatePlaylists');
    playlistSchema.findByIdAndUpdate(req.body._id, req.body, function(err, data) {
        if (err) {
            res.send(406);
        } else {
            res.json(data);
        }
    })
}

function addSongData(songData) {

    songSchema.create(songData, function(err, data) {
        if (err) {
            soxsLog.error('insertSongs: ' + err);
            // res.json(420);
        } else {
            // res.json(data);
        }
    });
}

function populate_song_data(song_file) {
    return new Promise(function(fulfill, reject) {
        id3({
            file: song_file,
            type: id3.OPEN_LOCAL
        }, function(err, tags) {
            if (err) {
                soxsLog.error('populate_song_data: ' + err);
                reject(err);
            }
            var song = {
                name: tags.title,
                file_name: song_file,
                album: (tags.hasOwnProperty('album') ? tags.album : ''),
                artist: tags.artist,
                // track: tags.v2.track,
                // track: Number(tags.v2.track.split('/')[0]),
                // album_tracks: Number(tags.v2.track.split('/')[1]),
                genre: tags.v2.genre
            }
            fulfill(song);
        });
    });
}

function store_song_data(song_data) {
    return new Promise(function(fulfill, reject) {
        songSchema.find({
            name: song_data.name,
            artist: song_data.artist
        }).exec(function(err, data) {
            if (err) {
                soxsLog.error('store_song_data: ' + err);
                reject(err);
            } else {
                if (data && data.hasOwnProperty('name') && data.name == song_data.name) {
                	soxsLog.debug_info('Song already exists: ' + song_data.name);
                    fulfill(data);
                } else {
                	soxsLog.debug_info('Adding song: ' + song_data.name);
                    songSchema.create(song_data, function(err, data) {
                        if (err) {
                            soxsLog.error('store_song_data: ' + err);
                            reject(err);
                        } else {
                            fulfill(data);
                        }
                    });
                }
            }
        });

    });
}

function parse_directory(dir) {
    var songs = getFiles(dir);

    Promise.all(songs.map(populate_song_data)).done(function(song_list) {

    })


}

exports.populatesongs = function(req, res, next) {
    console.log('exports.populatesongs');
    var songs = getFiles('./music_repo/');
    console.log('got songs');

    Promise.all(songs.map(populate_song_data)).done(function(song_list) {
        var songlist = [];
        for (var i = 0; i < song_list.length; ++i) {
            if (song_list[i].name != null) {
                songlist.push(song_list[i]);
            }
        }
        Promise.all(songlist.map(store_song_data)).done(function(song_data_list) {

            res.json(song_data_list);
        })
    });


}
