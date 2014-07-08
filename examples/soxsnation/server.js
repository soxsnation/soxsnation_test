/* server.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/3/2014
 *
 */

var express = require('express');
var fpath = require('path');
var app = express();

var mongoose = require('mongoose');
var fs = require('fs');

// // TODO: I had to add this in to support CORS requests. I'm not sure this is the way to do this.
// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
// 	res.header("Access-Control-Allow-Credentials", "true");
// 	next();
// });




// Bootstrap db connection
// Connect to mongodb
var connect = function() {
	var options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	}
	mongoose.connect('mongodb://192.168.1.215/soxsnation', options)
}
connect()

// Error handler
mongoose.connection.on('error', function(err) {
	console.log(err)
})

// Reconnect when closed
mongoose.connection.on('disconnected', function() {
	connect()
})

// Bootstrap models
var models_path = __dirname + '/server/models';
fs.readdirSync(models_path).forEach(function(file) {
	if (~file.indexOf('.js')) require(models_path + '/' + file)
});

// Bootstrap routes
require('./server/routes/routes')(app);

app.use('/alia', express.static('../../src'));
app.use('/', express.static('./public'));
app.use('/', function(req, res, next) {
	res.sendfile(fpath.join(__dirname, 'public', 'index.html'));
});

app.listen(3080, function() {
	console.log('Server Ready [port 3080]')
});