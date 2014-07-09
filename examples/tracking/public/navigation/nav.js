alia.defineHeader({
	dependencies: ['session', 'nav']
}, function(session, nav) {
	return function(ctx) {

		var userActive = alia.state(false);
		var user = alia.state(session.currentUser());
		var username = alia.state();
		user.onResolve(function(u) {
			if (u === null) {
				username.set('');
				userActive.set(false);
			} else {
				username.set(u.firstName + ' ' + u.lastName);
				userActive.set(true);
			}
		});


		alia.layoutNavbar(ctx, {
			fixed: 'top',
			brand: '.decimal Inventory' //,
			// style: 'inverse'
		}, function(ctx) {

			alia.doNavbarLink(ctx, {
				link: 'inventory',
				text: 'Inventory',
				visible: userActive
			});

			alia.doNavbarLink(ctx, {
				link: 'workorders',
				text: 'Work Orders',
				visible: userActive
			});



			alia.layoutNavbarRight(ctx, {

			}, function(ctx) {

				// --------------------------------------------------
				// Account menu



				alia.layoutNavbarDropdown(ctx, {
					text: username,
					visible: userActive
				}, function(ctx) {
					alia.doDropdownHeader(ctx, {
						text: 'Account'
					});
					alia.doDropdownItem(ctx, {
						link: '',
						text: 'Open Tracking'
					}).onClick(function() {
						window.open('http://tracking.dotdecimal.com');
						console.log("clicked");
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
						console.log("clicked");
					});
				});

				// --------------------------------------------------
				// Administration menu

				// alia.layoutNavbarDropdown(ctx, {
				// 	text: '<span class="glyphicon glyphicon-cog"></span>'
				// }, function(ctx) {
				// 	alia.doDropdownHeader(ctx, {
				// 		text: 'Administration'
				// 	});
				// 	alia.doDropdownItem(ctx, {
				// 		link: '#',
				// 		text: 'Application Management'
				// 	});
				// 	alia.doDropdownItem(ctx, {
				// 		link: 'iam',
				// 		text: 'Identity and Access Management'
				// 	});
				// 	alia.doDropdownItem(ctx, {
				// 		link: '#',
				// 		text: 'Billing Management'
				// 	});
				// });



				// --------------------------------------------------
				// Help menu

				// alia.layoutNavbarDropdown(ctx, {
				// 	text: '<span class="glyphicon glyphicon-question-sign"></span>'
				// }, function(ctx) {
				// 	alia.doDropdownHeader(ctx, {
				// 		text: 'Help'
				// 	});
				// 	alia.doDropdownItem(ctx, {
				// 		link: '#',
				// 		text: 'Forums'
				// 	});
				// 	alia.doDropdownItem(ctx, {
				// 		link: '#',
				// 		text: 'Support'
				// 	});
				// 	alia.doDropdownItem(ctx, {
				// 		link: 'documentation',
				// 		text: 'Documentation'
				// 	});
				// });
			})
		});
	};
});