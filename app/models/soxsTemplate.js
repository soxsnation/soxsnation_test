/* soxsTemplate.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/19/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var soxsTemplate = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	markup: {
		type: String,
		default: '',
		trim: true
	},
	settings: {
		type: String,
		default: '',
		trim: true
	}
});

soxsTemplate.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('soxsTemplate', soxsTemplate)








