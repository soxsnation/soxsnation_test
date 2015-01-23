/* init_mongo.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/22/2015
 *
 */


var config = require('../config/config');
var Db = require('mongodb').Db;
var Server = Server = require('mongodb').Server;

exports.copy_database = function(old_db, new_db) {
	var db = new Db('test', new Server(config.server, config.port));
	// Establish connection to db
	db.open(function(err, db) {
		if (err) {
			console.log('Counld not open database');
			return;
		}

		// get the admin database
		var admin_db = db.admin();
		admin_db.command({
			copydb: 1,
			fromdb: old_db,
			todb: new_db
		}, function(err, result) {
			if (err) {
				console.log('Error copying database: ' + err);
				return;
			} else {
				console.log('Database copied successfully');
			}
			db.close();
			return;
		});

	});

};