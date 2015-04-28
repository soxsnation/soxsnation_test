/* soxsSchema.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/26/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;



var soxsSchema = new Schema({
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
	prefix: {
		type: String,
		default: 'sn',
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
});


soxsSchema.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('soxs.Schema', soxsSchema)