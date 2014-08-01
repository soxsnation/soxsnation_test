/* logout.js
 *
 * Author(s):  Andrew Brown 
 * Date:       6/5/2014
 *
 */

alia.defineView({
    path: '/mylinks',
    dependencies: [
        'session','$location'
    ]
}, function(ctx, session, $location) {
// console.log(session.currentUser().get());
// if (session.currentUser().get() === null) {
//     $location.path('/login');
// }
// else if (session.currentUser().get() === undefined) {
//     $location.path('/login');
// }

    alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Links'
            });
        });

});



