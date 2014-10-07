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
		var btn = null;

		alia.doBreak(ctx, {});
		alia.doBreak(ctx, {});

		var form = layoutLoginForm(ctx, function(ctx) {
			var password = alia.state('');
			var username = alia.state('soxsnation@gmail.com');
			var submitting = alia.state(false);

			var credentials = alia.join(username, password, function(uname, pword) {
				if (alia.isEmptyString(uname) || alia.isEmptyString(pword)) {
					return void 0;
				} else {
					return {
						username: uname,
						password: pword
					};
				}
			});
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

			alia.doBreak(ctx, {});
			// Remember me field
			// alia.layoutFormField(ctx, {
			// 	special: 'checkbox',
			// 	width: width,
			// 	offset: {
			// 		large: 3,
			// 		small: 4
			// 	}
			// }, function(ctx) {
			// 	alia.doCheckbox(ctx, {
			// 		checked: true
			// 	});
			// 	alia.doText(ctx, {
			// 		text: ' Remember Me'
			// 	});
			// });

			// Sign in button
			alia.layoutFormField(ctx, {
				special: 'button',
				width: width,
				offset: {
					large: 3,
					small: 4
				}
			}, function(ctx) {
				btn = alia.doButton(ctx, {
					text: "Sign In",
					style: 'primary',
					loading: submitting,
					loadingStyle: 'expand-right',
					disabled: credentials.isUndefined().startWith(true) //false
				}).onClick(function() {
					// console.log("onclick");
					alia.doAlert(ctx, {
						type: 'danger',
						text: 'Incorrect username or password. Please try again'
						
					});
					return;

					submitting.set(true);

					// credentials.onResolve(function(creds) {

					var creds = credentials.get();
					session.login(creds.username, creds.password).onResolve(function(res) {
						submitting.set(false);
						var dest = session.destination();
						console.log(dest);
						// if (dest && dest !== '' && dest !== '/login') {
						// 	$location.path(dest);
						// } else {
						// 	$location.path('/');
						// }

					}).onError(function(err) {
						submitting.set(false);
						return;
						// password.set('');
						alia.doAlert(ctx, {
							type: 'danger',
							text: 'Incorrect username or password. Please try again',
							autohide: 5000
						});
					});
					// });


					// session.login(creds.username, creds.password).onValue(function(res) {
					// 	submitting.set(false);
					// 	$location.path('/');
					// }, function(err) {
					// 	console.log("Failed to login");
					// 	console.log(err);
					// });
				});
			});
		})

		$('form').bind('keypress', function(e) {
			// if (!credentials.isUndefined()) {
			if (e.keyCode == 13) {
				console.log('LOGIN ENTER Pressed');
				btn.doClick();
			}
			// }
		});

	});
}());