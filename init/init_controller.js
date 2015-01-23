/* init_controller.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/22/2015
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soxsSchema = mongoose.model('soxsSchema');

// var config = require('./config/config');
// var Db = require('mongodb').Db;
// var Server = Server = require('mongodb').Server;

// var mailer = require('../lib/mailer');


// module.exports = function() {


// 	var commands = {
// 		get_schemas: {}
// 	};

// 	commands.get_schemas.all = function() {
// 		var currentSchemas = mongoose.modelNames();

// 		console.log('current schema count: ' + currentSchemas.length);
// 		console.log(currentSchemas);

// 		// var s = mongoose.model('links');
// 		// console.log('s: ' + s);
// 	}

// 	return commands;
// }

// exports.copy_database = function(old_db, new_db) {
// 	var db = new Db('test', new Server('server.soxsnation.com', 27017));
// 	// Establish connection to db
// 	db.open(function(err, db) {
// 		if (err) {
// 			console.log('Counld not open database');
// 		}

// 		// get the admin database
// 		var admin_db = db.admin();
// 		admin_db.command({
// 			copydb: 1,
// 			fromdb: old_db,
// 			todb: new_db
// 		}, function(err, result) {
// 			if (err) {
// 				console.log('Error copying database: ' + err);
// 			} else {
// 				console.log('Database copied successfully');
// 			}
// 		});

// 	});

// };


exports.get_all_schemas = function() {
	var currentSchemas = mongoose.modelNames();


	soxsSchema.find({}).exec(function(err, models) {
		if (err) {
			console.log('err: ' + err);
			return next(err);
		}
		if (!models) {
			console.log('Failed to load models');
			return next(new Error('Failed to load models: ' + req.params.type));
		}
		// console.log('model:' + typeof models[1]);
		for (var i = 0; i < models.length; ++i) {
			currentSchemas.push(models[i].name);

			// var customSchema = new Schema(models[i]);
			// mongoose.model(models[i].name, customSchema)
			soxsSchema.findOne({
				name: models[i].name
			}).exec(function(err, ss) {
				if (err) {
					// cb(err, null);
				}
				if (!ss || ss == null) {
					// cb('Failed to load soxsSchema ' + models[i].name, null);
				}

				console.log('Got soxsSchema for: ' + models[i].name);
				console.log(ss);
				// var customSchema = new Schema(eval(ss.fields));
				// var schemaObj = JSON.parse('{"name":"String", "description":"String", "complete":"Boolean"}');
				// console.log(schemaObj);
				var customSchema = new Schema(JSON.parse(ss.fields));

				mongoose.model(models[i].name, customSchema);
			})

		}
		// console.log('model count: ' + mongoose.modelNames().length);
		console.log('current schema count: ' + currentSchemas.length);
		console.log(currentSchemas);

	});
}