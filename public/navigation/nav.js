alia.defineHeader({
	dependencies: ['session', 'nav', 'sox']
}, function(session, nav, sox) {

	var userActive = alia.state(false);
	var usersName = alia.state('');
	var user = alia.state(session.currentUser());
	var permission = alia.state(0);
	user.onResolve(function(data) {
		// console.log(data);
		if (data === null) {
			userActive.set(false);
			usersName.set('');
		} else {
			userActive.set(true);
			usersName.set(data.firstName + ' ' + data.lastName);
			permission.set(data.permissions);
		}
	})


	return function(ctx) {

		alia.layoutNavbar(ctx, {
			fixed: 'top',
			brand: 'soxsnation'
			// style: 'inverse'
		}, function(ctx) {

			alia.doNavbarLink(ctx, {
				link: 'recipes',
				text: 'Recipes'
				// ,visible: permission.onResolve(function(data) {
				// 	console.log('recipe permission: ' + ((data & 4) === 4))
				// 	return ((data & 4) === 4);
				// })
			});

			alia.doNavbarLink(ctx, {
				link: 'mylinks',
				text: 'My Links',
				visible: true
			});

			alia.doNavbarLink(ctx, {
				link: 'tasks',
				text: 'Tasks'
			});

			alia.doNavbarLink(ctx, {
				link: 'goals',
				text: 'My Goals'
			});


			// alia.layoutNavbarDropdown(ctx, {
			// 	text: 'Dropdown'
			// }, function(ctx) {
			// 	alia.doDropdownItem(ctx, {
			// 		link: '#',
			// 		text: 'Sub Link 1'
			// 	});
			// 	alia.doDropdownItem(ctx, {
			// 		link: '#',
			// 		text: 'Sub Link 2'
			// 	});
			// });

			alia.layoutNavbarRight(ctx, {

			}, function(ctx) {

				// --------------------------------------------------
				// Account menu

				alia.layoutNavbarDropdown(ctx, {
					text: usersName,
					visible: userActive
				}, function(ctx) {
					alia.doDropdownHeader(ctx, {
						text: 'Account'
					});
					alia.doDropdownItem(ctx, {
						link: '#',
						text: 'My Profile'
					});
					alia.doDropdownItem(ctx, {
						link: '#',
						text: 'Configure Applications'
					});
					alia.doDropdownDivider(ctx, {});
					alia.doDropdownItem(ctx, {
						link: 'logout',
						text: 'Logout'
					}).onClick(function() {
						// console.log("clicked");
					});
				});

				// --------------------------------------------------
				// Administration menu

				alia.layoutNavbarDropdown(ctx, {
					text: '<span class="glyphicon glyphicon-cog"></span>',
					visible: userActive
				}, function(ctx) {
					alia.doDropdownHeader(ctx, {
						text: 'Administration'
					});
					alia.doDropdownItem(ctx, {
						link: '#',
						text: 'Application Management'
					});
					alia.doDropdownItem(ctx, {
						link: 'iam',
						text: 'Identity and Access Management'
					});
					alia.doDropdownItem(ctx, {
						link: '#',
						text: 'Billing Management'
					});
				});
			})
		});
	};
});