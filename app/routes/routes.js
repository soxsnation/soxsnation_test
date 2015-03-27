/* routes.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

/**
 * Controllers
 */

var snController = require('../controllers/snController');
var soxController = require('../controllers/soxController');



var session = require('../controllers/sessionController');
var soxsController = require('../controllers/soxsController');
var soxsDataController = require('../controllers/soxsDataController');
var authControl = require('../controllers/authController');
var users = require('../controllers/users');
var recipes = require('../controllers/recipes');
var express = require('express');
var fpath = require('path');
var User = require('../models/User');
var Auth = require('../lib/authorization');

var _ = require('underscore');
var jwt = require('jwt-simple');
/**
 * Expose routes
 */

module.exports = function(app, passport) {

	// TODO: I had to add this in to support CORS requests. I'm not sure this is the way to do this.
	// app.use(function(req, res, next) {
	// 	res.header("Access-Control-Allow-Origin", "*");
	// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	// 	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
	// 	res.header("Access-Control-Allow-Credentials", "true");
	// 	next();
	// });	

/***********************************************************************************************************************
* Session Routes
***********************************************************************************************************************/

	app.set('jwtTokenSecret', '123456ABCDEF');
	var tokens = [];

	function requiresAuthentication(request, response, next) {
		console.log('requiresAuthentication');
		// console.log(request.headers);
		if (request.headers.access_token) {
			var token = request.headers.access_token;
			if (_.where(tokens, token).length > 0) {
				var decodedToken = jwt.decode(token, app.get('jwtTokenSecret'));
				if (new Date(decodedToken.expires) > new Date()) {
					next();
					return;
				} else {
					removeFromTokens();
					response.end(401, "Your session is expired");
				}
			}
		}
		response.end(401, "No access token found in the request");
	}

	function removeFromTokens(token) {
		for (var counter = 0; counter < tokens.length; counter++) {
			if (tokens[counter] === token) {
				tokens.splice(counter, 1);
				break;
			}
		}
	}

	app.post('/api/login', function(request, response) {
		console.log('api/login');

		var userName = request.body.userName;
		var password = request.body.password;

		if (userName === "andrew" && password === "123") {
			var expires = new Date();
			expires.setDate((new Date()).getDate() + 5);
			var token = jwt.encode({
				userName: userName,
				expires: expires
			}, app.get('jwtTokenSecret'));

			tokens.push(token);

			response.send(200, {
				access_token: token,
				userName: userName
			});
		} else {
			response.send(401, "Invalid credentials");
		}
	});

	// app.post('/api/login', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(200);
	// 	});

	// app.post('/api/session/login', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(req.user);
	// 	});

	// app.post('/api/session/session', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(req.user);
	// 	});

	// app.post('/api/session/user', passport.authenticate('local'),
	// 	function(req, res) {
	// 		res.send(req.user);
	// 	});

/***********************************************************************************************************************
* API Routes
***********************************************************************************************************************/

/*****************************************************************************************
* snData
*****************************************************************************************/

app.get('/api/sn/:snDataType/:id', snController.get_snData_by_id);
app.get('/api/sn/:snDataType', snController.get_snData);
app.post('/api/sn/:snDataType', snController.post_snData);

/*****************************************************************************************
* soxsData
*****************************************************************************************/

app.get('/api/sox/:soxsDataType/:id', soxController.get_soxs_data_by_id);
app.get('/api/sox/:soxsDataType', soxController.get_soxs_data);
app.post('/api/sox/:soxsDataType', soxController.post_soxs_data);

/*****************************************************************************************
* Session Routes
*****************************************************************************************/

	app.get('/api/session/validate', authControl.validate);
	app.get('/api/session/login', authControl.login);
	app.get('/api/session/logout', authControl.logout);
	app.get('/api/session/user', authControl.getUser);
	app.get('/api/session/changepassword', authControl.changepassword);
	// app.get('/api/session/login', authControl.changepassword);

	// app.get('/api/session/user/:id', session.getUser);
	// app.get('/api/session/get/:id', session.getSession);

/*****************************************************************************************
* soxsObjects Routes
*****************************************************************************************/

	app.get('/api/soxsSchema/_all', soxsController.getSchemas);
	app.get('/api/soxsSchema/:id', soxsController.getSchema);
	app.post('/api/soxsSchema/create', soxsController.createSoxsSchema);
	app.post('/api/soxsSchema/update/:id', soxsController.updateSoxsSchema);

	app.get('/api/soxsType/_all', soxsController.getTypes);
	app.get('/api/soxsType/:id', soxsController.getType);
	app.post('/api/soxsType/create', soxsController.createType);
	app.post('/api/soxsType/update/:id', soxsController.updateType);

/*****************************************************************************************
* soxsTemplatesElements Routes
*****************************************************************************************/

	app.get('/api/soxs/template_elements', soxsController.get_template_elements);
	app.get('/api/soxs/template_element/:id', soxsController.get_template_element);
	app.post('/api/soxs/template_element', soxsController.post_template_element);
	app.put('/api/soxs/template_element/:id', soxsController.put_template_element);
	app.delete('/api/soxs/template_element/:id', soxsController.delete_template_element);

/*****************************************************************************************
* soxsTemplates Routes
*****************************************************************************************/

	app.get('/api/soxs/templates', snController.get_templates);
	// app.get('/api/soxs/template/:id', soxsController.get_template);
	app.post('/api/soxs/template', snController.post_template);
	// app.put('/api/soxs/template/:id', soxsController.put_template);
	// app.delete('/api/soxs/template/:id', soxsController.delete_template);

	// app.get('/api/soxsTemplate/_all', soxsController.getTemplates);
	// app.get('/api/soxsTemplate/:id', soxsController.getTemplate);
	// app.post('/api/soxsTemplate/create', soxsController.createSoxsTemplate);


/*****************************************************************************************
* Test
*****************************************************************************************/

app.get('/api/soxs/test/:id', snController.get_tests);
app.post('/api/soxs/test', snController.post_tests);

/*****************************************************************************************
* soxsData Routes
*****************************************************************************************/

	app.get('/api/soxs/get/:type/:id', soxsDataController.get);
	app.get('/api/soxs/getall/:type', soxsDataController.getall);

	app.post('/api/soxs/insert/:type', soxsDataController.insert);
	app.post('/api/soxs/update/:type/:id', soxsDataController.update);

	app.get('/api/soxs/archive/:type/:id', soxsDataController.archive);
	app.get('/api/soxs/delete/:type/:id', soxsDataController.delete);

	app.get('/api/soxs/type/:type', soxsDataController.get_type_by_name);
	// app.get('/api/soxs/types', authControl.authorized, soxsDataController.get_types);
	app.get('/api/soxs/types', soxsDataController.get_types);


/*****************************************************************************************
* User Routes
*****************************************************************************************/

	// app.get('/api/userpermissions')
	app.get('/api/users', users.users);
	app.get('/api/user/:id', users.user);
	app.post('/api/insert/user', users.create);
	app.post('/api/update/user/:id', users.update);



}