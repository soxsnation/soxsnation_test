/* inventoryReceive.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/5/2014
 *
 */

"use strict";

(function() {
    function doHeader(ctx) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Receive'
            });
        });
    }

    function doSubheader(ctx, inv) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {

            // alia.doButton(ctx, {
            //     text: 'Receive Order'
            // }).onClick(function() {
            //     console.log('Receive Order');

            //     inv.getOpenPurchaseOrders().onResolve(function(value) {
            //         console.log(value);
            //     })

            //     // inv.getOpenPurchaseOrders().onValue(function(temp) {
            //     //     console.log('temp');
            //     //     console.log(temp);
            //     // })

            //     var po = {};
            // });
        });
    }

    function doTable(ctx, view, items) {
        var table = alia.doTable(ctx, {
            style: 'hover',
            selectable: true,
            data: items,
            spinner: true,
            paging: false,
            header: ['Vendor', 'Order Date', 'Num'],
            clickable: true,
            fields: [{
                heading: 'Vendor',
                property: '.vendorName'
            }, {
                heading: 'Date',
                property: '.postingDate',
                map: function(value) {
                    return (new Date(value)).toDateString();
                }
            }, {
                heading: 'Num',
                property: '.docNum'
            }]
        }).onRowClick(function(event, item) {
            view.push('purchaseOrder', {
                id: item.docNum,
                vendor: item.cardCode
            });
        });
    }

    alia.defineView({
        path: '/receive',
        dependencies: ['inv']
    }, function(ctx, inv) {
        var view = ctx;

        // State
        var items = alia.state(inv.getOpenPurchaseOrders());
        // var selected = alia.state('Photon Compensator');

        doHeader(ctx);
        // doSubheader(ctx, inv);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, view, items);
        });
    });
}());