/* inventoryCounts.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/26/2014
 *
 */

'use strict';
(function() {

    function doCountModal(ctx, selectedItem, index, counted, items) {
        return alia.doModalForm(ctx, {
            title: 'Enter Quantity',
            formData: selectedItem,
            onEnterKeySubmit: true,
            fields: [{
                name: 'itemCode',
                label: 'Item',
                disabled: true
            }, {
                name: 'itemName',
                label: 'Description',
                disabled: true
            }, {
                name: 'location',
                label: 'Location',
                disabled: true
            }, {
                name: 'countedQuantity',
                label: "Quantity",
                type: 'number'
            }],
            fade: false
        }).onSubmit(function(event, value, resolve, reject) {
            if (isNaN(parseInt(value.countedQuantity))) {
                reject('Counted quantity is required and must be a number');
            } else {
                var idx = index.get();
                var allitems = items.get();
                var temp = counted.get();

                allitems[idx].countedQuantity = parseInt(value.countedQuantity);
                items.set(allitems);
                temp.push(idx);
                counted.set(temp);
                resolve();
            }
        });
    }

    function modifyCountModal(ctx, selectedItem, index, counted, items) {
        return alia.doModalForm(ctx, {
            title: 'Modify Counted Quantity',
            formData: selectedItem,
            onEnterKeySubmit: true,
            fields: [{
                name: 'itemCode',
                label: 'Item',
                disabled: true
            }, {
                name: 'itemName',
                label: 'Description',
                disabled: true
            }, {
                name: 'location',
                label: 'Location',
                disabled: true
            }, {
                name: 'countedQuantity',
                label: "Quantity",
                type: 'number'
            }],
            buttons: [{
                text: 'Remove',
                eventName: 'Remove'
            }],
            fade: false
        }).onSubmit(function(event, value, resolve, reject) {
            if (isNaN(parseInt(value.countedQuantity))) {
                reject('Counted quantity is required and must be a number');
            } else {
                var idx = index.get();
                var allitems = items.get();

                allitems[idx].countedQuantity = parseInt(value.countedQuantity);
                items.set(allitems);
                resolve();
            }
        }).onRemove(function(event, value, resolve, reject) {
            var temp = counted.get();
            var allitems = items.get();
            for (var i = 0; i < allitems.length; ++i) {
                if (allitems[i].itemCode === value.itemCode) {
                    var idx = temp.indexOf(i);
                    temp.splice(idx, 1);
                    counted.set(temp);
                    resolve();
                    return;
                }
            }
        });
    }

    function verifyCountModal(ctx, verifyItem, index, items) {
        return alia.doModalForm(ctx, {
            title: 'Verify Counted Quantity',
            formData: verifyItem,
            onEnterKeySubmit: true,
            fields: [{
                name: 'itemCode',
                label: 'Item',
                disabled: true
            }, {
                name: 'itemName',
                label: 'Description',
                disabled: true
            }, {
                name: 'location',
                label: 'Location',
                disabled: true
            }, {
                name: 'countedQuantity',
                label: "Quantity",
                type: 'number'
            }],
            buttons: [{
                text: 'Verify',
                eventName: 'Verify'
            }],
            fade: false
        }).onSubmit(function(event, value, resolve, reject) {
            if (isNaN(parseInt(value.countedQuantity))) {
                reject('Counted quantity is required and must be a number');
            } else {
                var idx = index.get();
                var allitems = items.get();

                allitems[idx].countedQuantity = parseInt(value.countedQuantity);
                items.set(allitems);
                resolve();
            }
        }).onVerify(function(event, value, resolve, reject) {
            console.log('Verify');
            if (isNaN(parseInt(value.countedQuantity))) {
                reject('Counted quantity is required and must be a number');
            } else {
                console.log(items.get());
                var idx = index.get();
                var allitems = items.get();
                console.log(allitems[idx]);

                allitems[idx].countedQuantity = parseInt(value.countedQuantity);
                allitems[idx]['verified'] = true;
                items.set(allitems);
                resolve();
            }
            // var temp = counted.get();
            // var allitems = items.get();
            // for (var i = 0; i < allitems.length; ++i) {
            //     if (allitems[i].itemCode === value.itemCode) {
            //         var idx = temp.indexOf(i);
            //         temp.splice(idx, 1);
            //         counted.set(temp);
            //         resolve();
            //         return;
            //     }
            // }
        });
    };


    function doHeader(ctx) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Inventory Counts'
            });
        });
    }

    function doSubheader(ctx) {
        var pages;
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            pages = alia.doButtonRadioGroup(ctx, {
                currentIndex: 0,
                options: [
                    'Perform Inventory Count',
                    'Verify Inventory Counts',
                    'Review Inventory Counts'
                ]
            }).css('margin', '0 auto');
        });
        return pages.currentIndex;
    }

    function doPages(ctx, page, allitems, itemGroups, inv, session) {
        alia.layoutDiv(ctx, {
            visible: page.then(function(index) {
                return index === 0;
            })
        }, function(ctx) {
            doBeginInventoryCounts(ctx, allitems, itemGroups, inv, session);
        });
        alia.layoutDiv(ctx, {
            visible: page.then(function(index) {
                return index === 1;
            })
        }, function(ctx) {
            doVerifyInventoryCounts(ctx, session, inv);
        });
        alia.layoutDiv(ctx, {
            visible: page.then(function(index) {
                return index === 2;
            })
        }, function(ctx) {
            doReviewInventoryCounts(ctx, inv);
        });
    }

    function doBeginInventoryCounts(ctx, allitems, itemGroups, inv, session) {
        var chosen = alia.state([]);
        var currentItem = alia.state();
        var currentIndex = alia.state();
        var currentModifiedItem = alia.state();
        var filter = alia.state('');

        var modal = doCountModal(ctx, currentItem, currentIndex, chosen, allitems);
        var modifyModal = modifyCountModal(ctx, currentItem, currentIndex, chosen, allitems);

        alia.doHeading(ctx, {
            type: 3,
            text: 'Perform Inventory Count'
        });

        var partTypeFilter = alia.doSelect(ctx, {
            options: itemGroups
        }).css('width', 'auto').css('display', 'inline-block').selected;

        var locationSelect = alia.doSelect(ctx, {
            options: [{
                text: 'A Cell'
            }, {
                text: 'B Cell'
            }, {
                text: 'C Cell'
            }, {
                text: 'D Cell'
            }, {
                text: 'E Cell'
            }, {
                text: 'Other'
            }]
        }).css('width', 'auto').selected;

        alia.doTextbox(ctx, {
            text: filter,
            placeholder: 'Filter Items'
        });

        var availableItems = alia.doTable(ctx, {
            style: 'hover,striped',
            data: alia.join(allitems, chosen, function(items, chosen) {
                chosen.sort(function(a, b) {
                    return a - b;
                });
                var unselectedItems = items.slice();
                for (var i = chosen.length - 1; i >= 0; --i) {
                    unselectedItems.splice(chosen[i], 1);
                }
                return unselectedItems;
            }),
            clickable: true,
            sortable: true,
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
                filter: partTypeFilter,
                hidden: true
            }],
            visible: partTypeFilter.then(function(value) {
                return typeof value !== 'undefined' && value !== '';
            })
        }).onRowClick(function(event, item) {
            var temp = chosen.get();
            var items = allitems.get();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].itemCode === item.itemCode) {
                    var tempItem = allitems.get()[i];
                    tempItem.location = locationSelect.get();
                    currentItem.set(tempItem);
                    currentIndex.set(i);
                    modal.show();
                }
            }
        });

        alia.doTable(ctx, {
            style: 'hover,striped',
            data: alia.join(allitems, chosen, function(items, chosen) {
                chosen.sort(function(a, b) {
                    return a - b;
                });
                var selectedItems = [];
                for (var i = 0; i < chosen.length; ++i) {
                    selectedItems.push(items[chosen[i]]);
                }
                return selectedItems;
            }),
            clickable: true,
            paging: {
                'default': 10,
                options: [5, 10, 25, 50]
            },
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Description',
                property: '.itemName'
            }, {
                heading: 'Quantity',
                property: '.countedQuantity'
            }],
            visible: partTypeFilter.then(function(value) {
                return typeof value !== 'undefined' && value !== '';
            })
        }).onRowClick(function(event, item) {
            var temp = chosen.get();
            var items = allitems.get();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].itemCode === item.itemCode) {
                    currentItem.set(allitems.get()[i]);
                    currentIndex.set(i);
                    modifyModal.show();
                    return;
                }
            }
        });



        alia.doBreak(ctx, {});

        alia.doButton(ctx, {
            text: 'Submit Count'
        }).onClick(function() {
            var temp = chosen.get();
            var items = allitems.get();

            var invCount = {
                countedBy: session.currentUser().get().username,
                verifiedBy: '',
                countDate: new Date(),
                items: []
            }

            var countedItems = [];
            for (var i = 0; i < temp.length; ++i) {
                invCount.items.push(items[temp[i]]);
            }

            // invCount.items = countedItems;
            console.log(invCount);

            var req = inv.insertInventoryCount(invCount);
            req.onResolve(function(data) {
                console.log('Count Added');
            });
            req.onError(function(err) {
                console.log('Error Adding Count');
            });
            // var countedItems = [];
            // for (var i = 0; i < temp.length; ++i) {
            //     var ci = {
            //         itemCode: items[temp[i]].itemCode,
            //         countedQuantity: items[temp[i]].countedQuantity,
            //         currentQuantity: items[temp[i]].currentQuantity,
            //         location: 'A Cell',
            //         verified: false
            //     }
            //     countedItems.push(ci);
            // }

            // console.log(ci);

        });
    };

    function doVerifyInventoryCounts(ctx, session, inv) {
        alia.doHeading(ctx, {
            type: 3,
            text: 'Verify Inventory Counts'
        });

        var countDates = alia.state(inv.getInventoryCountDates());
        var countsToVerify = alia.state([]);
        var displayDate = alia.state();
        var ic = alia.state();
        var verifyItems = ic.property('.items');


        var chosen = alia.state([]);
        var verfiyItem = alia.state();
        var verifyIndex = alia.state();
        var verifyModal = verifyCountModal(ctx, verfiyItem, verifyIndex, verifyItems);


        alia.doText(ctx, {
            text: 'Select Date(s)',
            weight: 'bold'
        });
        var selectedDate = alia.doSelect(ctx, {
            options: countDates.then(function(data) {
                var arr = [];
                for (var i = 0; i < data.length; ++i) {
                    console.log(data[i]);
                    arr.push({
                        text: data[i],
                        value: data[i]
                    });
                }
                return arr;
            }),
            multiple: true
        }).css('width', 'auto').selected;

        var selectedToVerify = alia.doSelect(ctx, {
            options: countsToVerify.then(function(data) {
                console.log(data);
                var arr = [];
                for (var i = 0; i < data.length; ++i) {
                    console.log(data[i]);
                    arr.push({
                        text: data[i],
                        value: data[i]
                    });
                }
                return arr;
            }),
            multiple: true
        }).css('width', 'auto').selected;


        selectedDate.onResolve(function(values) {
            if (values !== undefined && values !== null) {
                var arr = [];
                console.log(values);
                inv.getInventoryCountToVerifyList(values[0]).onResolve(function(data) {
                    countsToVerify.set(data);
                })


                // for (var i = 0; i < values.length; ++i) {
                //     console.log(values[i]);
                //     if (values !== '') {
                //         arr.push(inv.getInventoryCountToVerifyList(values[i]));
                //     }
                // }
                // alia.all(arr).onResolve(function(data) {
                //     countsToVerify.set(data);
                // });
            }
        });

        selectedToVerify.onResolve(function(values) {
            if (values !== undefined && values !== null) {
                var arr = [];
                for (var i = 0; i < values.length; ++i) {
                    console.log(values[i]);
                    if (values !== '') {
                        arr.push(inv.getInventoryCountToVerify(selectedDate.get(), values[i]));
                    }
                }
                alia.all(arr).onResolve(function(data) {
                    console.log(data);
                    var dataArr = []
                    for (var i = 0; i < data.length; ++i) {
                        dataArr = dataArr.concat(data[i].items);
                    }
                    ic.set(data[0]);
                    verifyItems.set(dataArr); // = ic.property('.items');
                });
            }
        })


        alia.doTable(ctx, {
            style: 'hover,striped',
            data: verifyItems,
            clickable: true,
            paging: {
                'default': 10,
                options: [5, 10, 25, 50]
            },
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Item Description',
                property: '.itemName'
            }, {
                heading: 'Counted Quantity',
                property: '.countedQuantity'
            }, {
                heading: 'Verified',
                property: '.verified'
            }]
        }).onRowClick(function(event, item) {
            var items = verifyItems.get();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].itemCode === item.itemCode) {
                    verfiyItem.set(items[i]);
                    verifyIndex.set(i);
                    verifyModal.show();
                    return;
                }
            }
        });


        var submitButton = alia.doButton(ctx, {
            text: 'Submit Verified Counts'
        }).onClick(function() {
            var items = verifyItems.get();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].verified !== true) {
                    alia.doAlert(ctx, {
                        type: 'danger',
                        text: 'ERROR: All items have not been verified',
                        autohide: 5000
                    });
                    return;
                }
            }

            var verifiedCounts = ic.get();
            verifiedCounts.items = verifyItems.get();
            verifiedCounts.verifiedBy = session.currentUser().get().username;
            console.log(verifiedCounts);

            var spinner = alia.doPageSpinner(ctx, {});
            var req = inv.insertInventoryCount(verifiedCounts);
            req.onResolve(function(data) {
                console.log('selected Date');
                console.log(selectedDate.get());
                inv.getInventoryCountToVerifyList(selectedDate.get()).onResolve(function(data) {
                    console.log(data);
                    countsToVerify.set(data);
                })
                spinner.stop();
                // alert('Purchase Order has been added');
                // resolve();
            });
            req.onError(function(err) {
                spinner.stop();
                // alert('ERROR: There was an error adding the Purchase Order')
                // reject(err.responseText)
            });

        })

        // alia.doButton(ctx, {
        //     text: 'Get Count'
        // }).onClick(function() {
        //     var ic = alia.state(inv.getInventoryCount(new Date()));

        //     ic.onResolve(function(data) {
        //         console.log('Inventory Count');
        //         console.log(data);
        //     })


        // })

        // var invCount = {
        //     countedBy: 'Andrew',
        //     countDate: new Date(),
        //     items: countedItems
        // }
        // console.log(invCount);
        // inv.insertInventoryCount(invCount);
    }

    function doReviewInventoryCounts(ctx, inv) {

        var countDates = alia.state(inv.getInventoryCountDates());
        var counts = alia.state();
        var reviewItems = alia.state();


        alia.doHeading(ctx, {
            type: 3,
            text: 'Review Inventory Counts'
        });

        alia.doText(ctx, {
            text: 'Select Date(s)',
            weight: 'bold'
        });
        var selectedDate = alia.doSelect(ctx, {
            options: countDates.then(function(data) {
                var arr = [];
                for (var i = 0; i < data.length; ++i) {
                    console.log(data[i]);
                    arr.push({
                        text: data[i],
                        value: data[i]
                    });
                }
                return arr;
            }),
            multiple: true
        }).css('width', 'auto').selected;

        selectedDate.onResolve(function(values) {
            if (values !== undefined && values !== null) {
                var arr = [];
                console.log(values);
                inv.getInventoryCountToReview(values[0]).onResolve(function(data) {
                    console.log(data);
                    counts.set(data);

                    var cItems = [];
                    for (var i = 0; i < data.length; ++i) {
                        for (var j = 0; j < data[i].items.length; ++j) {
                            var found = false;
                            for (var k = 0; k < cItems.length; ++k) {
                                if (cItems[k].itemCode === data[i].items[j].itemCode) {
                                    cItems[k].countedQuantity += data[i].items[j].countedQuantity;
                                    found = true;
                                }
                            }
                            if (!found) {
                                cItems.push(data[i].items[j]);
                            }
                        }
                    }

                    reviewItems.set(cItems);

                })
            }
        });

        alia.doTable(ctx, {
            style: 'hover,striped',
            data: reviewItems,
            clickable: true,
            paging: {
                'default': 10,
                options: [5, 10, 25, 50]
            },
            fields: [{
                heading: 'Item Code',
                property: '.itemCode'
            }, {
                heading: 'Item Description',
                property: '.itemName'
            }, {
                heading: 'Counted Quantity',
                property: '.countedQuantity'
            }, {
                heading: 'Current Quantity',
                property: '.currentQuantity'
            }]
        }).onRowClick(function(event, item) {
            var items = verifyItems.get();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].itemCode === item.itemCode) {
                    verfiyItem.set(items[i]);
                    verifyIndex.set(i);
                    verifyModal.show();
                    return;
                }
            }
        });

        
    }

    alia.defineView({
        path: '/inventorycounts',
        dependencies: ['session', 'inv']
    }, function(ctx, session, inv) {
        var view = ctx;

        // State
        var page;
        var itemGroups = alia.state(inv.getItemGroups(true));
        var allitems = alia.state(inv.getItems('inventory', 'prepped', true));
        var spinner = alia.doPageSpinner(ctx, {});

        alia.all([itemGroups, allitems]).observe(function(data) {
            spinner.stop();
        }, function() {
            spinner.spin();
        }, null);

        doHeader(ctx);
        page = doSubheader(ctx);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doPages(ctx, page, allitems, itemGroups, inv, session);
        });
    });
}());