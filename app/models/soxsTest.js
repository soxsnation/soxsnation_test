/* soxsTest.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var soxsTest = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	created_by: {
		type: String,
		default: '',
		trim: true
	}
});

soxsTest.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('soxs.Test', soxsTest)








