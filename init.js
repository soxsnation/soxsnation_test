/* init.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/20/2015
 *
 */

var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/config');

// var env = 'development';
// var connect = function() {
// 	var options = {
// 		server: {
// 			socketOptions: {
// 				keepAlive: 1
// 			}
// 		}
// 	}

// 	mongoose.connect('mongodb://' + config.server + config[env].db, options);
// }
// connect()

// // Error handler
// mongoose.connection.on('error', function(err) {
// 	console.log(err)
// });

// // Reconnect when closed
// mongoose.connection.on('disconnected', function() {
// 	connect()
// });

// var models_path = __dirname + '/app/models';
// fs.readdirSync(models_path).forEach(function(file) {
// 	if (~file.indexOf('.js')) require(models_path + '/' + file)
// });


// var commands = require('./init/init_controller');
// // commands.get_all_schemas();
// commands.copy_database('test_import', 'test_import2');

var db_commands = require('./init/init_mongo');

db_commands.copy_database('test_import', 'soxsnation_empty2');

return;