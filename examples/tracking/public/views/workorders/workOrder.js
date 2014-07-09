/* workOrder.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/27/2014
 *
 */

"use strict";

(function() {
    function doWorkOrderItemModal(ctx, items, source) {
        return alia.doModalForm(ctx, {
            title: 'Add Work Order Line Item',
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
                description: value.item.description,
                quantity: value.quantity
            }
            itemsCopy.push(item);
            items.set(itemsCopy);
            resolve();
        });
    }

    function doHeader(ctx, workOrder) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {

            alia.layoutHeading(ctx, {
                type: 1
            }, function(ctx) {
                alia.doText(ctx, {
                    text: 'Work Order: '
                });
                alia.doText(ctx, {
                    text: workOrder.property('.workOrderNumber')
                });
            });
        });
    }

    function submitWorkOrder(ctx, inv, status, workOrder, workOrderLines) {
        var wo = workOrder.get();
        wo.status = status;
        wo.items = workOrderLines.get();
        console.log(wo);

        if (wo.items.length < 1) {
            alia.doAlert(ctx, {
                type: 'danger',
                text: 'ERROR: Add one item before submitting Work Order',
                autohide: 5000
            });
            return;
        } else {

            var req = inv.insertWorkOrder(wo);
            req.onResolve(function(data) {
                alia.doAlert(ctx, {
                    type: 'success',
                    text: 'Material Cutdown added successfully',
                    autohide: 5000
                });
            });
            req.onError(function(err) {
                alia.doAlert(ctx, {
                    type: 'danger',
                    text: 'ERROR: There was an error adding the material cutdown:' + err,
                    autohide: 5000
                });
            });
        }
    }

    function doWorkOrder(ctx, inv, modal, workOrder, workOrderLines, workOrderItems) {

        var table = alia.doTable(ctx, {
            style: 'hover',
            dataType: 'object',
            data: workOrderLines,
            sortable: true,
            removable: true,
            paging: {
                'default': 10,
                options: [10, 50]
            },
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Description',
                property: '.description'
            }, {
                heading: 'Quantity',
                property: '.quantity',
                editableType: 'number'
            }],
        });


        var woDueDate = workOrder.property('.date');

        alia.doText(ctx, {
            text: 'Due Date: '
        });
        var datepicker = alia.doDatepicker(ctx, {
            date: woDueDate
        });

        alia.doBreak(ctx, {});

        alia.doText(ctx, {
            text: 'Work Order Notes: '
        });
        var comments = alia.doTextarea(ctx, {
            rows: 3,
            resize: 'vertical',
            text: workOrder.property('.comments'),
            placeholder: 'Enter Comments'
        });

        alia.doBreak(ctx, {});

        alia.layoutButtonGroup(ctx, {}, function(ctx) {
            alia.doButton(ctx, {
                text: 'Add item',
                disabled: workOrderItems.then(function(values) {
                    if (typeof values === 'undefined' || values === null) {
                        return true;
                    } else if (Array.isArray(values)) {
                        return values.length < 1;
                    }
                })
            }).onClick(function() {
                modal.show();
            });

            alia.doButton(ctx, {
                text: 'Submit Changes'
            }).onClick(function() {
                console.log('Submit Changes');
                submitWorkOrder(ctx, inv, 'boposPlanned', workOrder, workOrderLines);
            });

            alia.doButton(ctx, {
                text: 'Save and Mark as Released'
            }).onClick(function() {
                console.log('Save and Mark as Released');
                submitWorkOrder(ctx, inv, 'boposReleased', workOrder, workOrderLines);
            });

            alia.doButton(ctx, {
                text: 'Cancel This Work Order'
            }).onClick(function() {
                console.log('Cancel This Work Order');
                submitWorkOrder(ctx, inv, 'boposCancelled', workOrder, workOrderLines);
            });
        })
    }

    alia.defineView({
        path: '/workOrder',
        dependencies: ['session', 'inv', '$query']
    }, function(ctx, session, inv, $query) {
        var view = ctx;

        // State
        console.log($query.id);
        var workOrder = alia.state(inv.getWorkOrder($query.id));
        var workOrderLines = workOrder.property('.items');
        var workOrderItems = alia.state(inv.getItems('inventory', 'prepped', false));

        var modal = doWorkOrderItemModal(ctx, workOrderLines, workOrderItems);

        workOrder.onResolve(function(data) {
            console.log(data);
        })

        doHeader(ctx, workOrder);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doWorkOrder(ctx, inv, modal, workOrder, workOrderLines, workOrderItems);
        });
    });
}());