/* soxsType.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/15/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;



var soxsType = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	type: {
		type: String,
		default: '',
		trim: true
	},
	display_view: {
		type: String,
		default: '0',
		trim: true
	},
	display_edit: {
		type: String,
		default: '0',
		trim: true
	}
});


soxsType.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('soxsType', soxsType)