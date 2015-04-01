/* snController.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soxsLog = require('../lib/soxsLog')('snController');
var async = require('async');

var snData = require('../models/sn/snData');
var soxController = require('./soxController');
// var soxsData = require('../models/sn/soxsData');

var soxsTest = mongoose.model('soxs.Test');

var snElmProperty = mongoose.model('snElmProperty');
var snTempSchema = mongoose.model('snTempSchema');
var snTemplate = mongoose.model('snTemplate');

var snModels = {};
// var soxsModels = {};

function format_schema(raw_schema) {
    var s = {};
    for (var fc = 0; fc < raw_schema.fields.length; ++fc) {
        var f = raw_schema.fields[fc];
        // soxsLog.debug_info('f: ' + f);
        var field = {};
        if (f.type == 'ObjectId') {
            if (f.isArray) {
                s[f.name] = [{
                    type: Schema.Types.ObjectId,
                    ref: f.ref
                }];
            } else {
                s[f.name] = {
                    type: Schema.Types.ObjectId,
                    ref: f.ref
                };
            }

        } else {
            if (f.isArray) {
                s[f.name] = [{
                    type: f.type,
                    default: f.default_value
                }];
            } else {
                s[f.name] = {
                    type: f.type,
                    default: f.default_value
                };
            }

        }

    }
    return s;
}

function make_schema(snDataType, cb) {
    soxsLog.debug_info('make_schema: ' + snDataType);

    soxController.get_soxs_schema(snDataType, function(sch) {
        if (!sch) {
            soxsLog.error('snController::make_schema::err: ');
            cb('snController::make_schema::err: ', null);
        } else {
            soxsLog.debug_info('snController::make_schema got sch');
            var sch0 = sch[0];
            var sn_props = {
                name: sch0.name,
                mongo_name: sch0.mongo_name,
                active: sch0.active
            }
            var s = format_schema(sch0);

            soxsLog.debug_info('temp_schema');
            soxsLog.debug_info(s);
            var temp_schema = new Schema(s);
            cb(null, temp_schema, sn_props);
        }
    });
}

function make_model(snDataType, cb) {
    soxsLog.debug_info('make_model: ' + snDataType);
    soxsLog.debug_info(JSON.stringify(snModels));
    if (snModels.hasOwnProperty(snDataType)) {
        cb(null, snModels[snDataType].model);
    } else {
        make_schema(snDataType, function(err, sn_schema, sn_props) {
            if (err) {
                cb(err, null);
            } else if (!sn_schema) {
                soxsLog.error('make_model::sn_schema could not be made');
                cb('make_model::sn_schema could not be made', null);
            } else {
                snModels[sn_props.name] = {
                    mongo_name: sn_props.mongo_name,
                    active: sn_props.active
                };

                soxsLog.alert('snModels[sn_props.name].mongo_name: ' + snModels[sn_props.name].mongo_name);
                var sn_model = mongoose.model(snModels[sn_props.name].mongo_name, sn_schema);
                snModels[snDataType].model = sn_model;
                cb(null, sn_model);
            }
        });
    }
}

function post_sn_field(snDataFieldType, field_schema, callback) {
    make_model(snDataFieldType, function(err, sn_model) {
        var d = sn_model(field_schema);
        d.save(function(err) {
            if (err) {
                callback(err, null);
            } else {
                sn_model.findById(d, function(err, doc) {
                    soxsLog.debug_info(d._id);
                    callback(null, d._id);
                })
            }
        });
    });
}

function load_model(raw_schema, callback) {


    var s = format_schema(raw_schema);
    var temp_schema = new Schema(s);
    var sn_model = mongoose.model(raw_schema.mongo_name, temp_schema);
    snModels[raw_schema.name] = {
        mongo_name: raw_schema.mongo_name,
        active: raw_schema.active,
        model: sn_model
    };
    callback(null, raw_schema.name);

}

function load_data(cb) {
    if (snModels.length > 0) { return cb}
    var load_funs = [];
    soxController.get_soxs_schema('_all', function(soxs_schemas) {

        for (var i = 0; i < soxs_schemas.length; ++i) {
            (function(i) {
                load_funs.push(function(callback) {
                    load_model(soxs_schemas[i], callback)
                });
            })(i);
        }

        async.series(load_funs, function(err, results) {
            if (err) {
                soxsLog.err('load_data: ' + err);
                cb(err, null);
            } else {
                soxsLog.debug_info('load_data complete');
                soxsLog.debug_info(results);
                cb(null, results);
            }
        });
    })
}
load_data(function(err, data) {
    soxsLog.debug_info(data);
})

exports.init_data = function(req, res, next) {
    soxsLog.debug_info_start('init_data');
    load_data(function(err, data) {
        soxsLog.debug_info_end('init_data');
        if (err) {
            res.send(403);
        }
        else {
            res.json(data);
        }
    })
}

function save_snData(snDataType, data, res) {
    // soxsLog.debug_info('save_snData');
    // soxsLog.debug_info(data);
    var f = [];

    make_schema(snDataType, function(err, sn_schema, sn_name) {
        if (err) {
            cb(err, null);
        } else {
            for (var attr in data) {
                if (typeof data[attr] == "object") {
                    soxsLog.debug_info('Found object: ' + attr)
                    f.push(function(callback) {
                        post_sn_field(sn_schema.paths[attr].options.ref, data[attr], callback);
                    });
                }
            }

            async.series(f, function(err, results) {
                soxsLog.debug_info('got sn_post async results:');
                soxsLog.debug_info(results);
                for (var attr in data) {
                    if (typeof data[attr] == "object") {
                        data[attr] = results[0];
                        results.shift();
                    }
                }
                soxsLog.debug_info('data:');
                soxsLog.debug_info(JSON.stringify(data));
                make_model(snDataType, function(err, sn_model) {
                    if (err) {
                        res.send(403);
                    } else {
                        soxsLog.debug_info('About to save model');
                        soxsLog.debug_info(JSON.stringify(sn_model));

                        var d = new sn_model(data);
                        d.save(function(err) {
                            if (err) {
                                soxsLog.error('err: ' + err);
                                res.send(403);
                            } else {
                                res.send(200);
                            }
                        });
                    }
                });

            });
        }

    })
}

function populateData(sn_model, query, pop_fields, cb) {
    soxsLog.debug_info('populateData: ' + pop_fields);
    if (pop_fields.length == 0) {
        sn_model.find(query)
            .exec(cb);
    } else if (pop_fields.length == 1) {
        sn_model.find(query)
            .populate(pop_fields[0])
            .exec(cb);
    } else if (pop_fields.length == 2) {
        sn_model.find(query)
            .populate(pop_fields[0])
            .populate(pop_fields[1])
            .exec(cb);
    } else if (pop_fields.length == 3) {
        sn_model.find(query)
            .populate(pop_fields[0])
            .populate(pop_fields[1])
            .populate(pop_fields[2])
            .exec(cb);
    } else if (pop_fields.length == 4) {
        sn_model.find(query)
            .populate(pop_fields[0])
            .populate(pop_fields[1])
            .populate(pop_fields[2])
            .populate(pop_fields[3])
            .exec(cb);
    } else if (pop_fields.length == 5) {
        sn_model.find(query)
            .populate(pop_fields[0])
            .populate(pop_fields[1])
            .populate(pop_fields[2])
            .populate(pop_fields[3])
            .populate(pop_fields[4])
            .exec(cb);
    }
}

function getData(snDataType, query, cb) {
    make_model(snDataType, function(err, sn_model) {
        if (err) {
            cb(err, null);
        } else {
            soxsLog.debug_info('getData: ' + snDataType);

            var pop_fields = [];

            for (var f in sn_model.schema.paths) {
                soxsLog.debug_info('f');
                soxsLog.debug_info(JSON.stringify(f));
                if (sn_model.schema.paths[f].options.hasOwnProperty('ref')) {
                    pop_fields.push(f);
                }
            }

            populateData(sn_model, query, pop_fields, cb);

        }
    });
}

function getDataById(snDataType, id, cb) {
    var sn_model = make_model(snDataType);
    sn_model.find({
        _id: id
    }).exec(cb);
}

exports.get_snData_by_id = function(req, res, next) {
    var snDataType = req.params.snDataType;
    var id = req.params.id;
    var query = {
        _id: id
    };
    getData(snDataType, query, function(err, data) {
        if (err) {
            soxsLog.debug_info('err:' + err);
            res.send(403);
        } else {
            res.json(data);
        }
    })
}

exports.get_snData = function(req, res, next) {
    var snDataType = req.params.snDataType;
    getData(snDataType, {}, function(err, data) {
        if (err) {
            soxsLog.debug_info('err:' + err);
            res.send(403);
        } else {
            res.json(data);
        }
    })
}

exports.post_snData = function(req, res, next) {
    var snDataType = req.params.snDataType;
    var data = req.body;
    save_snData(snDataType, data, res);
}

/*****************************************************************************************
 * soxsData
 *****************************************************************************************/

