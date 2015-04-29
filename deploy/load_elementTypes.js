/* load_elementTypes.js
 *
 * Author(s):  Andrew Brown
 * Date:       4/1/2015
 *
 */

var snController = require('../app/controllers/snController');
var soxController = require('../app/controllers/soxController');
var async = require('async');

var soxsLog = require('../app/lib/soxsLog')('snController');

var ele_list = [];

var div = {
    name: "div",
    html: "<div></div>",
    // mongo_name: "rs.gui.div",
    // prefix: "rs",
    active: true,
    attributes: [{
        name: "class",
        type: "String",
        valid_values: []
    }, {
        name: "style",
        type: "String",
        valid_values: []
    }]
};

var textbox = {
    name: "textbox",
    html: "<input type='text' />",
    // mongo_name: "rs.gui.textbox",
    // prefix: "rs",
    active: true,
    attributes: [{
        name: "class",
        type: "String",
        valid_values: []
    }, {
        name: "style",
        type: "String",
        valid_values: []
    }, {
        name: "type",
        type: "String",
        valid_values: ["text", "password"]
    }, {
        name: "data-ng-model",
        type: "String",
        valid_values: []
    }]
};

var paragraph = {
    name: "paragraph",
    html: "<p>text</p>",
    // mongo_name: "rs.gui.paragraph",
    // prefix: "rs",
    active: true,
    attributes: [{
        name: "class",
        type: "String",
        valid_values: []
    }, {
        name: "style",
        type: "String",
        valid_values: []
    }, {
        name: "data-ng-model",
        type: "String",
        valid_values: []
    }]
};

var button = {
    name: "button",
    html: "<button >text</button>",
    // mongo_name: "rs.gui.button",
    // prefix: "rs",
    active: true,
    attributes: [{
        name: "class",
        type: "String",
        valid_values: []
    }, {
        name: "style",
        type: "String",
        valid_values: []
    }, {
        name: "text",
        type: "String"
    }, {
        name: "data-ng-model",
        type: "String",
        valid_values: []
    }]
};

var heading = {
    name: "heading",
    html: "<h1 >text</h1>",    
    // mongo_name: "rs.gui.heading",
    // prefix: "rs",
    active: true,
    attributes: [{
        name: "class",
        type: "String",
        valid_values: []
    }, {
        name: "style",
        type: "String",
        valid_values: []
    }, {
        name: "text",
        type: "String"
    }, {
        name: "size",
        type: "String"
    }, {
        name: "data-ng-model",
        type: "String",
        valid_values: []
    }]
};


ele_list.push(div);
ele_list.push(textbox);
ele_list.push(paragraph);
ele_list.push(button);
ele_list.push(heading);

function install_ele(ele, cb) {
    soxsLog.funcall('install_ele: ' + ele.name);
    soxsLog.data(ele);
    soxController.post_schema(ele, cb);
}

function load_elementTypes() {

    var f = [];
    for (var i = 0; i < ele_list.length; ++i) {
        (function(i) {
            f.push(function (callback) {
                install_ele(ele_list[i], callback);
            })
        })(i);
    }
    soxsLog.debug_info('Functions created: ' + f.length);

    async.series(f, function(err, results) {
            if (err) {
                soxsLog.err('load_elementTypes: ' + err);
                // cb(err, null);
            } else {
                soxsLog.debug_info('load_elementTypes complete');
                // for (var i = 0; i < results.length; ++i) {
                //     snModels[results[i].name] = results[i];
                // }
                // cb(null, results);
            }
        });

}

exports.install_elements = function() {
    load_elementTypes();
}

exports.elements = function() {
	return ele_list;
}
