/* song.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/21/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;



var songSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	file_name: {
		type: String,
		default: '',
		trim: true
	},
	artist: {
		type: String,
		default: '',
		trim: true
	},
	album: {
		type: String,
		default: '',
		trim: true
	},
	genre: {
		type: String,
		default: '',
		trim: true
	},
	date_added: {
		type: Date
	},
	length: {
		type: Number
	},
	track: {
		type: Number
	},
	album_tracks: {
		type: Number
	},
	play_count: {
		type: Number,
		default: 0
	},
	active: {
		type: Boolean,
		default: true
	},
	tags: [String]
});


songSchema.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}


mongoose.model('soxs.Music.Song', songSchema)