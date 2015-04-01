/* soxsController.js
 *
 * Author(s):  Andrew Brown
 * Date:       8/1/2014
 *
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var snTempSchema = mongoose.model('snTempSchema');

var soxsSchema = mongoose.model('soxsSchema');
var soxsType = mongoose.model('soxsType');
var soxsTemplate = mongoose.model('snTemplate');
var soxsTemplateElement = mongoose.model('soxsTemplateElement');
var mailer = require('../lib/mailer');
var soxsLog = require('../lib/soxsLog')('soxsController');

/*****************************************************************************************
 * Functions
 *****************************************************************************************/

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

    cb(fields);
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


/******************************************************************************************************
 * soxs template elements
 ******************************************************************************************************/

exports.get_template_elements = function(req, res, next) {
    soxsLog.debug_info('exports.get_template_elements');
    soxsTemplateElement.find({}).exec(function(err, elements) {
        if (err) {
            return next(err);
        }
        if (!elements) {
            return next(new Error('Failed to load soxs template elements'));
        }
        return res.json(elements);
    });
};

exports.get_template_element = function(req, res, next) {

};

exports.post_template_element = function(req, res, next) {
    soxsLog.debug_info('exports.post_template_element');
    soxsLog.debug_info(JSON.stringify(req.body));
    var sch = new soxsTemplateElement(req.body);
    sch.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(403);
        } else {
            res.send(200);
        }
    })
};

exports.put_template_element = function(req, res, next) {

};

exports.delete_template_element = function(req, res, next) {

};

/******************************************************************************************************
 * soxs template
 ******************************************************************************************************/

exports.get_templates = function(req, res, next) {
    soxsLog.debug_info('exports.get_templates');
    soxsTemplate.find({}).exec(function(err, elements) {
        if (err) {
            return next(err);
        }
        if (!elements) {
            return next(new Error('Failed to load soxs template'));
        }
        return res.json(elements);
    });
};

exports.get_template = function(req, res, next) {

};

exports.post_template = function(req, res, next) {
    soxsLog.debug_info('exports.post_template');
    soxsLog.debug_info(JSON.stringify(req.body));
    var sch = new soxsTemplate(req.body);
    sch.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(403);
        } else {
            res.send(200);
        }
    })
};

exports.put_template = function(req, res, next) {

};

exports.delete_template = function(req, res, next) {

};

/******************************************************************************************************
 * OLD
 ******************************************************************************************************/

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
