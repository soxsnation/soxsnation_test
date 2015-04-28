/* soxController.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soxsSchema = mongoose.model('soxs.Schema');
var soxsSchemaField = mongoose.model('soxs.Schema.Field');
var soxsLog = require('../lib/soxsLog')('soxController');

var async = require('async');

var soxsData = require('../models/sn/soxsData');

var soxsModels = {};

function make_soxs_schema(soxsDataType) {
    soxsLog.debug_info('make_schema: ' + snDataType);
    var s = soxsData[soxsDataType];
    soxsLog.debug_info(s);
    var temp_schema = new Schema(s);
    return temp_schema;
}

function make_soxs_model(soxsDataType) {

    if (soxsModels.hasOwnProperty(soxsDataType)) {
        return soxsModels[soxsDataType];
    } else {
        var soxs_model = mongoose.model(soxsData.data_name(soxsDataType), make_soxs_schema(soxsDataType));
        soxsModels[soxsDataType] = soxs_model;
        return soxs_model;
    }
}

function get_schema(schemaName, cb) {
    var query = {};
    if (schemaName && schemaName != '_all') {
        query._id = schemaName
    }
    soxsLog.debug_info(query);
    soxsSchema.find(query)
        .populate('fields')
        .exec(function(err, data) {
            if (err) {
                soxsLog.error('soxController::get_schema::err:' + err);
                cb(null);
            } else {
                cb(data);
            }
        });
}

function get_schema_by_name(schemaName, cb) {
    var query = {};
    if (schemaName && schemaName != '_all') {
        if (schemaName.indexOf('.') == -1) {
            query.name = schemaName
        } else {
            query.mongo_name = schemaName
        }
    }
    soxsLog.debug_info('query: ' + JSON.stringify(query));
    soxsSchema.find(query)
        .populate('fields')
        .exec(function(err, data) {
            if (err) {
                soxsLog.error('soxController::get_schema::err:' + err);
                cb(null);
            } else {
                soxsLog.debug_info("Got schema for: " + schemaName);
                // soxsLog.debug_info(JSON.stringify(data));
                for (var i = 0; i < data.length; ++i) {
                    if (!soxsModels.hasOwnProperty(data[i].name)) {
                        soxsLog.debug_info('Adding model: ' + data[i].name);
                        soxsModels[data[i].name] = data[i];
                    }
                }
                cb(data);
            }
        });
}

function get_schema_field(schemaField, cb) {
    var query = {};
    if (schemaField) {
        query.name = schemaField
    }
    soxsSchemaField.find(query)
        .populate('fields')
        .exec(function(err, data) {
            if (err) {
                console.log('soxController::get_schema_field::err:' + err);
                cb(null);
            } else {
                cb(data);
            }
        });
}

exports.get_soxs_schema = function(schemaName) {
    soxsLog.apicall('get_soxs_schema: ' + schemaName);
    if (soxsModels.hasOwnProperty(schemaName)) {
        return soxsModels[schemaName];
    } else {
        return undefined;
    }
}

exports.get_soxs_schema_mongo_name = function(mongoName) {
    soxsLog.apicall('get_soxs_schema_mongo_name: ' + mongoName);
    // soxsLog.data(soxsModels);
    for (var sc in soxsModels) {
        // soxsLog.debug_info('Checking: ' + JSON.stringify(sc));
        if (soxsModels[sc].mongo_name == mongoName) {
            return soxsModels[sc];
        }
    }
    soxsLog.error('Could NOT find model for: ' + mongoName);
    return undefined;

}

exports.load_soxs_schema = function(schemaName, cb) {
    soxsLog.error('get_soxs_schema: ' + schemaName);
    get_schema_by_name(schemaName, cb);
    // var soxs_model = make_soxs_model('soxsSchema');
    // soxs_model.find({name: schemaName}).exec(cb);
}

exports.get_soxs_data_by_id = function(req, res, next) {
    soxsLog.apicall('get_soxs_data_by_id: ' + req.params.soxsDataType);

    var soxsDataType = req.params.soxsDataType;
    if (soxsDataType == 'soxsSchema') {
        get_schema(req.params.id, function(data) {
            if (data) {
                res.json(data);
            } else {
                res.send(403);
            }
        });
    } else if (soxsDataType == 'soxsSchemaField') {
        get_schema_field(req.params.id, function(data) {
            if (data) {
                res.json(data);
            } else {
                res.send(403);
            }
        });
    }
}

exports.get_soxs_data = function(req, res, next) {
    soxsLog.apicall('get_soxs_data: ' + req.params.soxsDataType);

    var soxsDataType = req.params.soxsDataType;
    if (soxsDataType == 'soxsSchema') {
        get_schema(req.params.id, function(data) {
            if (data) {
                res.json(data);
            } else {
                res.send(403);
            }
        });
    } else if (soxsDataType == 'soxsSchemaField') {
        get_schema_field(req.params.id, function(data) {
            if (data) {
                res.json(data);
            } else {
                res.send(403);
            }
        });
    }
}


function post_field(field_schema, callback) {
    soxsLog.debug_info('post_field: ' + JSON.stringify(field_schema));
    var d = soxsSchemaField(field_schema);
    d.save(function(err) {
        if (err) {
            callback(err, null);
        } else {
            soxsSchemaField.findById(d, function(err, doc) {
                soxsLog.debug_info(d._id);
                callback(null, d._id);
            })
        }
    });
}



function post_soxs_schema(schema_data, cb) {
    var f = [];
    for (var i = 0; i < schema_data.fields.length; ++i) {
        (function(i) {
            var field = schema_data.fields[i];
            f.push(function(callback) {
                post_field(field, callback);
            });
        })(i);
    }
    async.series(f, function(err, results) {
        soxsLog.debug_info('got post async results:');
        soxsLog.debug_info(results);
        var sd = {
            name: schema_data.name,
            mongo_name: schema_data.mongo_name,
            fields: []
        };
        for (var i = 0; i < results.length; ++i) {
            sd.fields.push(results[i]);
        }
        soxsLog.debug_info(sd);
        var d = soxsSchema(sd);
        d.save(function(err) {
            if (err) {
                soxsLog.debug_info_end('post_soxs_schema::err:' + err);
                cb(err, null);
            } else {
                soxsLog.debug_info_end('post_soxs_schema');
                cb(null, d.name);
            }
        });
    })
}

exports.post_schema = function(schema_data, cb) {
    soxsLog.apicall('post_schema: ' + schema_data);
    post_soxs_schema(schema_data, cb);
}

exports.post_soxs_data = function(req, res, next) {
    soxsLog.apicall('post_soxs_data: ' + req.params.soxsDataType);
    // soxsLog.debug_info_start('post_soxs_data: ' + req.params.soxsDataType)
    var soxsDataType = req.params.soxsDataType;
    var data = req.body;
    var d = {};

    if (soxsDataType == 'soxsSchema') {
        post_soxs_schema(data, function(err, data) {
            if (err) {
                res.send(403);
            } else {
                res.send(200);
            }
        });
    } else if (soxsDataType == 'soxsSchemaField') {
        soxsLog.debug_info_end('post_soxs_data::soxsSchemaField: not defined');
        res.send(404);
    }
}

function put_field(id, field_schema, callback) {
    soxsLog.apicall('put_field: ' + id + JSON.stringify(field_schema));
    if (id == undefined) {
        callback("put field failed: " + JSON.stringify(field_schema), null);
    } else {
        soxsSchemaField.findOne({
            _id: id
        }).exec(function(err, field_data) {
            if (err) {
                callback(err, null);
            } else {
                if (field_data == null) {
                    callback(err, null);
                } else {
                    field_data.update(field_schema, function(err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data._id);
                        }
                    });
                }
            }
        })
    }
}

function put_soxs_schema(id, schema_data, res) {
    soxsLog.debug_info('put_soxs_schema');
    soxsLog.debug_info(schema_data);
    var put_f = [];
    var post_f = [];
    for (var i = 0; i < schema_data.fields.length; ++i) {
        (function(i) {
            var field = schema_data.fields[i];
            if (field.hasOwnProperty("_id")) {
                put_f.push(function(callback) {
                    put_field(field._id, field, callback);
                });
            } else {
                post_f.push(function(callback) {
                    post_field(field, callback);
                });
            }
        })(i)
    }

    async.series(post_f, function(err, post_results) {
        soxsLog.debug_info('got put async results[post]:');
        soxsLog.debug_info(post_results);

        async.series(put_f, function(err, put_results) {
            soxsLog.debug_info('got put async results[put]:');
            soxsLog.debug_info(put_results);

            var sd = {
                name: schema_data.name,
                mongo_name: schema_data.mongo_name,
                fields: []
            };
            for (var i = 0; i < put_results.length; ++i) {
                sd.fields.push(put_results[i]);
            }
            for (var i = 0; i < post_results.length; ++i) {
                sd.fields.push(post_results[i]);
            }
            soxsLog.debug_info('put_soxs_schema final sd value:')
            soxsLog.debug_info(sd);

            soxsSchema.findOne({
                _id: id
            }).exec(function(err, schema_data) {
                if (err) {
                    soxsLog.debug_info('put_soxs_schema::err:' + err);
                    res.send(403);
                } else {
                    if (schema_data == null) {
                        soxsLog.debug_info('put_soxs_schema::err: no data');
                        res.send(403);
                    } else {
                        schema_data.update(sd, function(err, data) {
                            if (err) {
                                soxsLog.debug_info('put_soxs_schema::err:' + err);
                                res.send(403);
                            } else {
                                soxsLog.debug_info_end('put_soxs_data');
                                res.send(200);
                            }
                        });
                    }
                }
            });
        })
    })
}

exports.put_soxs_data = function(req, res, next) {
    soxsLog.apicall('put_soxs_data: ' + req.params.soxsDataType)
    var soxsDataType = req.params.soxsDataType;
    var id = req.params.id;
    var data = req.body;

    if (soxsDataType == 'soxsSchema') {
        put_soxs_schema(id, data, res);
    } else if (soxsDataType == 'soxsSchemaField') {
        res.send(404);
        // d = soxsSchemaField(data);
    }
}

exports.delete_soxs_data = function(req, res, next) {
    soxsLog.apicall('delete_soxs_data: ' + req.params.soxsDataType)
    var soxsDataType = req.params.soxsDataType;
    var id = req.params.id;
    var query = {
        _id: id
    };

    if (soxsDataType == 'soxsSchema') {
        soxsSchema.remove(query, function(err) {
            if (err) {
                soxsLog.debug_info('ERROR: delete_soxs_data: ' + err);
                res.send(403);
            } else {
                res.send(200);
            }
        })
    } else if (soxsDataType == 'soxsSchemaField') {
        res.send(404);
        // d = soxsSchemaField(data);
    }


}


function foo(num, cb) {
    soxsLog.debug_info('foo: ' + num);
    cb(null, num);
}

function counter() {
    soxsLog.debug_info('counter')
    var f = [];
    for (var i = 0; i < 20; ++i) {
        (function(i) {
            f.push(function(cb) {
                foo(i, cb);
            });
        })(i)

    }
    async.series(f, function(err, results) {
        soxsLog.debug_info('results:')
        soxsLog.debug_info(results);
    });
}
