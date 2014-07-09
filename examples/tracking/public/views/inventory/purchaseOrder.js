/* purchaseOrder.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/6/2014
 *
 */

"use strict";

(function() {
    var tablePOHeadings = [
        'ItemCode',
        'Description',
        'Quantity'
    ];

    function doPurchaseOrderModal(ctx, items, source) {
        return alia.doModalForm(ctx, {
            title: 'Create Purchase Order Line Item',
            size: 'large',
            fields: [{
                name: 'item',
                label: 'Item',
                type: 'typeahead',
                sourcetype: 'object',
                editable: false,
                source: source.then(function(values) {
                    var arr = [];
                    for (var i = 0; i < values.length; ++i) {
                        arr.push({
                            key: {
                                code: values[i].itemCode,
                                description: values[i].itemName
                            },
                            display: values[i].itemCode + ' - ' + values[i].itemName
                        });
                    }
                    return arr;
                })
            }, {
                name: 'quantity',
                label: "Quantity",
                type: 'number',
                initValue: 0
            }]
        }).onSubmit(function(event, value, resolve, reject) {
            var itemsCopy = items.get();
            var item = {
                itemCode: value.item.code,
                itemDescription: value.item.description,
                quantity: value.quantity
            }
            itemsCopy.push(item);
            items.set(itemsCopy);
            resolve();
        });
    }

    function doHeader(ctx) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Receive Material From Purchase Order'
            });
        });
    }

    function doSubheader(ctx, modal) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {



            alia.doButton(ctx, {
                text: 'Add PO Line'
            }).onClick(function() {
                console.log('Add PO Line');
                modal.show();
            });
        });
    }

    function doTable(ctx, session, inv, purchaseOrder, items) {

        var numItems = alia.state(0);
        items.onResolve(function(data) {
            var c = 0;
            for (var i = 0; i < data.length; ++i) {
                c += data[i].quantity;
            }
            numItems.set('There are ' + c + ' items for this purchase order.');
        });

        alia.doText(ctx, {
            text: numItems
        });

        alia.doBreak(ctx, {});
        alia.doBreak(ctx, {});


        var table = alia.doTable(ctx, {
            style: 'hover,striped',
            dataType: 'object',
            data: items,
            sortable: true,
            deletable: true,
            paging: {
                'default': 10,
                options: [10, 50]
            },
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Description',
                property: '.itemDescription'
            }, {
                heading: 'Quantity',
                property: '.quantity',
                editableType: 'number'
            }],
        });

        alia.doBreak(ctx, {});
        alia.doBreak(ctx, {});
        var submitted = alia.state(false);

        alia.doButton(ctx, {
            text: 'Receive Material',
            disabled: submitted
        }).onClick(function() {
            // console.log(items.get());

            var po = purchaseOrder.get();
            po.items = items.get();
            po.shipAcceptedBy = session.currentUser().username;

            console.log(po);
            var req = inv.insertGoodsReceiptPO(po);
            req.onResolve(function(data) {
                alia.doAlert(ctx, {
                    type: 'success',
                    text: 'Material received successfully',
                    autohide: 5000
                });
                submitted.set(true);
                // TODO: Redirect back to receive page
            });
            req.onError(function(err) {
                alia.doAlert(ctx, {
                    type: 'danger',
                    text: 'ERROR: There was an error receiving material: ' + err,
                    autohide: 5000
                });
            });
        });


    }

    alia.defineView({
        path: '/purchaseOrder',
        dependencies: ['session', 'inv', '$query']
    }, function(ctx, session, inv, $query, $location) {
        var view = ctx;

        // State
        var purchaseOrder = alia.state(inv.getPurchaseOrderById($query.id));
        var purchaseOrderItems = purchaseOrder.property('.items');
        var vendorItems = alia.state(inv.getItemsByVendor($query.vendor, 'raw'));

        var modal = doPurchaseOrderModal(ctx, purchaseOrderItems, vendorItems);

        doHeader(ctx);
        doSubheader(ctx, modal);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, session, inv, purchaseOrder, purchaseOrderItems);
        });
    });
}());