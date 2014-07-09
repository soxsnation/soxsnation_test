/* workorders.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/5/2014
 *
 */

function pastViewport() {
    return function(ctx) {
        var view = ctx;

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

alia.defineMultiview({
    path: '/workorders',
    dependencies: [
        '$location', 'session', 'inv'
    ],
}, function(multiview, $location, session, inv) {
    multiview.navigation(function(ctx) {
        alia.layoutMultiviewNavigationLinkset(ctx, {}, function(ctx) {
            alia.doMultiviewNavigationHeader(ctx, {
                text: 'Developmental Work Orders'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Open Work Orders',
                view: 'openWorkOrders'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Cutdowns',
                view: 'cutdowns'
            })
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
        });
    }).include({
        name: 'cutdowns',
        path: '/cutdowns'
    }).include({
        name: 'openWorkOrders',
        path: '/openWorkOrders'
    }).view({
        name: 'past',
        //control: organizationsController($location, iam),
        viewport: pastViewport()
    }).view({
        name: 'mine',
        viewport: mineViewport()
    }).include({
        name: 'workOrder',
        path: '/workOrder'
    }).begin('openWorkOrders');
});