/* musicController.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/20/2015
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

exports.getFileList = function(req, res, next) {
console.log('exports.getFileList');

	res.json(getFiles('./music/'));

}