/* workorders.js
 *
 * Author(s):  Andrew Brown 
 * Date:       6/5/2014
 *
 */

function activeViewport() {
    return function(ctx) {
        var view = ctx;

        // var modal = layoutCreateOrganizationModal(ctx, iam);
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Active'
            });
        });
    }
}

function pastViewport() {
    return function(ctx) {
        var view = ctx;

        // var modal = layoutCreateOrganizationModal(ctx, iam);
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Past'
            });
        });
    }
}

function mineViewport() {
    return function(ctx) {
        var view = ctx;

        // var modal = layoutCreateOrganizationModal(ctx, iam);
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Mine'
            });
        });
    }
}

function currentViewport() {
    return function(ctx) {
        var view = ctx;

        // var modal = layoutCreateOrganizationModal(ctx, iam);
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Current'
            });
        });
    }
}


alia.defineMultiview({
    path: '/workorders',
    dependencies: [
        '$location', 'session'
    ],
}, function(multiview, $location, session) {
    multiview.navigation(function(ctx) {
        alia.layoutMultiviewNavigationLinkset(ctx, {}, function(ctx) {
            alia.doMultiviewNavigationHeader(ctx, {
                text: 'Developmental Work Orders'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Active Work Orders',
                view: 'active'
            });
            alia.doMultiviewNavigationDivider(ctx, {});

            alia.doMultiviewNavigationHeader(ctx, {
                text: 'Work Orders'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Past Work Orders',
                view: 'past'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'My Work Orders',
                view: 'mine'
            });
            // alia.doMultiviewNavigationItem(ctx, {
            //     text: 'Groups',
            //     view: 'groups'
            // });
            // alia.doMultiviewNavigationItem(ctx, {
            //     text: 'Users',
            //     view: 'users'
            // });
        });
    }).view({
        name: 'active',
        viewport: activeViewport() //,
        //menu: dashboardMenu
    }).view({
        name: 'past',
        //control: organizationsController($location, iam),
        viewport: pastViewport()
    }).view({
        name: 'mine',
        viewport: mineViewport()
    }).view({
        name: 'current',
        viewport: currentViewport()
    }).begin('active');



})