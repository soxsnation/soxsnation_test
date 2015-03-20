/* soxsController.js
 *
 * Author(s):  Andrew Brown
 * Date:       8/1/2014
 *
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soxsSchema = mongoose.model('soxsSchema');
var soxsType = mongoose.model('soxsType');
var soxsTemplate = mongoose.model('soxsTemplate');
var mailer = require('../lib/mailer');

function parse_schema_fieldItems(schema, cb) {
	
	var fields = [];

	for (var i = 0; i < schema.fieldItems.length; ++i) {
		get_type(schema.fieldItems[i].type_id, function(err, data) {
			if (err) {
				console.log('ERROR Getting fieldType: ' + err);
			} else {
				fields[schema.fieldItems[i].name] = data.type;
			}
		})
	}
	console.log("parsed fieldItems:");
	console.log(fields);

	cb( fields);
}

function getSchema(schemaType, cb) {
	console.log('getSchema: ' + schemaType);
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

			});

			console.log('Got soxsSchema for: ' + schemaType);
			console.log(ss);
			var o = JSON.parse(ss.fields);
			console.log('JSON:');
			console.log(o);
			// var customSchema = new Schema(eval(ss.fields));
			// var schemaObj = JSON.parse('{"name":"String", "description":"String", "complete":"Boolean"}');
			// console.log(schemaObj);
			var customSchema = new Schema(JSON.parse(ss.fields));

			cb(null, mongoose.model(schemaType, customSchema));
		})
	}
}

function get_fields_for_schema(schema) {

	var fields = {};

	for (var i = 0; i < schema.fieldItems.length; ++i) {
		
		get_type(schema.fieldItems[i].type_id, function(err, type_data) {
			fields[schema.fieldItems[i].name] = type_data.type;
		});
	}
	return fields;
}
 

exports.createSoxsSchema = function(req, res, next) {
	console.log('soxsController.createSoxsSchema');
	console.log(req.body);
	console.log('');
	// var buf = new Buffer(JSON.stringify(req.body)).toString('base64');
	// console.log(buf);
	// var buf2 = new Buffer(buf, 'base64');
	// console.log(buf2.toString('utf8'));



	var sch = new soxsSchema(req.body);
	sch.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(403);
		} else {
			getSchema(req.body.name, function(err, customModel) {
					if (err) {
						res.send(404);
					} else {
						console.log('got customModel');
						var obj = {
							active: true,
							archived: false,
							userModified: 'soxsnation'
						}
						var record = new customModel(obj);
						console.log('populated customModel');
						record.save(function(err, rec) {
							if (err) {
								return res.send(403);
							} else {
								return res.json(sch);
							}
						})
					}
				})
				// return res.json(sch);
		}
	});
}



exports.updateSoxsSchema = function(req, res, next) {
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

exports.getSchema = function(req, res, next) {
	console.log('exports.getSchema');
	res.send(200);
}

exports.getSchemas = function(req, res, next) {
	console.log('exports.getSchemas');
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

exports.getTemplate = function(req, res, next) {
	console.log('exports.getTemplate');
	res.send(200);
}

exports.getTemplates = function(req, res, next) {
	console.log('exports.getTemplates');
	soxsTemplate.find({}).exec(function(err, models) {
		if (err) {
			return next(err);
		}
		if (!models) {
			return next(new Error('Failed to load models: ' + req.params.type));
		}

		return res.json(models);
	});
}

exports.createSoxsTemplate = function(req, res, next) {
	console.log('exports.createSoxsTemplate');
	console.log(JSON.stringify(req.body));
	var sch = new soxsTemplate(req.body);
	sch.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(403);
		} else {
			res.send(200);
		}
	})
}

/*****************************************************************************************
 * soxsTypes
 *****************************************************************************************/

exports.createType = function(req, res, next) {
	console.log('exports.createType');
	var sch = new soxsType(req.body);
	sch.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(403);
		} else {
			res.send(200);
		}
	})
}

exports.updateType = function(req, res, next) {
	console.log('exports.updateType');
	soxsType.findOne({
		_id: req.params.id
	}).exec(function(err, soxsDataType) {
		if (err) {
			return next(err);
		}
		if (!soxsDataType) {
			return next(new Error('Failed to load soxsSchema'));
		}
		soxsDataType.update(req.body, function(err, data) {
			if (err) {
				res.send(404);
			} else {
				res.send(200);
			}
		})
	})
}

function get_type(type_id, cb) {
	soxsType.findOne({
		_id: type_id
	}).exec(function(err, soxsDataType) {
		if (err) {
			return cb(err, null);
		}
		if (!soxsDataType) {
			return cb(Error('Failed to load soxsSchema'), null);
		}
		return cb(null, soxsDataType);
		
	})
}

