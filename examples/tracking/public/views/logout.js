/* logout.js
 *
 * Author(s):  Andrew Brown 
 * Date:       6/5/2014
 *
 */

alia.defineView({
	path: '/logout',
	dependencies: [
		'session', '$location'
	]
}, function(ctx, session, $location) {

	// Initiate logout
	session.logout();

	// Layout view
	alia.layoutContainer(ctx, {
		type: 'fluid'
	}, function(ctx) {

		alia.doParagraph(ctx, {
			text: 'Please wait while we log you out of the framework...'
		})

		alia.doParagraph(ctx, {
			text: "you are logged out",
			// visible: session.currentSession.map('.id').map(alia.isUndefined)
		})
	});
});