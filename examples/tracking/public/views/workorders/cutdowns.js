/* cutdowns.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/5/2014
 *
 */

(function() {



    function doHeader(ctx) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Cutdowns'
            });
        });
    }

    function doSubheader(ctx, types, selected, filter) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            alia.doSelect(ctx, {
                options: types,
                selected: selected
            });

            alia.doTextbox(ctx, {
                placeholder: 'Filter Parts',
                text: filter
            }).text;
        })
    }

    function doCutdownView(ctx, session, inv, items, partType, filter) {
        var cutdownItem = alia.state();
        var cutdownItems = alia.state([]);

        alia.layoutRow(ctx, {}, function(ctx) {
            alia.layoutColumn(ctx, {
                width: {
                    xsmall: 12,
                    small: 6
                }
            }, function(ctx) {
                doLeftColumn(ctx, items, partType, filter, cutdownItem, cutdownItems);
            });
            alia.layoutColumn(ctx, {
                width: {
                    xsmall: 12,
                    small: 6
                }
            }, function(ctx) {
                doRightColumn(ctx, cutdownItem, cutdownItems, inv, session);
            });
        });
    }

    function doLeftColumn(ctx, items, partType, filter, cutdownItem, cutdownItems) {
        alia.doHeading(ctx, {
            type: 3,
            text: 'Cutdown Options'
        });

        alia.doBreak(ctx, {});

        alia.layoutPanel(ctx, {
            header: 'Select Item to Cut Down',
            headerStyle: 'h1',
            collapsible: true,
            visible: cutdownItem.then(function(value) {
                return typeof value === 'undefined' || value === null;
            }).startWith(true)
        }, function(ctx) {
            alia.doTable(ctx, {
                style: 'hover,striped',
                data: items,
                paging: {
                    'default': 10,
                    options: [5, 10, 25, 50]
                },
                filter: filter,
                selectable: true,
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
                }],
            }).onRowClick(function(event, value) {
                if (!value) return;
                var obj = {
                    itemCode: value.itemCode,
                    itemName: value.itemName,
                    quantity: 1
                };
                cutdownItem.set(obj);
            });
        });

        alia.layoutPanel(ctx, {
            header: 'Select Final Item(s)',
            headerStyle: 'h1',
            collapsible: true,
            visible: cutdownItem.then(function(value) {
                return typeof value !== 'undefined' && value !== null;
            }).startWith(false)
        }, function(ctx) {
            alia.doTable(ctx, {
                style: 'hover,striped',
                clickable: true,
                data: items,
                paging: {
                    'default': 10,
                    options: [5, 10, 25, 50]
                },
                filter: filter,
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
                }]
            }).onRowClick(function(event, value) {
                var found = false;
                var tempData = cutdownItems.get();
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

                cutdownItems.set(tempData);
            });

            alia.doButton(ctx, {
                style: 'link',
                text: 'Back'
            }).onClick(function() {
                cutdownItem.set(null);
                cutdownItems.set([]);
            });
        });
    }

    function validateCutdown(inv, oldItemCode, newItemCode, callback) {

        var oldItem = alia.state(inv.getItemByItemCode(oldItemCode));


        oldItem.onResolve(function(oldData) {

            var newItem = alia.state(inv.getItemByItemCode(newItemCode));

            newItem.onResolve(function(newData) {
                console.log('Items');
                console.log(oldData);
                console.log(newData);
                var errorString = '';

                if (oldData.material !== newData.material) {
                    errorString = 'Material does not match';
                } else if (oldData.height < newData.height) {
                    errorString = 'Size can not increase';
                } else if (oldData.width < newData.width) {
                    errorString = 'Size can not increase';
                } else if (oldData.length < newData.length) {
                    errorString = 'Size can not increase';
                }

                callback(errorString);
            })
        })
    }

    function doRightColumn(ctx, cutdownItem, cutdownItems, inv, session) {
        alia.doHeading(ctx, {
            type: 3,
            text: 'Cutdown Summary'
        });

        alia.layoutDiv(ctx, {
            classes: 'clearfix',
            visible: cutdownItem.then(function(value) {
                if (typeof value === 'undefined' || value === null) {
                    return false;
                } else {
                    return true;
                }
            }).startWith(false)
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 4,
                text: 'Selected Item'
            });

            alia.doPropertyTable(ctx, {
                fields: [{
                    name: 'itemCode',
                    label: 'Item Code'
                }, {
                    name: 'itemName',
                    label: 'Item Description'
                }, {
                    name: 'quantity',
                    label: 'Quantity',
                    editableType: 'number',
                    onSubmit: function(event, data, resolve, reject) {
                        var temp = cutdownItem.get();
                        temp.quantity = data;

                        cutdownItem.set(temp);

                        resolve();
                    }
                }],
                newLine: true,
                data: cutdownItem,
                deferred: false
            });

            alia.doButton(ctx, {
                text: 'Clear Selection'
            }).onClick(function() {
                cutdownItem.set(null);
                cutdownItems.set([]);
            });
        });

        alia.doBreak(ctx, {});

        alia.layoutDiv(ctx, {
            visible: cutdownItems.then(function(values) {
                return values.length > 0;
            })
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 4,
                text: 'Selected Final Items'
            });

            alia.doTable(ctx, {
                style: 'hover,striped',
                header: ['ItemCode', 'Description', 'Quantity'],
                data: cutdownItems,
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
        });

        var comments = alia.state('');
        var reason = alia.doTextarea(ctx, {
            rows: 3,
            resize: 'vertical',
            text: comments,
            placeholder: 'Enter Reason'
        });

        alia.doButton(ctx, {
            text: 'Perform Cutdown Inventory Adjustment',
            disabled: alia.join(cutdownItem, cutdownItems, function(arg1, arg2) {
                return typeof arg1 === 'undefined' || arg1 === null || arg1.quantity < 1 || arg2.length === 0;
            }).startWith(true)
        }).onClick(function() {

            if (comments.get() === '') {
                alia.doAlert(ctx, {
                    type: 'danger',
                    text: 'ERROR: Please provide a reason for the cutdown',
                    autohide: 5000
                });
                return;
            }

            var items = cutdownItems.get();
            console.log(items);

            var cutdownList = [];
            for (var i = 0; i < items.length; ++i) {
                cutdownList.push(items[i]);
            }

            var cutdownWorkOrder = {
                itemCode: cutdownList[0].itemCode,
                comments: comments.get(),
                username: session.currentUser().get().username,
                workOrderNumber: 'cutdown',
                date: new Date(),
                items: []
            }

            cutdownWorkOrder.items.push(cutdownItem.get());

            validateCutdown(inv, cutdownItem.get().itemCode, cutdownList[0].itemCode, function(errors) {
                if (errors === '') {
                    var req = inv.insertCutdown(cutdownWorkOrder);
                    req.onResolve(function(data) {
                        alia.doAlert(ctx, {
                            type: 'success',
                            text: 'Material cutdown added successfully',
                            autohide: 5000
                        });
                    });
                    req.onError(function(err) {
                        alia.doAlert(ctx, {
                            type: 'danger',
                            text: 'ERROR: There was an error adding the Cutdown: ' + err,
                            autohide: 5000
                        });
                    });
                } else {
                    alia.doAlert(ctx, {
                        type: 'danger',
                        text: 'ERROR: ' + errors,
                        autohide: 5000
                    });
                }
            });
        });

        alia.doText(ctx, {
            style: 'info',
            text: 'Select and item to cut down and at least 1 final part',
            visible: alia.join(cutdownItem, cutdownItems, function(arg1, arg2) {
                return typeof arg1 === 'undefined' || arg1 === null || arg1.quantity < 1 || arg2.length === 0;
            }).startWith(true)
        }).css('margin-left', '5px');
    }

    alia.defineView({
        path: '/cutdowns',
        dependencies: ['session', 'inv']
    }, function(ctx, session, inv) {
        var view = ctx;

        // State
        var partType = alia.state('Photon Compensator');
        var filter = alia.state('');
        var items = alia.state(inv.getItems('inventory', 'prepped', false));
        var itemGroups = alia.state(inv.getItemGroups(true));

        doHeader(ctx);
        doSubheader(ctx, itemGroups, partType, filter);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doCutdownView(ctx, session, inv, items, partType, filter);
        });
    });
}());