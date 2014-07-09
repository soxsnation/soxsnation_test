/* inventoryInStock.js
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
                text: 'Current Inventory Levels'
            });
        });
    }

    function doSubheader(ctx, selected, filter, itemGroups) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            alia.doSelect(ctx, {
                options: itemGroups,
                selected: selected
            });

            alia.doTextbox(ctx, {
                text: filter,
                placeholder: 'Filter Items'
            });
        });
    }

    function doTable(ctx, items, selected, filter) {
        var table = alia.doTable(ctx, {
            style: 'hover,striped',
            selectable: false,
            sortable: true,
            paging: {
                'default': 10,
                options: [10, 25, 50]
            },
            spinner: true,
            data: items,
            filter: filter,
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Description',
                property: '.itemName'
            }, {
                property: '.partType',
                filter: selected,
                hidden: true
            }, {
                heading: 'Minimum Levels',
                property: '.minInventory'
            }, {
                heading: 'Current Quantity',
                property: '.currentQuantity'
            }, {
                heading: 'Committed Quantity',
                property: '.committedQuantity'
            },{
                heading: 'Quantity Ordered',
                property: '.orderedQuantity'
            }],
            deferred: false
        });
    }

    alia.defineView({
        path: '/instock',
        dependencies: ['inv']
    }, function(ctx, inv) {
        var view = ctx;

        // State
        var items = alia.state(inv.getItems('inventory', 'prepped', true));
        var selected = alia.state('Photon Compensator');
        var itemGroups = alia.state(inv.getItemGroups(true));
        var filter = alia.state('');

        items.onResolve(function(data){
            console.log(data);
        })

        doHeader(ctx);
        doSubheader(ctx, selected, filter, itemGroups);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, items, selected, filter);
        });
    });
}());