/* load_elementTypes.js
 *
 * Author(s):  Andrew Brown
 * Date:       4/1/2015
 *
 */


var ele_list = [];

var div = {
    name: "div",
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


ele_list.push(div);
// ele_list.push(textbox);

exports.elements = function() {
    return ele_list;
}