exports.getType = function(req, res, next) {
	console.log('exports.getType');
	soxsType.findOne({
		_id: req.params.id
	}).exec(function(err, soxsDataType) {
		if (err) {
			return next(err);
		}
		if (!soxsDataType) {
			return next(new Error('Failed to load soxsSchema'));
		}
		return res.json(soxsDataType);
		
	})
}

exports.getTypes = function(req, res, next) {
	// console.log('exports.getTypes');
	soxsType.find({}).exec(function(err, types) {
		if (err) {
			return next(err);
		}
		if (!types) {
			return next(new Error('Failed to load types: ' + req.params.type));
		}

		return res.json(types);
	});
}

// exports.archive = function(req, res, next) {
// 	soxsSchema.findOne({
// 		_id: req.params.id
// 	}).exec(function(err, soxsData) {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!soxsData) {
// 			return next(new Error('Failed to load soxsSchema'));
// 		}
// 		soxsData.update(req.body, function(err, data) {
// 			if (err) {
// 				res.send(404);
// 			} else {
// 				res.send(200);
// 			}
// 		})
// 	})
// }

// exports.delete = function(req, res, next) {
// 	console.log("exports.delete: " + req.params.type)
// 	getSchema(req.params.type, function(err, customModel) {
// 		if (err) {
// 			res.send(404);
// 		} else {
// 			customModel.remove({
// 					_id: req.params.id
// 				}, function() {
// 					res.send(200);
// 				})
// 				// customModel.remove({
// 				// 	_id: req.params.id
// 				// }).exec(function(err, modelData) {
// 				// 	if (!err) {
// 				// 		res.send(407);
// 				// 	} else {
// 				// 		res.send(200);
// 				// 	}
// 				// })
// 		}
// 	})
// }

// exports.get_types = function(req, res, next) {
// 	// console.log('soxsController.get_types');
// 	soxsSchema.find({}).exec(function(err, models) {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!models) {
// 			return next(new Error('Failed to load models: ' + req.params.type));
// 		}

// 		return res.json(models);
// 	});
// }

// exports.get_type_by_name = function(req, res, next) {
// 	soxsSchema.findOne({
// 		name: req.params.type
// 	}).exec(function(err, model) {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!model) {
// 			return next(new Error('Failed to load models: ' + req.params.type));
// 		}

// 		return res.json(model);
// 	});
// }



// exports.insert = function(req, res, next) {
// 	// console.log('soxsController.insert');
// 	console.log(req.body);
// 	getSchema(req.params.type, function(err, customModel) {
// 		if (err) {
// 			res.send(404);
// 		} else {
// 			console.log('got customModel');
// 			var record = new customModel(req.body);
// 			console.log('populated customModel');
// 			record.save(function(err, rec) {
// 				if (err) {
// 					return res.send(403);
// 				} else {
// 					return res.json(rec);
// 				}
// 			})
// 		}
// 	})
// }

// exports.update = function(req, res, next) {
// 	console.log('soxsController.update');
// 	mailer.sendMail('updating soxs object', 'updating soxs object message', function(messageSent) {
// 		getSchema(req.params.type, function(err, customModel) {
// 			if (err) {
// 				res.send(404);
// 			} else {
// 				customModel.findOne({
// 					_id: req.params.id
// 				}).exec(function(err, modelData) {
// 					if (err) {
// 						return next(err);
// 					}
// 					if (!modelData) {
// 						return next(new Error('Failed to load ' + req.params.type));
// 					}
// 					modelData.update(req.body, function(err, data) {
// 						if (err) {
// 							res.send(404);
// 						} else {
// 							res.send(200);
// 						}
// 					})
// 				})
// 			}
// 		})
// 	})

// }


// exports.get = function(req, res, next) {
// 	// console.log('soxsController.get');
// 	getSchema(req.params.type, function(err, customModel) {
// 		if (err) {
// 			res.send(404);
// 		} else {
// 			customModel.findOne({
// 				_id: req.params.id
// 			}).exec(function(err, modelData) {
// 				if (err) {
// 					return next(err);
// 				}
// 				if (!modelData) {
// 					return next(new Error('Failed to load ' + req.params.type));
// 				}
// 				res.json(modelData);
// 			})
// 		}
// 	})
// }

// exports.getall = function(req, res, next) {
// 	// console.log('soxsController.get');
// 	getSchema(req.params.type, function(err, customModel) {
// 		if (err) {
// 			res.send(404);
// 		} else {
// 			customModel.find({}).exec(function(err, models) {
// 				if (err) {
// 					return next(err);
// 				}
// 				if (!models) {
// 					return next(new Error('Failed to load models: ' + req.params.type));
// 				}

// 				res.json(models);
// 			})
// 		}
// 	})
// }