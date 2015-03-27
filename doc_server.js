/* doc_server.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/26/2015
 *
 */


var express = require('express');
var fpath = require('path');
var app = express();

var fs = require('fs');


app.use(express.cookieParser());
app.use(express.bodyParser());


// ********************************************************************
// docs site
app.use('/', express.static('./docs/html'));
app.use('/', function(req, res, next) {

	res.sendfile(fpath.join(__dirname, 'docs', 'index.html'));
	
});






app.listen(3085, function() {
	console.log('Server Ready [port 3085]')
});