// function make_soxs_schema(soxsDataType) {
//     // console.log('make_schema: ' + snDataType);
//     var s = soxsData[soxsDataType];
//     // console.log(s);
//     var temp_schema = new Schema(s);
//     return temp_schema;
// }

// function make_soxs_model(soxsDataType) {

//     if (soxsModels.hasOwnProperty(soxsDataType)) {
//         return soxsModels[soxsDataType];
//     }
//     else
//     {
//         var soxs_model = mongoose.model(soxsData.data_name(soxsDataType), make_soxs_schema(soxsDataType));
//         soxsModels[soxsDataType] = soxs_model;
//         return soxs_model;
//     }
// } 

// exports.get_soxs_data_by_id = function(req, res, next) {
//  console.log('get_soxs_data_by_id')
//  var soxsDataType = req.params.soxsDataType;
//  var id = req.params.id;
//  var soxs_model = make_soxs_model(soxsDataType);
//     soxs_model.find({_id: id}).exec(function(err, data) {
//         if (err) {
//             console.log('err:' + err);
//             res.send(403);
//         }
//         else {
//             res.json(data);
//         }
//     });
// }

// exports.get_soxs_data = function(req, res, next) {
//  console.log('get_soxs_data')
//  var soxsDataType = req.params.soxsDataType;
//  var soxs_model = make_soxs_model(soxsDataType);
//     soxs_model.find({})
//      .populate('fields')
//      .exec(function(err, data) {
//          if (err) {
//              console.log('err:' + err);
//              res.send(403);
//          }
//          else {
//              res.json(data);
//          }
//      });
// }

