/* addPurchaseOrder.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/11/2014
 *
 */

"use strict";

(function() {

    function conformationModal(ctx, success) {

        if (success) {
            alia.doAlert(ctx, {
                type: 'success',
                text: 'Purchase Order added successfully',
                autohide: 5000
            });
        } else {
            alia.doAlert(ctx, {
                type: 'danger',
                text: 'ERROR: There was an error adding the Purchase Order',
                autohide: 5000
            });

        }
    }

    function doHeader(ctx) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Add Purchase Order'
            });
        });
    }

    function doSubheader(ctx, inv, vendors, activeVendor, items, poData, filter) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            var select = alia.doSelect(ctx, {
                options: vendors.then(function(value) {
                    var list = [];
                    list.push({
                        text: 'Select Vendor',
                        value: ''
                    });
                    for (var i = 0; i < value.length; ++i) {
                        list.push({
                            text: value[i].cardName,
                            value: value[i].cardCode
                        });
                    }
                    return list;
                })
            });

            select.selected.onResolve(function(value) {
                if (typeof value === 'undefined') return;
                items.set([]);
                poData.set([]);
                activeVendor.set(value);
                inv.getItemsByVendor(value, 'none').onResolve(function(data) {
                    if (data.length === 0) return;
                    items.set(data);
                });
            });

            var filterBox = alia.doTextbox(ctx, {
                text: filter,
                placeholder: 'Filter Items'
            });
        });
    }

    function doAvailableItems(ctx, items, poData, filter) {
        alia.doHeading(ctx, {
            type: 4,
            text: 'Available Purchase Order Items'
        });

        var table = alia.doTable(ctx, {
            style: 'hover,striped',
            header: ['Item Code', 'Description'],
            dataType: 'object',
            data: items,
            sortable: true,
            filter: filter,
            clickable: true,
            selectable: true,
            paging: {
                'default': 5,
                options: [5, 10]
            },
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Description',
                property: '.itemName'
            }]
        }).onRowClick(function(event, value) {
            var found = false;
            var tempData = poData.get();
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
                    itemWidth: value.width,
                    itemLength: value.length,
                    quantity: 1

                };
                tempData.push(item);
            }

            poData.set(tempData);
        });
    }

    function doActivePurchaseOrder(ctx, poData, filter, vendors, activeVendor, inv) {


        var dateSelected = alia.state(false);
        var hasItems = alia.state(false);
        var enableButton = alia.state(false);

        alia.doHeading(ctx, {
            type: 4,
            text: 'Active Purchase Order'
        });

        var poTable = alia.doTable(ctx, {
            style: 'hover,striped',
            dataType: 'object',
            data: poData,
            sortable: true,
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
            removable: true
        });

        poData.then(function(value) {
            if (value.length > 0) {
                hasItems.set(true);
                if (dateSelected.get()) {
                    enableButton.set(true);
                }
            } else {
                hasItems.set(false);
            }
        });

        var datepicker = alia.doDatepicker(ctx, {
            placeholder: 'Enter Date Needed',
            startDate: new Date()
        });
        alia.doBreak(ctx, {});
        alia.doBreak(ctx, {});

        datepicker.date.onResolve(function(value) {
            if (datepicker.date.get() !== undefined) {
                dateSelected.set(true);
                if (hasItems.get()) {
                    enableButton.set(true);
                }
            }
        });


        var errMessage = alia.state('');
        alia.doButton(ctx, {
            text: 'Add Purchase Order',
            disabled: enableButton.then(function(value) {
                return !value;
            })
        }).onClick(function(event) {
            var spinner = alia.doPageSpinner(ctx, {});

            var vendorIndex = -1;
            var vendorList = vendors.get();

            for (var i = 0; i < vendorList.length; ++i) {
                if (vendors.get()[i].cardCode === activeVendor.get()) {
                    vendorIndex = i;
                }
            }
            // console.log(vendorIndex);
            // console.log(vendorList[vendorIndex]);

            var po = {
                cardCode: vendorList[vendorIndex].cardCode,
                dueDate: datepicker.date.get(),
                postingDate: new Date(),
                emailOnCreation: true,
                inventoryOrder: false,
                purchaseOrderLines: []
            }
            var items = poData.get();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].quantity < 1) {
                    errMessage.set('All quantities must be greater than or equal to 1');
                    return;
                } else {
                    console.log(items[i]);

                    po.purchaseOrderLines.push(items[i]);
                }
            }
            errMessage.set('');
            var req = inv.insertPurchaseOrder(po);
            req.onResolve(function(data) {
                spinner.stop();
                conformationModal(ctx, true);
                // alert('Purchase Order has been added');
                // resolve();
            });
            req.onError(function(err) {
                spinner.stop();
                conformationModal(ctx, false);
                // alert('ERROR: There was an error adding the Purchase Order')
                // reject(err.responseText)
            });

        });

        alia.doText(ctx, {
            text: errMessage,
            style: 'danger'
        });

        // var datepicker = alia.doDatepicker(ctx, {
        //  placeholder: 'Enter Date'
        // });

        // alia.doText(ctx, {
        //  text: datepicker.date
        // });
    }

    alia.defineView({
        path: '/addPurchaseOrder',
        dependencies: ['inv', '$query']
    }, function(ctx, inv, $query) {
        var view = ctx;

        // State
        var vendors = alia.state(inv.getVendors());
        var items = alia.state([]);
        var poData = alia.state([]);
        var filter = alia.state('');
        var activeVendor = alia.state('');

        doHeader(ctx);
        doSubheader(ctx, inv, vendors, activeVendor, items, poData, filter);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doAvailableItems(ctx, items, poData, filter);
            doActivePurchaseOrder(ctx, poData, filter, vendors, activeVendor, inv);
        });
    });
}());