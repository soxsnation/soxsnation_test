/* snTempSchema.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var snTempSchema = new Schema({
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
	snProps: {
		type: Schema.Types.ObjectId,
		ref: 'snElmProperty'
	},
	children: [{
		type: Schema.Types.ObjectId,
		ref: 'snTempSchema'
	}]
});

snTempSchema.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('snTempSchema', snTempSchema)








