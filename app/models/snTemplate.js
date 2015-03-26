/* soxsTemplate.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/19/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var snTemplate = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	snSchema: {
		type: Schema.Types.ObjectId,
		ref: 'snTempSchema'
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
});

snTemplate.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('snTemplate', snTemplate)








