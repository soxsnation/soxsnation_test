/* inventory.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/5/2014
 *
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Multiview

alia.defineMultiview({
    path: '/inventory',
    dependencies: [
        '$location', '$route', 'session', 'inv'
    ],
}, function(multiview, $location, $route, session, inv) {
    multiview.navigation(function(ctx) {
        alia.layoutMultiviewNavigationLinkset(ctx, {}, function(ctx) {
            alia.doMultiviewNavigationHeader(ctx, {
                text: 'Inventory'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Current Levels',
                view: 'instock'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Order Material',
                view: 'order'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Receive Material',
                view: 'receive'
            });

            alia.doMultiviewNavigationDivider(ctx, {});
            alia.doMultiviewNavigationHeader(ctx, {
                text: 'Purchasing'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Add Purchase Order',
                view: 'addpurchaseOrder'
            });
            alia.doMultiviewNavigationDivider(ctx, {});
            alia.doMultiviewNavigationHeader(ctx, {
                text: 'Counting'
            });
            alia.doMultiviewNavigationItem(ctx, {
                text: 'Inventory Counts',
                view: 'counts'
            });
        });
    }).include({
        name: 'instock',
        path: '/instock'
    }).include({
        name: 'counts',
        path: '/inventorycounts'
    }).include({
        name: 'order',
        path: '/order'
    }).include({
        name: 'receive',
        path: '/receive'
    }).include({
        name: 'purchaseOrder',
        path: '/purchaseOrder'
    }).include({
        name: 'addpurchaseOrder',
        path: '/addPurchaseOrder'
    }).begin('receive');
});