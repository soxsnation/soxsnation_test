/* snElmProperty.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var snElmProperty = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	value: {
		type: String,
		default: '',
		trim: true
	},
	valid_values: [{
		type: String,
		default: '',
		trim: true
	}]
});

snElmProperty.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('snElmProperty', snElmProperty)








