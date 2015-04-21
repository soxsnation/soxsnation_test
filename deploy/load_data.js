/* load_data.js
 *
 * Author(s):  Andrew Brown
 * Date:       4/1/2015
 *
 */

var snController = require('../app/controllers/snController');
var soxController = require('../app/controllers/soxController');
var async = require('async');

var soxsLog = require('../app/lib/soxsLog')('snController');

var load_elementTypes = require('./load_elementTypes');

var snAttributeType = {
    name: "snAttributeType",
    mongo_name: "sn.Attribute.Type",
    active: true,
    fields: [{
        name: "name",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }, {
        name: "type",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }, {
        name: "valid_values",
        type: "String",
        isArray: true,
        ref: "",
        default_value: ""
    }]
};

var snElementType = {
    name: "snElementType",
    mongo_name: "sn.Element.Type",
    active: true,
    fields: [{
        name: "name",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }, {
        name: "attributes",
        type: "ObjectId",
        isArray: true,
        ref: "sn.Attribute.Type",
        default_value: ""
    }]
};

var snElementAttribute = {
    name: "snElementAttribute",
    mongo_name: "sn.Element.Attribute",
    active: true,
    fields: [{
        name: "name",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }, {
        name: "value",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }]
};

var snElement = {
    name: "snElement",
    mongo_name: "sn.Element",
    active: true,
    fields: [{
        name: "name",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }, {
        name: "css_class",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }, {
        name: "attributes",
        type: "ObjectId",
        isArray: true,
        ref: "sn.Element.Attribute",
        default_value: ""
    }, {
        name: "childred",
        type: "ObjectId",
        isArray: true,
        ref: "sn.Element",
        default_value: ""
    }]
};

var snTemplate = {
    name: "snTemplate",
    mongo_name: "sn.Template",
    active: true,
    fields: [{
        name: "name",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }, {
        name: "snSchema",
        type: "ObjectId",
        isArray: true,
        ref: "sn.Element",
        default_value: ""
    }, {
        name: "settings",
        type: "String",
        isArray: false,
        ref: "",
        default_value: ""
    }]
};

function load_snData_item(snDataType, snData, callback) {
    snController.post_schema(snDataType, snData, function(err, d) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, d);
        }
    })
}

function load_snData() {
    var f = [];
    var d = load_elementTypes.elements();
    console.log(d);

    for (var i = 0; i < d.length; ++i) {
        (function(i) {
            var item = d[i];
            f.push(function(callback) {
                load_snData_item('snElementType', item, callback);
            });
        })(i);
    }

    async.series(f, function(err, results) {
        soxsLog.debug_info('got load_snData async results:');
        soxsLog.debug_info(results);
    });
}


exports.snData = function() {
	soxsLog.apicall('exports.snData ');
    snController.init(function(err, data) {

        load_snData();
    })
}

exports.soxData = function() {
    soxsLog.apicall("exports.soxData");
    soxController.post_schema(snAttributeType, function(err, data) {
        if (err) {
            soxsLog.error(err);
        } else {
            soxsLog.data("Created snAttributeType");
            soxController.post_schema(snElementType, function(err, data) {
                if (err) {
                    soxsLog.error(err);
                } else {
                    soxsLog.data("Created snElementType")
                    soxController.post_schema(snElementAttribute, function(err, data) {
                        if (err) {
                            soxsLog.error(err);
                        } else {
                            soxsLog.data("Created snElementAttribute")
                            soxController.post_schema(snElement, function(err, data) {
                                if (err) {
                                    soxsLog.error(err);
                                } else {
                                    soxsLog.data("Created snElement")
                                    soxController.post_schema(snTemplate, function(err, data) {
                                        if (err) {
                                            soxsLog.error(err);
                                        } else {
                                            soxsLog.data("Created snTemplate")
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}
