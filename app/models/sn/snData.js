/* snData.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 
 *
 */


var exports = module.exports = {};

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/** To store all the different attributes that can be put into an html tag */
var snAttributeType = {
	name: {
		type: String,
		default: '',
		trim: true
	},
	type: {
		type: String,
		default: '',
		trim: true
	},
	valid_values: [{
		type: String,
		default: '',
		trim: true
	}]
}

/** To store all of the different element (html tag) types */
var snElementType = {
	name: {
		type: String,
		default: '',
		trim: true
	},
	attributes: [{
		type: Schema.Types.ObjectId,
		ref: 'snAttributeType'
	}]
}


var snElementAttribute = {
	name: {
		type: String,
		default: '',
		trim: true
	},
	value: {
		type: String,
		default: '',
		trim: true
	}
};

var snElement = {
	name: {
		type: String,
		default: '',
		trim: true
	},
	css_class: {
		type: String,
		default: '',
		trim: true
	},
	attributes: {
		type: Schema.Types.ObjectId,
		ref: 'snElementAttributes'
	},
	children: [{
		type: Schema.Types.ObjectId,
		ref: 'snElement'
	}]
};	

var snTemplate = {
    name: {
        type: String,
        default: '',
        trim: true
    },
    snSchema: {
        type: Schema.Types.ObjectId,
        ref: 'snElement'
    },
    settings: {
        type: String,
        default: '',
        trim: true
    },
    created_by: {
        type: String,
        default: '',
        trim: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_by: {
        type: String,
        default: '',
        trim: true
    },
    updated_date: {
        type: Date,
        default: Date.now
    }
};

var soxSchemaField = {
	name: {
		type: String,
		default: '',
		trim: true
	},
	type: {
		type: String,
		default: '',
		trim: true
	}
}

var soxSchema = {
	name: {
		type: String,
		default: '',
		trim: true
	},
	fields: [{
		type: Schema.Types.ObjectId,
		ref: 'soxSchemaField'
	}],
	active: {
		type: Boolean,
		default: true
	}
}

var data_name = function(snDataType) {
	switch(snDataType) {
		case 'snTemplate':
			return 'snData.Template';
		case 'snElement':
			return 'snData.Element';
		case 'snElementAttribute':
			return 'snData.snElementAttribute';
		case 'snElementType':
			return 'snData.Element.Type';
		case 'snAttributeType':
			return 'snData.Attribute.Type';
		default :
			return '';
	}
}



module.exports = {
	env: 'dev',
	snTemplate:  snTemplate,
	snElement: snElement,
	snElementAttribute: snElementAttribute,
	snElementType: snElementType,
	snAttributeType: snAttributeType,
	data_name: data_name
}



// exports.snTemplate = snTemplate;
