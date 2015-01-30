/* soxsLog.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/29/2015
 *
 */

var colors = require('colors');


exports.event = function(message) {
	var d = new Date();
	var lm = '[' + d.toISOString() + '] -- ' + message;
	console.log(lm.green);

}

exports.error = function(message) {
	var d = new Date();
	var lm = '[' + d.toISOString() + '] -- ' + message;
	console.log(lm.bold.red);

}

exports.data = function(data) {
	console.log(data.cyan);
}