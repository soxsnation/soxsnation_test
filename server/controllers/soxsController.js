/* soxsController.js
 *
 * Author(s):  Andrew Brown
 * Date:       8/1/2014
 *
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soxsSchema = mongoose.model('soxsSchema');



function getSchema(schemaType, cb) {
	var currentSchemas = mongoose.modelNames();
	console.log(currentSchemas);
	if (currentSchemas.indexOf(schemaType) != -1) {
		cb(null, mongoose.model(schemaType));
	} else {

		soxsSchema.findOne({
			name: schemaType
		}).exec(function(err, ss) {
			if (err) {
				cb(err, null);
			}
			if (!ss || ss == null) {
				cb('Failed to load soxsSchema ' + schemaType, null);
			}

			console.log('Got soxsSchema for: ' + schemaType);
			console.log(ss.fields)
			// var customSchema = new Schema(eval(ss.fields));
			// var schemaObj = JSON.parse('{"name":"String", "description":"String", "complete":"Boolean"}');
			// console.log(schemaObj);
			var customSchema = new Schema(JSON.parse(ss.fields));

			cb(null, mongoose.model(schemaType, customSchema));
		})
	}
}



exports.create = function(req, res, next) {
	console.log('soxsController.create');
	console.log(req.body);
	var schemaType = req.params.type;
	getSchema(schemaType, function(err, customModel) {
		if (err) {
			res.send(404);
		} else {
			var sch = new customModel(req.body);
			sch.save(function(err) {
				if (err) {
					console.log(err);
					return res.send(403);
				} else {
					return res.json(sch);
				}
			})
		}
	})
}

exports.insert = function(req, res, next) {
	console.log('soxsController.insert');
	console.log(req.body);
	getSchema(req.params.type, function(err, customModel) {
		if (err) {
			res.send(404);
		} else {
			console.log('got customModel');
			var record = new customModel(req.body);
			console.log('populated customModel');
			record.save(function(err, rec) {
				if (err) {
					return res.send(403);
				} else {
					return res.json(rec);
				}
			})
		}
	})
}


exports.get = function(req, res, next) {
	console.log('soxsController.get');
	getSchema(req.params.type, function(err, customModel) {
		if (err) {
			res.send(404);
		} else {
			customModel.findOne({
				_id: req.params.id
			}).exec(function(err, modelData) {
				if (err) {
					return next(err);
				}
				if (!modelData) {
					return next(new Error('Failed to load ' + req.params.type));
				}
				res.json(modelData);
			})
		}
	})
}

exports.getall = function(req, res, next) {
	console.log('soxsController.get');
	getSchema(req.params.type, function(err, customModel) {
		if (err) {
			res.send(404);
		} else {
			customModel.find({}).exec(function(err, models) {
				if (err) {
					return next(err);
				}
				if (!models) {
					return next(new Error('Failed to load models: ' + req.params.type));
				}

				res.json(models);
			})
		}
	})
}