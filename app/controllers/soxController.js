/* soxController.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soxsSchema = mongoose.model('soxs.Schema');
var soxsSchemaField = mongoose.model('soxs.Schema.Field');

var async = require('async');

var soxsData = require('../models/sn/soxsData');

var soxsModels = {};

function make_soxs_schema(soxsDataType) {
    // console.log('make_schema: ' + snDataType);
    var s = soxsData[soxsDataType];
    // console.log(s);
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
    if (schemaName) {
        query.name = schemaName
    }
    console.log(query);
    soxsSchema.find(query)
        .populate('fields')
        .exec(function(err, data) {
            if (err) {
                console.log('soxController::get_schema::err:' + err);
                cb(null);
            } else {
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

exports.get_soxs_schema = function(schemaName, cb) {
    console.log('get_soxs_schema: ' + schemaName);
    get_schema(schemaName, cb);
    // var soxs_model = make_soxs_model('soxsSchema');
    // soxs_model.find({name: schemaName}).exec(cb);
}

exports.get_soxs_data_by_id = function(req, res, next) {
    console.log('get_soxs_data_by_id: ' + req.params.soxsDataType);

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

    // var soxsDataType = req.params.soxsDataType;
    // var id = req.params.id;
    // var soxs_model = make_soxs_model(soxsDataType);
    //    soxs_model.find({_id: id}).exec(function(err, data) {
    //        if (err) {
    //            console.log('err:' + err);
    //            res.send(403);
    //        }
    //        else {
    //            res.json(data);
    //        }
    //    });
}

exports.get_soxs_data = function(req, res, next) {
    console.log('get_soxs_data: ' + req.params.soxsDataType);

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

    // var soxsDataType = req.params.soxsDataType;
    // var soxs_model = make_soxs_model(soxsDataType);
    //    soxs_model.find({})
    //    	.populate('fields')
    //    	.exec(function(err, data) {
    //         if (err) {
    //             console.log('err:' + err);
    //             res.send(403);
    //         }
    //         else {
    //             res.json(data);
    //         }
    //     });
}

function post_field(field_schema, callback) {
	console.log('post_field: ' + JSON.stringify(field_schema));
    var d = soxsSchemaField(field_schema);
    d.save(function(err) {
    	if (err) { callback(err, null); }
    	else {
    		soxsSchemaField.findById(d, function(err, doc){
    			console.log(d._id);
    			callback(null, d._id);
    		})
    	}
    });
    
}

function post_soxs_schema(schema_data, res) {

    var f = [];
    for (var i = 0; i < schema_data.fields.length; ++i) {
        var field = schema_data.fields[i];
        f.push(function(callback) {
            post_field(field, callback);
        });
    }
    async.series(f, function(err, results) {
        console.log('got async results:');
        console.log(results);
        var sd = {
            name: schema_data.name,
            mongo_name: schema_data.mongo_name,
            fields: []
        };
        for (var i = 0; i < results.length; ++i) {
            sd.fields.push(results[i]);
        }
        console.log(sd);
        var d = soxsSchema(sd);
        d.save(function(err) {
            if (err) {
                console.log('post_soxs_schema::err:' + err);
                res.send(403);
            } else {
                res.send(200);
            }
        });

    })

}

exports.post_soxs_data = function(req, res, next) {
    console.log('post_soxs_data: ' + req.params.soxsDataType)
    var soxsDataType = req.params.soxsDataType;
    var data = req.body;
    var d = {};

    if (soxsDataType == 'soxsSchema') {
        post_soxs_schema(data, res);
    } else if (soxsDataType == 'soxsSchemaField') {
        d = soxsSchemaField(data);
    }


    // var soxs_model = make_soxs_model(soxsDataType); 
    // // console.log('made mongoose.model');
    // var d = new soxs_model(data);
    // d.save(function(err) {
    //     if (err) {
    //         console.log('err:' + err);
    //         res.send(403);
    //     } else {
    //         res.send(200);
    //     }
    // });
}
