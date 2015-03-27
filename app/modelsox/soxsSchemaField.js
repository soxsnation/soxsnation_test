/* soxsSchemaField.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/26/2015
 *
 */

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


// soxsSchemaField.methods = {

// 	update: function(data, cb) {

// 		for (var key in data) {
// 			this[key] = data[key];
// 		}

// 		this.save(cb)
// 	}

// }


mongoose.model('soxs.Schema.Field', soxsSchemaField);