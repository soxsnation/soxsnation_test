/* snController.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var soxsTest = mongoose.model('soxs.Test');

var snElmProperty = mongoose.model('snElmProperty');
var snTempSchema = mongoose.model('snTempSchema');
var snTemplate = mongoose.model('snTemplate');



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

    soxsTest.find({})
        // .populate('snSchema')
        // .populate('snSchema.snProps')
        .exec(function(err, data) {
            if (err) {
                return next(err);
            }
            return res.json(data);
        })
}

exports.post_tests = function(req, res, next) {
	console.log('post_tests');
    console.log(req.body);
    var t = new soxsTest(req.body);
    t.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(403);
        } else {
            res.send(200);
        }
    })
}
