/* musicController.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
 */

/**
 * musicController module.
 * @module musicController
 */


var fs = require('fs');

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

/**
 * Gets songs from db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.getSongs = function(req, res, next) {
    console.log('exports.getSongs');
    res.send(200);
}

/**
 * Gets playlists from db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.getPlaylists = function(req, res, next) {
    console.log('exports.getSongs');
    res.send(200);
}

/**
 * Inserts songs to db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.insertSongs = function(req, res, next) {
    console.log('exports.insertSongs');
    res.send(200);
}

/**
 * Inserts playlists to db
 * @param {request} req The request.
 * @param {response} res The response.
 * @param {next} next The next.
 */
exports.insertPlaylists = function(req, res, next) {
    console.log('exports.insertPlaylists');
    res.send(200);
}