// exports.post_soxs_data = function(req, res, next) {
//  console.log('post_soxs_data')
//  var soxsDataType = req.params.soxsDataType;
//     var data = req.body;
//     var soxs_model = make_soxs_model(soxsDataType); 
//     // console.log('made mongoose.model');
//     var d = new soxs_model(data);
//     d.save(function(err) {
//         if (err) {
//             console.log('err:' + err);
//             res.send(403);
//         }
//         else {
//             res.send(200);
//         }
//     });    
// }

/***********************************************************************************************************************
 * OLD
 ***********************************************************************************************************************/


/** This is a description of the save_template_schema function. */
function save_template_schema(schema) {
    var tempSchema = new snTempSchema(schema);
    tempSchema.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(403);
        } else {
            res.send(200);
        }
    })
}


exports.get_templates = function(req, res, next) {

    snTemplate.find({})
        .populate('snSchema')
        .populate('snSchema.snProps')
        .exec(function(err, data) {
            if (err) {
                return next(err);
            }

            return res.json(data);
        })
}

exports.post_template = function(req, res, next) {
    console.log('post_template');
    console.log(req.body);

    var ep = req.body.snSchema.snProps;
    var tempProps = new snElmProperty(ep);
    tempProps.save();

    var ts = req.body.snSchema;
    ts.snProps = tempProps._id;
    var tempSchema = new snTempSchema(ts);
    tempSchema.save();

    var temp = req.body;
    temp.snSchema = tempSchema._id;

    console.log('snTemplate');
    console.log(temp);
    var t = new snTemplate(temp);
    t.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(403);
        } else {
            res.send(200);
        }
    })
};

exports.get_tests = function(req, res, next) {
    run_get_test(req, res);
    // soxsTest.find({})
    //     // .populate('snSchema')
    //     // .populate('snSchema.snProps')
    //     .exec(function(err, data) {
    //         if (err) {
    //             return next(err);
    //         }
    //         return res.json(data);
    //     })
}

exports.post_tests = function(req, res, next) {
    console.log('post_tests');
    // console.log(req.body);
    run_post_test(res);
    // var t = new soxsTest(req.body);
    // t.save(function(err) {
    //     if (err) {
    //         console.log(err);
    //         return res.send(403);
    //     } else {
    //         res.send(200);
    //     }
    // })

}



/***********************************************************************************************************************
 * Tests
 ***********************************************************************************************************************/

function run_get_test(req, res) {
    var snDataType = req.params.id;
    get_snData(snDataType, function(err, data) {
        if (err) {
            console.log('err:' + err);
            res.send(403);
        } else {
            res.json(data);
        }
    })
}

function run_post_test(res) {
    console.log('run_test');

    var data = {
        name: 'id',
        type: 'string',
        valid_values: []
    };

    save_snData('snAttributeType', data, function(err) {
        if (err) {
            console.log('err:' + err);
            res.send(403);
        } else {
            res.send(200);
        }
    });

    // console.log(snData.snTemplate);
    // // var snTest_schema = make_schema(snTempSchema());
    // var snTest_schema = new Schema(snData.snTemplate);
    // var snTest = mongoose.model('snTestTemplate', snTest_schema);
    // console.log('made model');
    // var data = {
    //     name: 'template',
    //     created_by: '4074355467'
    // };

    // var d = new snTest(data);
    // d.save(function(err) {
    //     if (err) {
    //         console.log(err);
    //         return res.send(403);
    //     } else {
    //         res.send(200);
    //     }
    // })

}

function snTestSchema() {
    var snTest = {
        name: {
            type: String,
            default: '',
            trim: true
        },
        phone_number: {
            type: String,
            default: '',
            trim: true
        }
    };

    return snTest;
}
