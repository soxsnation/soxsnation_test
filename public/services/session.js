/* session.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

'use strict';

alia.defineService({
	name: 'session',
	dependencies: ['$location', '$request']
}, function($location, $request) {

	var currentSession = alia.state('1');
	var currentUser = alia.state();
	var currentToken = alia.state();

	var destination = '/recipes';

	var server = 'http://localhost:3085/api/session/';


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Private functions

	function getSession() {
		console.log('getSession()');
		return $request.get(server.get_session);
	}

	function getUser(id) {
		return $request.get(server, {
			id: id
		});
	}

	function init() {
		console.log("SESSION INIT");
		console.log(currentSession.get());
		// return $request.get(server + 'session', {}, {
		// 	// email: currentUser.get().email,
		// 	// password: currentUser.get().password
		// }).then(function(res) {
		// var csession = res.body;
		// var reqUrl = server + 'validate';
		// console.log(reqUrl);
		// return $request.get(reqUrl, {}, {
		// 	// email: currentUser.get().email,
		// 	// password: currentUser.get().password
		// }).then(function(res) {
		// 	var cuser = res.body;
		// 	console.log('cuser');
		// 	console.log(cuser);
		// 	// console.log(csession);
		// 	currentUser.set(cuser);
		// 	// currentSession.set(csession);
		// });
		// // })

		return $request({
			url: server + 'validate',
			method: 'GET',
			headers: {
				Authorization: currentToken.get()
			},
			xhrFields: {
				withCredentials: true
			}
		}).then(function(res) {
			console.log("init is valid");
			console.log(res.body);
			currentToken.set(res.body);
			return $request({
				url: server + 'user',
				method: 'GET',
				headers: {
					Authorization: currentToken.get()
				},
				xhrFields: {
					withCredentials: true
				}
			}).then(function(res) {
				console.log("init gotuser");
				console.log(res.body);
				currentUser.set(res.body);
			});
		});

	};


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Service functions

	var session = {};

	session.currentSession = function() {
		return currentSession;
	};

	session.currentUser = function() {
		return currentUser;
	};

	session.destination = function() {
		return destination;
	}

	session.login = function(username, password, options) {
		console.log("session.login:", username, password);
		// var h = 'Basic ' + Base64.encode(username + ':' + password);
		// console.log(h);

		// var creds = {
		// 	email: username,
		// 	password: password
		// }
		// console.log(creds);
		// return $request.post(server + 'login', creds).then(function(res) {
		// 	console.log('login');
		// 	var cuser = res.body;
		// 	console.log('cuser');
		// 	console.log(cuser);
		// 	currentUser.set(cuser);
		// 	return init();
		// });

		return $request({
			url: server + 'login',
			method: 'GET',
			headers: {
				Authorization: 'Basic ' + Base64.encode(username + ':' + password)
			},
			xhrFields: {
				withCredentials: true
			}
		}).then(function(res) {
			console.log("login");
			// console.log(res.body);
			currentToken.set(res.body);
			return init();
		});
	};

	session.verify = function(password) {
		console.log('verify');
		return $request.get(server, {}, {
			type: 'verify',
			username: currentUser.get().username,
			password: password
		}).then(function(res) {

		});
	}

	session.logout = function() {
		// return $request.get(server, {}, {
		// 	type: 'logout'
		// }).then(function(res) {
		// 	console.log('cuser');
		// 	console.log(res.body);
		// 	currentSession.set(null);
		// 	currentUser.set(null);
		// 	$location.path('/login');
		// 	// if (res.statusCode === 205) {
		// 	// 	$location.path('/login');
		// 	// } else if (res.statusCode === 406) {
		// 	// 	event.preventDefault();
		// 	// 	$location.path('/login');
		// 	// }
		// });
		console.log('logout')
		// return $request({
		// 	url: server + 'logout',
		// 	method: 'GET',
		// }).then(function(res) {
		// 	console.log("logout");
		// 	currentSession.set(null);
		// 	currentUser.set(null);
		// 	$location.path('/login');
		// });

		return $request({
			url: server + 'logout',
			method: 'GET',
			headers: {
				Authorization: currentToken.get()
			},
			xhrFields: {
				withCredentials: true
			}
		}).then(function(res) {
			console.log("logout complete");
			currentToken.set('');
			currentUser.set(null);
			$location.path('/login');
		});
	};


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Broadcast events

	alia.on('requestError', function(event, res) {
		console.log("session request error");
		console.log(res.statusCode);
		// if (481 <= res.statusCode && res.statusCode <= 485) {
		if (res.statusCode === 403) {
			console.log("session.on(requestError):", res.statusCode);
			// session = null;
			destination = ($location.path() === '/logout') ? '/login' : $location.path();
			console.log(destination);
			event.preventDefault();

			// TODO: Figure out how to remove the need for this timeout
			// Without it, the initial page still loads, as well as the redirected one
			setTimeout(function() {
				console.log("timeout");
				$location.path('/login');
			}, 10);
		} else if (res.statusCode === 401) {
			// No credentials provided
			event.preventDefault();
			$location.path('/login');
		} else if (res.statusCode === 403) {
			event.preventDefault();
			$location.path('/forbidden');
		} else if (res.statusCode === 409) {
			// Valid user, but they don't have permission for this request
			console.log('Valid user, but they dont have permission for this request');
			event.preventDefault();
			$location.path('/');
		}
	});


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Initialization

	console.log("SESSION CONSTRUCTION");

	return alia.deferred(function(resolve, reject) {
		init().observe(function(value) {
			resolve(session);
		}, null, function() {
			resolve(session);
		});
	});



});