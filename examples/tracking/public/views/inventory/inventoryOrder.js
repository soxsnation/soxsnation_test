/* inventoryOrder.js
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
                text: 'Order'
            });
        });
    }

    function doSubheader(ctx, partType, vendor, vendorList, itemGroups) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            alia.doSelect(ctx, {
                options: itemGroups,
                selected: partType
            });

            alia.doSelect(ctx, {
                options: vendorList,
                selected: vendor
            });
        });
    }

    function doTable(ctx, items, partType, vendor) {
        var orderData = alia.state([]);

        alia.doHeading(ctx, {
            type: 4,
            text: 'Available Materials'
        });

        alia.doTable(ctx, {
            style: 'hover,striped',
            selectable: true,
            clickable: true,
            paging: {
                'default': 10,
                options: [5, 10, 25, 50]
            },
            data: items,
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Description',
                property: '.itemName'
            }, {
                property: '.partType',
                filter: partType,
                hidden: true
            }, {
                heading: 'Minimum Levels',
                property: '.minInventory'
            }, {
                heading: 'Current Quantity',
                property: '.currentQuantity'
            }, {
                heading: 'Quantity Ordered',
                property: '.orderedQuantity'
            }, {
                property: '.vendor',
                filter: vendor,
                hidden: true
            }]
        }).onRowClick(function(event, value) {
            var found = false;
            var tempData = orderData.get();
            for (var i = 0; i < tempData.length; ++i) {
                if (tempData[i].itemCode === value.itemCode) {
                    found = true;
                    tempData[i].quantity++;
                }
            }

            if (!found) {
                var item = {
                    itemCode: value.itemCode,
                    itemName: value.itemName,
                    quantity: 1
                };
                tempData.push(item);
            }

            orderData.set(tempData);
        });

        alia.doHeading(ctx, {
            type: 4,
            text: 'Active Purchase Order'
        });

        alia.doTable(ctx, {
            style: 'hover,striped',
            selectable: false,
            paging: {
                'default': 10,
                options: [5, 10, 25, 50]
            },
            data: orderData,
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Description',
                property: '.itemName'
            }, {
                heading: 'Quantity',
                property: '.quantity',
                editableType: 'number'
            }],
            deletable: true
        });


        alia.doButton(ctx, {
            text: 'Place Order',
            visible: orderData.then(function(value) {
                return (value.length > 0);
            })
        }).onClick(function() {
            var itemList = items.get();
            var date = new Date();
            var dateString = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
            var po = {
                cardCode: "V00033",
                inventoryOrder: true,
                dueDate: dateString,
                postingDate: dateString,
                items: []
            };

            for (var i = 0; i < itemList.length; ++i) {
                var orderAmt = itemList[i].minInventory - itemList[i].currentQuantity;
                po.items.push({
                    itemCode: itemList[i].itemCode,
                    quantity: orderAmt
                });
            }
        });
    }

    alia.defineView({
        path: '/order',
        dependencies: ['inv']
    }, function(ctx, inv) {
        var view = ctx;

        // State
        var partType = alia.state('Photon Compensator');
        var vendor = alia.state('');
        var items = alia.state(inv.getItems('inventory', 'order', true));
        var vendorList = alia.state([]);
        var itemGroups = alia.state(inv.getItemGroups(true));
        inv.getVendors().onResolve(function(value) {
            console.log(value);
            var list = [];
            for (var i = 0; i < value.length; ++i) {
                list.push({
                    text: value[i].cardName,
                    value: value[i].cardCode
                })
            };
            vendor.set(list[0].value);
            vendorList.set(list);
        });

        doHeader(ctx);
        doSubheader(ctx, partType, vendor, vendorList, itemGroups);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, items, partType, vendor);
        });
    });
}());