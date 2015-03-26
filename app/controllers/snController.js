/* snController.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var snData = require('../models/sn/snData');

var soxsTest = mongoose.model('soxs.Test');

var snElmProperty = mongoose.model('snElmProperty');
var snTempSchema = mongoose.model('snTempSchema');
var snTemplate = mongoose.model('snTemplate');

var snModels = {};

function make_schema(snDataType) {
    // console.log('make_schema: ' + snDataType);
    var s = snData[snDataType];
    // console.log(s);
    var temp_schema = new Schema(s);
    return temp_schema;
}

function make_model(snDataType) {

    if (snModels.hasOwnProperty(snDataType)) {
        return snModels[snDataType];
    }
    else
    {
        var snName = snData.data_name(snDataType);
        var sn_model = mongoose.model(snName, make_schema(snDataType));
        snModels[snDataType] = sn_model;
        return sn_model;
    }
} 

function save_snData(snDataType, data, cb) {
    // console.log('save_snData');
    var m = make_model(snDataType); //mongoose.model(snData.data_name(snDataType), make_schema(snDataType));
    // console.log('made mongoose.model');
    var d = new m(data);
    d.save(function(err) {
        cb(err);
    });
}

function getData(snDataType, cb) {
    var sn_model = make_model(snDataType);
    sn_model.find({}).exec(cb);
}

exports.get_snData_by_id = function(req, res, next) {

}

exports.get_snData = function(req, res, next) {
    var snDataType = req.params.snDataType;
    getData(snDataType, function(err, data) {
        if (err) {
            console.log('err:' + err);
            res.send(403);
        }
        else {
            res.json(data);
        }
    })
}

exports.post_snData = function(req, res, next) {
    var snDataType = req.params.snDataType;
    var data = req.body;
    save_snData(snDataType, data, function(err) {
        if (err) {
            console.log('err:' + err);
            res.send(403);
        }
        else {
            res.send(200);
        }
    });
}


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
        }
        else {
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
        }
        else {
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



