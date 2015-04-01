/* soxsLog.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/29/2015
 *
 */

var colors = require('colors');
var config = require('../../config/config');

var debug_Items = [];
debug_Items.push('soxController');
debug_Items.push('soxsController');
debug_Items.push('soxsDataController');
debug_Items.push('snController');

function is_debugging(item) {
    for (var i = 0; i < debug_Items.length; ++i) {
        if (debug_Items[i] == item) {
            return true;
        }
    }
    return false;
}

module.exports = function(calling_item) {
    var log = {};
    log.event = function(message) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] -- ' + message;
        console.log(lm.green);

    };

    log.error = function(message) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] -- ' + message;
        console.log(lm.bold.red);

    };

    log.debug_info = function(message) {
        if (config.debug_mode && is_debugging(calling_item)) {
            var d = new Date();
            var lm = '[' + d.toISOString() + '] -- ' + message;
            console.log(lm.cyan);
        }
    };

    log.debug_info_start = function(message) {
        if (config.debug_mode && is_debugging(calling_item)) {
            var d = new Date();
            var lm = '[' + d.toISOString() + '] ---- ' + message;
            console.log(lm.green);
        }
    };

    log.debug_info_end = function(message) {
        if (config.debug_mode && is_debugging(calling_item)) {
            var d = new Date();
            var lm = '[' + d.toISOString() + '] ---- ' + message;
            console.log(lm.green);
        }
    };

    log.data = function(data) {
        console.log(data.cyan);
    }

    return log;
}
