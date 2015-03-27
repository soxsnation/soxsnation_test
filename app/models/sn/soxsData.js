/* soxsData.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 
 *
 */


var exports = module.exports = {};

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;



var soxsSchemaField = {
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
	default_value: {
		type: String,
		default: '',
		trim: true
	}
};

var soxsSchema = {
	name: {
		type: String,
		default: '',
		trim: true
	},
	mongo_name: {
		type: String,
		default: '',
		trim: true
	},
	fields: [{
		type: Schema.Types.ObjectId,
		ref: 'soxs.Schema.Field'
	}],
	active: {
		type: Boolean,
		default: true
	}
};

var data_name = function(snDataType) {
	switch(snDataType) {
		case 'soxsSchema':
			return 'soxs.Schema';
		case 'soxsSchemaField':
			return 'soxs.Schema.Field';		
		default :
			return '';
	}
}

module.exports = {
	env: 'dev',
	soxsSchema:  soxsSchema,
	soxsSchemaField: soxsSchemaField,
	data_name: data_name
}



// exports.snTemplate = snTemplate;
