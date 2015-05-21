/* playlist.js
 *
 * Author(s):  Andrew Brown
 * Date:       5/21/2015
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;



var playlistSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	songs: [{
		type: Schema.Types.ObjectId,
		ref: 'soxs.Music.Song'
	}]
});


playlistSchema.methods = {

	update: function(data, cb) {

		for (var key in data) {
			this[key] = data[key];
		}

		this.save(cb)
	}

}

mongoose.model('soxs.Music.Playlist', playlistSchema)