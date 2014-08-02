/* soxsSchema.js
 *
 * Author(s):  Andrew Brown
 * Date:       8/1/2014
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
	description: {
		type: String,
		default: '',
		trim: true
	},
	fields: {
		type: String,
		default: '',
		trim: true
	}
});


mongoose.model('soxsSchema', soxsSchema)