/* snController.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var snData = require('../models/sn/snData');
var soxController = require('./soxController');
// var soxsData = require('../models/sn/soxsData');

var soxsTest = mongoose.model('soxs.Test');

var snElmProperty = mongoose.model('snElmProperty');
var snTempSchema = mongoose.model('snTempSchema');
var snTemplate = mongoose.model('snTemplate');

var snModels = {};
// var soxsModels = {};

function make_schema(snDataType, cb) {
    // console.log('make_schema: ' + snDataType);

    soxController.get_soxs_schema(snDataType, function(sch) {
        if (!sch) {
        	console.log('snController::make_schema::err: ');
            cb(err, null);
        } else {
        	console.log('snController::make_schema got sch');
        	var sch0 = sch[0];
        	console.log(sch0);
            snModels[sch0.name] = {
                mongo_name: sch0.mongo_name,
                active: sch0.active
            }

            var s = {};
            for (var fc = 0; fc < sch0.fields.length; ++fc) {
            	var f = sch0.fields[fc];
        		console.log('f: ' + f);
                var field = {};
                s[f.name] = {
                    type: f.type,
                    default: f.default_value
                };
            }

            var temp_schema = new Schema(s);
            cb(null, temp_schema, sch0.name);
        }
    });
}

function make_model(snDataType, cb) {

    if (snModels.hasOwnProperty(snDataType)) {
        cb(null, snModels[snDataType].model);
    } else {
        make_schema(snDataType, function(err, sn_schema, sn_name) {
            if (err) {
                cb(err, null);
            } else {
                var sn_model = mongoose.model(snModels[sn_name].mongo_name, sn_schema);
                snModels[snDataType].model = sn_model;
                cb(err, sn_model);
            }
        });
    }
}

function save_snData(snDataType, data, res) {
    // console.log('save_snData');
    make_model(snDataType, function(err, sn_model) {
        if (err) {
            res.send(403);
        } else {
            var d = new sn_model(data);
            d.save(function(err) {
                if (err) {
                    console.log('err: ' + err);
                    res.send(403);
                } else {
                    res.send(200);
                }
            });
        }
    });
}

function getData(snDataType, cb) {
    var sn_model = make_model(snDataType);
    sn_model.find({}).exec(cb);
}

function getDataById(snDataType, id, cb) {
    var sn_model = make_model(snDataType);
    sn_model.find({
        _id: id
    }).exec(cb);
}

exports.get_snData_by_id = function(req, res, next) {
    var snDataType = req.params.snDataType;
    getData(snDataType, function(err, data) {
        if (err) {
            console.log('err:' + err);
            res.send(403);
        } else {
            res.json(data);
        }
    })
}

exports.get_snData = function(req, res, next) {
    var snDataType = req.params.snDataType;
    getData(snDataType, function(err, data) {
        if (err) {
            console.log('err:' + err);
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
// 	console.log('get_soxs_data_by_id')
// 	var soxsDataType = req.params.soxsDataType;
// 	var id = req.params.id;
// 	var soxs_model = make_soxs_model(soxsDataType);
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
// 	console.log('get_soxs_data')
// 	var soxsDataType = req.params.soxsDataType;
// 	var soxs_model = make_soxs_model(soxsDataType);
//     soxs_model.find({})
//     	.populate('fields')
//     	.exec(function(err, data) {
// 	        if (err) {
// 	            console.log('err:' + err);
// 	            res.send(403);
// 	        }
// 	        else {
// 	            res.json(data);
// 	        }
// 	    });
// }

// exports.post_soxs_data = function(req, res, next) {
// 	console.log('post_soxs_data')
// 	var soxsDataType = req.params.soxsDataType;
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
