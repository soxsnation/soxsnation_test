/* streamServer.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/25/2015 *
 */

/**
 * streamServer module.
 * @module streamServer
 */

// var http = require('http');
// var BinaryServer = require('binaryjs').BinaryServer;
// var fs = require('fs');

// var server = http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(3088);



// // Create a BinaryServer attached to our existing server
// var binaryserver = new BinaryServer({server: server, path: '/binary-endpoint'});

// binaryserver.on('connection', function(client){
//   var file = fs.createReadStream(__dirname + '/flower.png');
//   client.send(file);
// });


var icecast = require("icecast"), // I'll talk about this module later
    lame = require("lame");

var encoder = lame.Encoder({
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100
});
encoder.on("data", function(data) {
    sendData(data);
});
var decoder = lame.Decoder();
decoder.on('format', function(format) {
    decoder.pipe(encoder);
});

var url = 'http://stream.pedromtavares.com:10000'
icecast.get(url, function(res) {
            res.on('data', function(data) {
                decoder.write(data);
            });
        }

        var clients = []; // consider that clients are pushed to this array when they connect

        function sendData(data) {
            clients.forEach(function(client) {
                client.write(data);
            });
        }
