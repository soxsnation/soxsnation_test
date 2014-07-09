/* openWorkOrders.js
 *
 * Author(s):  Andrew Brown
 *             Kyle Burnett
 * Date:       6/27/2014
 *
 */

"use strict";

(function() {

    function doAddModal(ctx, inv) {
        return alia.doModalForm(ctx, {
            title: 'Create Work Order',
            size: 'large',
            fields: [{
                name: 'username',
                label: 'Name',
                initValue: 'Andrew'
            }, {
                name: 'comments',
                label: 'Notes',
                initValue: ''
            }, {
                name: 'workOrderNumber',
                label: 'Work Order Number',
                initValue: ''
            }, {
                name: 'date',
                label: 'Due Date',
                type: 'date'
            }]
        }).onSubmit(function(event, value, resolve, reject) {
            console.log(value);

            if (value.workOrderNumber === '') {
                reject('Enter in Work Order Number.');
                return;
            } else if (value.date === '') {
                reject('Enter in Due Date.');
                return;
            } else {
                resolve();

                var req = inv.insertWorkOrder(value);
                req.onResolve(function(data) {
                    console.log(data);
                    ctx.push('workOrder', {
                        id: data.docNum
                    });
                });
                req.onError(function(err) {
                    // reject();
                    alert(err);
                });
            }
        });
    };

    function doAddScrapModal(ctx, inv, workOrderItems) {
        return alia.doModalForm(ctx, {
            title: 'Record Scrapped Material',
            size: 'large',
            fields: [{
                name: 'username',
                label: 'Name',
                initValue: 'Andrew'
            }, {
                name: 'comments',
                label: 'Notes',
                initValue: ''
            }, {
                name: 'workOrderNumber',
                label: 'Job Number',
                initValue: '20141234567CM'
            }, {
                name: 'receivingNumber',
                label: 'Receiving Number',
                initValue: '9999'
            }, {
                name: 'date',
                label: 'Date Scrapped',
                type: 'date',
                initValue: '7/1/2014'
            }, {
                name: 'items',
                label: 'Item',
                type: 'typeahead',
                sourcetype: 'object',
                editable: false,
                source: workOrderItems.then(function(values) {
                    var arr = [];
                    for (var i = 0; i < values.length; ++i) {
                        arr.push({
                            key: {
                                itemCode: values[i].itemCode,
                                description: values[i].itemName,
                                quantity: 1
                            },
                            display: values[i].itemCode + ' - ' + values[i].itemName
                        });
                    }
                    return arr;
                })
            }]
        }).onSubmit(function(event, value, resolve, reject) {

            if (value.item === '') {
                reject('Enter in Item that was scrapped.');
            } else if (value.date === '') {
                reject('Enter in scrap date.');
            } else if (value.workOrderNumber === '') {
                reject('Enter in Job Number.');
            } else if (value.receivingNumber === '') {
                reject('Enter in Receiving Number.');
            } else {
                resolve();
                var scrapWO = {
                    status: 'scrap',
                    username: value.username,
                    comments: value.comments,
                    receivingNumber: value.receivingNumber,
                    workOrderNumber: value.workOrderNumber,
                    date: value.date,
                    items: []
                };

                scrapWO.items.push(value.items);
                // scrapWO.items.push({
                //     itemCode: 'CM-BR-4520-P',
                //     description: '4.5" x 2.05"  Brass Compensator Prep Material',
                //     quantity: 1
                // });
                console.log(scrapWO);

                var req = inv.insertWorkOrder(scrapWO);
                req.onResolve(function(data) {
                    console.log(data);
                    // ctx.push('current', {
                    //     id: data.docNum
                    // });
                });
                req.onError(function(err) {
                    // reject();
                    alert(err);
                });
            }
        });
    }

    function doHeader(ctx) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Open Work Orders'
            });
        });
    }

    function doSubheader(ctx, inv, addModal, scrapModal, filter) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            alia.doButton(ctx, {
                text: 'Add WorkOrder'
            }).onClick(function(event) {
                addModal.show();
            });

            alia.doButton(ctx, {
                text: 'Record Scrapped Material'
            }).onClick(function(event) {
                scrapModal.show();
            });

            alia.doTextbox(ctx, {
                text: filter,
                placeholder: 'Filter Work Orders'
            });

        });
    }

    function doTable(ctx, view, workOrders, filter) {
        // var table = alia.doReadTable(ctx, {
        //     style: 'hover',
        //     header: ['Work Order #', 'Employee', 'Status', 'Items'],
        //     dataType: 'object',
        //     data: workOrders,
        //     sortable: true,
        //     spinner: true,
        //     filter: filter,
        //     paging: {
        //         'default': 10,
        //         options: [10, 50]
        //     },
        //     rowClick: function(event, data) {
        //         view.push('workOrder', {
        //             id: data.docNum
        //         });
        //     },
        //     fields: [{
        //         name: 'docNum'
        //     }, {
        //         name: 'username'
        //     }, {
        //         name: 'status',
        //         map: function(value) {
        //             switch (value) {
        //                 case 'boposPlanned':
        //                     return 'Planned';
        //                 case 'boposReleased':
        //                     return 'Released';
        //                 default:
        //                     return 'Unknown';
        //             }
        //         }
        //     }, {
        //         name: 'items',
        //         map: function(items) {
        //             return items.length;
        //         },
        //         sortPrimer: function(items) {
        //             return 0;
        //         }
        //     }]
        // });

        var table = alia.doTable(ctx, {
            style: 'hover',
            dataType: 'object',
            data: workOrders,
            sortable: true,
            paging: {
                'default': 10,
                options: [10, 50]
            },
            clickable: true,
            fields: [{
                heading: 'Doc #',
                property: '.docNum'
            }, {
                heading: 'Employee',
                property: '.username'
            }, {
                heading: 'Status',
                property: '.status',
                map: function(value) {
                    switch (value) {
                        case 'boposPlanned':
                            return 'Planned';
                        case 'boposReleased':
                            return 'Released';
                    }
                }
            }, {
                heading: 'Items',
                property: '.items',
                map: function(items) {
                    return items.length;
                },
                sortPrimer: function(items) {
                    return 0;
                }
            }]
        }).onRowClick(function(event, data) {
            view.push('workOrder', {
                id: data.docNum
            });
        });


    }

    alia.defineView({
        path: '/openWorkOrders',
        dependencies: ['session', '$location', 'inv']
    }, function(ctx, session, $location, inv) {
        var view = ctx;
        // If user doesn't have permission kick them off to the default page
        var cu = session.currentUser().get();
        console.log(cu);
        if (cu === undefined || cu.permissions.indexOf('WorkOrders') < 0) {
            $location.path('/');
        }

        // State
        var workOrders = alia.state(inv.getWorkOrders());
        var workOrderItems = alia.state(inv.getItems('inventory', 'prepped', false));
        // var employeeList = alia.state(inv.getEmployees());
        var filter = alia.state('');
        // var workOrderLines = workOrders.property('.items');

        var addModal = doAddModal(ctx, inv);
        var scrapModal = doAddScrapModal(ctx, inv, workOrderItems);

        doHeader(ctx);
        doSubheader(ctx, inv, addModal, scrapModal, filter);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, view, workOrders, filter);
        });
    });
}());