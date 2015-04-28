/* deploy.js
 *
 * Author(s):  Andrew Brown
 * Date:       4/1/2015
 *
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');
var soxsLog = require('../app/lib/soxsLog')('load_data');

var config = require('../config/config');
// var load_data = require('./load_data');

var env = 'development';
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

function install_sn_types() {
    var load_data = require('./load_data');
    load_data.soxData();
}

function install_element_types() {
    var load_elementTypes = require('./load_elementTypes');
    load_elementTypes.install_elements();
}

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
    
    

    // install_sn_types();

    install_element_types();
}

function init() {
        console.log('init');
        bootstrap_models();
        // load_data.soxData();
    }
    init();


function test_sub_docs() {

    // var models_path = __dirname.replace('deploy', 'app/models/test');
    var childSchema = new Schema({
        name: 'String'
    });

    var parentSchema = new Schema({
        child: [childSchema],
        age: 'Number'
    });

    console.log(JSON.stringify(parentSchema))

    var Parent = mongoose.model('Parent', parentSchema);

    var pars = Parent.find().exec(function(err, d) {
        console.log(err);
        console.log(d);
    });

    // var p = new Parent({ child: [{name: 'Andrew'}], age: 34});
    // p.save(function(err,d) {
    //     console.log(err);
    //     console.log(d);
    // });



}
// test_sub_docs();
