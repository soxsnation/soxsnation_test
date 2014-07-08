/* session.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

'use strict';

alia.defineService({
	name: 'session',
	dependencies: ['$location', '$promise', '$request']
}, function($location, $promise, $request) {

	var currentSession = new Bacon.Model(null);
	var currentUser = new Bacon.Model(null);

	var destination = null;

	var server = 'http://localhost:56902/api/TrackingUser/';
	var server2 = 'http://localhost:56902/api/TrackingUser/2';


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
		// return $request.get(server.get_session).flatMapLatest(function(res) {
		// return $request.get(server2).flatMapLatest(function(res) {
		// 	var csession = res.body;
		// 	console.log('init Session');
		// 	console.log(csession);
		// 	return $request.get(server2, {
		// 		// id: 2 //csession.user_id
		// 	}).map(function(res) {
		// 		var cuser = res.body;
		// 		console.log('cuser');
		// 		console.log(cuser);
		// 		currentUser.set(cuser);
		// 		currentSession.set(csession);
		// 	});
		// });
	}


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
		var h = 'Basic ' + Base64.encode(username + ':' + password);
		console.log(h);

		return $request({
				url: server,
				method: 'GET',
				headers: {
					Authorization: h
				},
				xhrFields: {
					withCredentials: true
				}
			})
			.flatMapLatest(function(res) {
				console.log("login");
				console.log(res);
				return init();
			});
	};


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Broadcast events

	alia.on('requestError', function(event, res) {
		console.log("session request error");
		console.log(res.statusCode);
		if (481 <= res.statusCode && res.statusCode <= 485) {
			console.log("session.on(requestError):", res.statusCode);
			// session = null;
			destination = ($location.path() === '/logout') ? '/home' : $location.path();
			console.log(destination);
			event.preventDefault();
			console.log(destination);
			// TODO: Figure out how to remove the need for this timeout
			// Without it, the initial page still loads, as well as the redirected one
			setTimeout(function() {
				console.log("timeout");
				$location.path('/login');
			}, 10);
		} else if (res.statusCode === 403) {
			event.preventDefault();
			$location.path('/forbidden');
		}
	});


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Initialization

	console.log("SESSION CONSTRUCTION");

	// return Bacon.fromBinder(function(sink) {
	// 	var observable = init();
	// 	observable.onValue(function() {
	// 		sink(session);
	// 	});
	// 	observable.onError(function() {
	// 		sink(session);
	// 	});
	// });



});