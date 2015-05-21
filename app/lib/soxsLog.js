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
debug_Items.push('load_data');
debug_Items.push('musicController');

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

    log.apicall = function(message) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] -- ' + message;
        console.log(lm.yellow);
    };

    log.funcall = function(message) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] -- ' + message;
        console.log(lm.green);
    };

    log.event = function(message) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] -- ' + message;
        console.log(lm.green);

    };

    log.alert = function(message) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] ---- ' + message;
        console.log(lm.bold.magenta);
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
            console.log(lm.white);
        }
    };

    log.debug_info_end = function(message) {
        if (config.debug_mode && is_debugging(calling_item)) {
            var d = new Date();
            var lm = '[' + d.toISOString() + '] ---- ' + message;
            console.log(lm.white);
        }
    };

    log.data = function(data) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] ---- ' + JSON.stringify(data);
        console.log(lm.cyan);
    }

    log.ds = function(data) {
        var d = new Date();
        var lm = '[' + d.toISOString() + '] ---- ' + JSON.stringify(data);
        console.log(lm.cyan);
    }

    return log;
}
