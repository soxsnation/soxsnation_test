alia.defineHeader({
	dependencies: ['session', 'nav']
}, function(session, nav) {
	return function(ctx) {

		alia.layoutNavbar(ctx, {
			fixed: 'top' //,
			// style: 'inverse'
		}, function(ctx) {

			alia.doNavbarLink(ctx, {
					link: 'inventory',
					text: 'Inventory'
				});

			alia.doNavbarLink(ctx, {
					link: 'recipes',
					text: 'Recipes'
				});


			alia.layoutNavbarDropdown(ctx, {
				text: 'Dropdown'
			}, function(ctx) {
				alia.doDropdownItem(ctx, {
					link: '#',
					text: 'Sub Link 1'
				});
				alia.doDropdownItem(ctx, {
					link: '#',
					text: 'Sub Link 2'
				});
			});

			alia.layoutNavbarRight(ctx, {

			}, function(ctx) {

				// --------------------------------------------------
				// Account menu

				alia.layoutNavbarDropdown(ctx, {
					text: 'Andrew Brown',
					visible: true
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
					}).onClick(function () {
						console.log("clicked");
					});
				});

				// --------------------------------------------------
				// Administration menu

				alia.layoutNavbarDropdown(ctx, {
					text: '<span class="glyphicon glyphicon-cog"></span>'
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