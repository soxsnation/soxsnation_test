/* soxsDataController.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/15/2015
 *
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soxsSchema = mongoose.model('soxsSchema');
var soxsType = mongoose.model('soxsType');
var mailer = require('../lib/mailer');
var soxsLog = require('../lib/soxsLog');

function parse_schema_fieldItems(schema, cb) {

	soxsLog.event('parse_schema_fieldItems: ' + schema.name);
	var fieldItems = JSON.parse(schema.fieldItems);
	get_types(function(err, types) {
		var fields = new Object();
		if (err) {
			soxsLog.error("ERROR getting types: " + err);
			cb(null);
		} else {
			for (var i = 0; i < fieldItems.length; ++i) {
				var item_type = "54b9814af5769f302c317aeb";
				if (fieldItems[i].hasOwnProperty('type_id')) {
					item_type = fieldItems[i].type_id;
				}
				// console.log('Looking for item: ' + JSON.stringify(fieldItems[i]));
				for (var j = 0; j < types.length; ++j) {
					// console.log('----Checking type: ' + JSON.stringify(types[j]));
					if (item_type == types[j]._id) {
						// console.log('Found: ' + fieldItems[i].name + ' ' + types[j].type);
						fields[fieldItems[i].name] = types[j].type;
						break;
					}
				}
			}
			// console.log("parsed fieldItems:");
			soxsLog.data(JSON.stringify(fields));
			cb(fields);
		}
	})
}

function get_type(type_id, cb) {
	// console.log('get_type: ' + type_id);
	soxsType.findOne({
		_id: type_id
	}).exec(function(err, soxsDataType) {
		if (err) {
			return cb(err, null);
		}
		if (!soxsDataType) {
			return cb(Error('Failed to load soxsType: ' + type_id), null);
		}
		return cb(null, soxsDataType);

	})
}

function get_types(cb) {
	soxsType.find({}).exec(function(err, types) {
		if (err) {
			return cb(err, null);
		}
		if (!types) {
			return cb(new Error('Failed to load types: ' + req.params.type), null);
		}
		return cb(null, types);
	});
}

function getSchema(schemaType, cb) {
	soxsLog.event('getSchema: ' + schemaType);
	var currentSchemas = mongoose.modelNames();
	// console.log(currentSchemas);
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

			parse_schema_fieldItems(ss, function(data) {
				var customSchema = new Schema(data);
				// var customSchema = new Schema(JSON.parse(ss.fields));
				cb(null, mongoose.model(schemaType, customSchema));
			});

			// console.log('Got soxsSchema for2: ' + schemaType);
			// console.log(ss);
			// var customSchema = new Schema(eval(ss.fields));
			// var schemaObj = JSON.parse('{"name":"String", "description":"String", "complete":"Boolean"}');
			// console.log(schemaObj);

		})
	}
}

exports.archive = function(req, res, next) {
	soxsLog.event('soxsDataController.archive: ' + req.params.id);
	soxsSchema.findOne({
		_id: req.params.id
	}).exec(function(err, soxsData) {
		if (err) {
			return next(err);
		}
		if (!soxsData) {
			return next(new Error('Failed to load soxsSchema'));
		}
		soxsData.update(req.body, function(err, data) {
			if (err) {
				res.send(404);
			} else {
				res.send(200);
			}
		})
	})
}

exports.delete = function(req, res, next) {
	soxsLog.event("exports.delete: " + req.params.type)
	getSchema(req.params.type, function(err, customModel) {
		if (err) {
			res.send(404);
		} else {
			customModel.remove({
					_id: req.params.id
				}, function() {
					res.send(200);
				})
				// customModel.remove({
				// 	_id: req.params.id
				// }).exec(function(err, modelData) {
				// 	if (!err) {
				// 		res.send(407);
				// 	} else {
				// 		res.send(200);
				// 	}
				// })
		}
	})
}

exports.get_types = function(req, res, next) {
	soxsLog.event('soxsController.get_types');
	soxsSchema.find({}).exec(function(err, models) {
		if (err) {
			return next(err);
		}
		if (!models) {
			return next(new Error('Failed to load models: ' + req.params.type));
		}

		return res.json(models);
	});
}

exports.get_type_by_name = function(req, res, next) {
	soxsLog.event('get_type_by_name: ' + req.params.type);
	soxsSchema.findOne({
		name: req.params.type
	}).exec(function(err, model) {
		if (err) {
			return next(err);
		}
		if (!model) {
			return next(new Error('Failed to load models: ' + req.params.type));
		}

		return res.json(model);
	});
}



exports.insert = function(req, res, next) {
	// console.log('soxsController.insert');
	soxsLog.data(req.body);
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

exports.update = function(req, res, next) {
	soxsLog.event('soxsController.update');
	mailer.sendMail('updating soxs object', 'updating soxs object message', function(messageSent) {
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
					modelData.update(req.body, function(err, data) {
						if (err) {
							res.send(404);
						} else {
							res.send(200);
						}
					})
				})
			}
		})
	})

}


exports.get = function(req, res, next) {
	soxsLog.event('soxsController.get: ' + req.params.id);
	// console.log('soxsController.get: ' + req.params.id);
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
	soxsLog.event('soxsController.getall');
	soxsLog.error('soxsController.getall');
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