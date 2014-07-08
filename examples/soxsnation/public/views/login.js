/* login.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/5/2014
 *
 */


'use strict';

(function() {

	// --------------------------------------------------
	// Private variables

	var labelwidth = {
		large: 3,
		small: 4
	};

	var width = {
		large: 9,
		small: 8
	};

	// --------------------------------------------------
	// Private state

	// var username = alia.initState(null);
	// var password = alia.initState(null);
	// var credentials = username.combine(password, function(uname, pword) {
	// 	if (alia.isEmptyString(uname) || alia.isEmptyString(pword)) {
	// 		return null;
	// 	} else {
	// 		return {
	// 			username: uname,
	// 			password: pword
	// 		};
	// 	}
	// });
	// var submitting = alia.initState(false);

	// --------------------------------------------------
	// Private functions

	function layoutLoginForm(ctx, callback) {
		alia.layoutContainer(ctx, {
			type: 'fixed'
		}, function(ctx) {
			alia.layoutRow(ctx, {
				padding: {
					top: 100
				}
			}, function(ctx) {
				alia.layoutColumn(ctx, {
					width: {
						medium: 4
					},
					offset: {
						medium: 4
					}
				}, function(ctx) {
					alia.layoutPanel(ctx, {
						header: 'Please sign in',
						headerStyle: 'h3'
					}, function(ctx) {
						alia.layoutForm(ctx, {
							style: 'default'
						}, callback);
					});
				});
			});
		});
	}

	// --------------------------------------------------
	// Define view

	alia.defineView({
		path: '/login',
		dependencies: [
			'$location', 'session'
		]
	}, function(ctx, $location, session) {
		layoutLoginForm(ctx, function(ctx) {

			// Username field
			alia.layoutFormField(ctx, {
				width: width
			}, function(ctx) {
				alia.doTextbox(ctx, {
					text: username,
					placeholder: 'Username',
					disabled: submitting
				});
			});

			// Password field
			alia.layoutFormField(ctx, {
				width: width
			}, function(ctx) {
				alia.doTextbox(ctx, {
					text: password,
					placeholder: 'Password',
					type: 'password',
					disabled: submitting
				});
			});

			// Remember me field
			alia.layoutFormField(ctx, {
				special: 'checkbox',
				width: width,
				offset: {
					large: 3,
					small: 4
				}
			}, function(ctx) {
				alia.doCheckbox(ctx, {
					checked: true
				});
				alia.doText(ctx, {
					text: ' Remember Me'
				});
			});

			// Sign in button
			alia.layoutFormField(ctx, {
				special: 'button',
				width: width,
				offset: {
					large: 3,
					small: 4
				}
			}, function(ctx) {
				var btn = alia.doButton(ctx, {
					text: "Sign In",
					style: 'primary',
					loading: submitting,
					loadingStyle: 'expand-right',
					disabled: username.combine(password, function(username, password) {
						return alia.isEmptyString(username) || alia.isEmptyString(password);
					})
				}).onClick(function() {
					console.log("onclick");
					submitting.set(true);

					credentials.onValue(function(creds) {
						console.log('credentials.onValue');
						console.log(creds);
						session.login(creds.username, creds.password).onValue(function(res) {
							submitting.set(false);
							var dest = session.destination();
							if (dest && dest !== '' && dest !== '/login') {
								$location.path(dest);
							} else {
								console.log('home');
								$location.path('/');
							}
						}, function(err) {
							console.log("Failed to login");
							console.log(err);
						});
					});


					// session.login(creds.username, creds.password).onValue(function(res) {
					// 	submitting.set(false);
					// 	$location.path('/');
					// }, function(err) {
					// 	console.log("Failed to login");
					// 	console.log(err);
					// });
				});
			});
		});
	});
}());