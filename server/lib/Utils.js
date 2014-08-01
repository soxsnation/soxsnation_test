/* Utils.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/15/2014
 *
 */



exports.parse = function(req, callback) {
	// Create new empty buffer
	var buf = new Buffer('');

	// Concatenate data to buffer
	req.on('data', function(data) {
		buf = Buffer.concat([buf, data]);
	});

	// Parse object
	req.on('end', function(data) {
		var obj;
		try {
			obj = JSON.parse(buf);
		} catch (e) {
			callback({
				status_code: 400,
				message: 'Invalid JSON'
			}, null);
			return;
		}
		callback(null, JSON.parse(buf));
	});
}

function getPermissions() {
	var permissions = {
		1: "user",
		2: "admin",
		4: "recipe",
		8: "tasks",
		16: "links",
		32: "goals",
		64: "module1",
		128: "module2"
	};
	return permissions;
}

exports.getPermissionNames = function(p) {
	var names = '';
	var permissions = getPermissions();
	for (var i in permissions) {
		if ((p & i) !== i) {
			names += getPermissions()[i] + ';';
		}
	}
	return names;
}

exports.Base64 = function() {
	return {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode: function(c) {
			var a = "",
				d, b, f, g, h, e, k = 0;
			for (c = this._utf8_encode(c); k < c.length;) d = c.charCodeAt(k++), b = c.charCodeAt(k++), f = c.charCodeAt(k++), g = d >> 2, d = (d & 3) << 4 | b >> 4, h = (b & 15) << 2 | f >> 6, e = f & 63, isNaN(b) ? h = e = 64 : isNaN(f) && (e = 64), a = a + this._keyStr.charAt(g) + this._keyStr.charAt(d) + this._keyStr.charAt(h) + this._keyStr.charAt(e);
			return a
		},
		decode: function(c) {
			var a = "",
				d, b, f, g, h, e = 0;
			for (c = c.replace(/[^A-Za-z0-9\+\/\=]/g,
				""); e < c.length;) d = this._keyStr.indexOf(c.charAt(e++)), b = this._keyStr.indexOf(c.charAt(e++)), g = this._keyStr.indexOf(c.charAt(e++)), h = this._keyStr.indexOf(c.charAt(e++)), d = d << 2 | b >> 4, b = (b & 15) << 4 | g >> 2, f = (g & 3) << 6 | h, a += String.fromCharCode(d), 64 != g && (a += String.fromCharCode(b)), 64 != h && (a += String.fromCharCode(f));
			return a = this._utf8_decode(a)
		},
		_utf8_encode: function(c) {
			c = c.replace(/\r\n/g, "\n");
			for (var a = "", d = 0; d < c.length; d++) {
				var b = c.charCodeAt(d);
				128 > b ? a += String.fromCharCode(b) : (127 < b && 2048 > b ? a +=
					String.fromCharCode(b >> 6 | 192) : (a += String.fromCharCode(b >> 12 | 224), a += String.fromCharCode(b >> 6 & 63 | 128)), a += String.fromCharCode(b & 63 | 128))
			}
			return a
		},
		_utf8_decode: function(c) {
			for (var a = "", d = 0, b = c1 = c2 = 0; d < c.length;) b = c.charCodeAt(d), 128 > b ? (a += String.fromCharCode(b), d++) : 191 < b && 224 > b ? (c2 = c.charCodeAt(d + 1), a += String.fromCharCode((b & 31) << 6 | c2 & 63), d += 2) : (c2 = c.charCodeAt(d + 1), c3 = c.charCodeAt(d + 2), a += String.fromCharCode((b & 15) << 12 | (c2 & 63) << 6 | c3 & 63), d += 3);
			return a
		}
	}
}