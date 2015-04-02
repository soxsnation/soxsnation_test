/* deploy.js
 *
 * Author(s):  Andrew Brown
 * Date:       4/1/2015
 *
 */


var mongoose = require('mongoose');
var fs = require('fs');
var soxsLog = require('../app/lib/soxsLog')('load_data');

var config = require('../config/config');
// var load_data = require('./load_data');

var env = 'staging';
// console.log('config:' + config.server + ' : ' + 'mongodb://' + config.server + '/' + config[env].db);

// Bootstrap db connection
// Connect to mongodb
var connect = function() {

    var options = {
        // user: 'soxsnation',
        // pass: 's0xn@t10n'
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    }
    mongoose.connect('mongodb://' + config.server + '/' + config[env].db, options);
}
connect();

// Error handler
mongoose.connection.on('error', function(err) {
    console.log(err)
});

// Reconnect when closed
mongoose.connection.on('disconnected', function() {
    connect()
});

function bootstrap_models() {
    // Bootstrap models
    var models_path = __dirname.replace('deploy', 'app/models'); // + '../app/models';
    // console.log('models_path');
    // console.log(models_path);
    fs.readdirSync(models_path).forEach(function(file) {
        // console.log(file)
        if (~file.indexOf('.js')) require(models_path + '/' + file)
    });

    models_path = __dirname.replace('deploy', 'app/modelsox');
    fs.readdirSync(models_path).forEach(function(file) {
        // console.log(file)
        if (~file.indexOf('.js')) require(models_path + '/' + file)
    });
    // console.log('done loading models');
    var load_data = require('./load_data');
    load_data.snData();
    // load_data.soxData();
}

function init() {
	console.log('init');
    bootstrap_models();
    // load_data.soxData();
}
init();
