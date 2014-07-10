(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Table

    alia.defineLayout({
        name: 'table',
    }, function() {

        var styles = {
            'bordered': 'table-bordered',
            'striped': 'table-striped',
            'hover': 'table-hover',
            'condensed': 'table-condensed'
        };

        return function(options) {

            // Determine class
            var cls = [];
            var style;
            if (typeof options.style === 'string') {
                style = options.style.split(',');
            } else if (Array.isArray(options.style)) {
                style = options.style;
            }
            if (style) {
                for (var i = 0; i < style.length; i++) {
                    if (styles.hasOwnProperty(style[i])) {
                        cls.push(styles[style[i]]);
                    }
                }
            }

            // Append table element
            return this.append('<table alia-context class="table :class"></table>', {
                class: cls.join(' ')
            });
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Table Row

    alia.defineLayout({
        name: 'tableRow',
    }, function() {

        var styles = {
            'active': 'active',
            'success': 'success',
            'warning': 'warning',
            'danger': 'danger',
            'info': 'info'
        };

        return function(options) {

            var elm;
            if (options.type === 'heading') {
                elm = this.append('<thead><tr alia-context></tr></thead>');
            } else {
                elm = this.append('<tr alia-context></tr>');
            }

            elm.defineProperty('style', options.style);

            if (typeof options.selectable === 'boolean' && options.selectable) {
                elm.css('cursor', 'pointer');
            }

            elm.style.onResolve(function(value) {
                if (typeof value === 'string' && styles.hasOwnProperty(value)) {
                    elm.attr('class', styles[value]);
                } else {
                    elm.removeAttr('class');
                }
            });

            return elm;
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Table Cell

    alia.defineLayout({
        name: 'tableCell',
    }, function() {

        return function(options) {

            // Determine type
            var type = (options.type === 'heading') ? 'h' : 'd';

            // Append table element
            var elm = this.append('<t:type alia-context></t:type>', {
                type: type
            });

            // Check if sortable
            if (options.hasOwnProperty('sortable') && options.sortable === true) {
                elm.css('cursor', 'pointer');
                elm.defineProperty('sortOrder', '');
                elm.onClick(function() {
                    if (elm.sortOrder.get() === '') {
                        elm.sortOrder.set('A');
                    } else if (elm.sortOrder.get() === 'A') {
                        elm.sortOrder.set('D');
                    } else {
                        elm.sortOrder.set('');
                    }
                });
                alia.doText(elm, {
                    style: 'info',
                    text: elm.sortOrder
                }).class('add', 'pull-right');
            }

            return elm;
        };
    }());

    /**
     * @typedef {Object} Field
     * @property {boolean} [hidden=false] - Specifies whether the cell is hidden
     * @property {string} [filter] - Specifies the filter for the cell
     * @property {function} [map] - Specifies a way to map the cell data to something else
     * @property {string} [heading] - Denotes the heading for the column
     * @property {function} [sortPrimer] - The function to apply to the cell data before sorting
     * @property {string} property - The key or index into a row's object or array
     */

    /**
     * @typedef {Field[]} Fields
     */

    /**
     * @typedef {Object} Paging
     * @property {number} default - Indicates the default value for the list of values
     * @property {number[]} options - Specifies the list of page sizes available to the user
     */

    /**
     * @typedef {Object} TableOptions
     * @property {(string|string[])} [style] - A comma-delimited list of styles (Possible values: 'bordered', 'striped', 'hover', and 'condensed')
     * @property {boolean} [selectable=false] - Specifies whether rows are selectable
     * @property {boolean} [sortable=false] - Specifies whether the table is sortable
     * @property {boolean} [spinner=false] - Specifies whether to use a loading spinner
     * @property {boolean} [removable=false] - Specifies whether to add a delete action column for deleting rows from the table
     * @property {boolean} [visible=true] - Specifies whether the table is visible
     * @property {string} [filter] - A string with which to filter the data
     * @property {Paging} [paging] - Specifies how the table should be paged
     * @property {Fields} fields - Denotes how each column is to be displayed
     * @property {Array[]|Object[]} data - The data to be tabulated (can be alia.state) (Array of Arrays not tested)
     */

    /**
     * Handles the row click event
     * @name RowClick
     * @function
     * @arg {RowClickCallback} cb The callback function that handles row click events
     */

    /**
     * This is an argument to the RowClick method
     * @callback RowClickCallback
     * @param {EventObject} event The jQuery click event
     * @param {Object} item The item corresponding to the row that was clicked
     */

    /**
     * @typedef {Object} TableObject
     * @property {Accessor} currentItem The currently selected item
     * @property {Accessor} currentRow The currently selected row
     * @property {RowClick} onRowClick A function to register a event on a row click
     */

    /**
     * Constructs a table
     * @name doTable
     * @function
     * @arg {Context} ctx The context in which to place the table
     * @arg {TableOptions} options The options for the table
     * @return {TableObject} The table component
     */

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Table Control

    alia.defineControl({
        name: 'table'
    }, function() {

        var styles = {
            'bordered': 'table-bordered',
            'striped': 'table-striped',
            'hover': 'table-hover',
            'condensed': 'table-condensed'
        };

        function getClass(options) {
            var cls = ['table'];
            var style;
            if (typeof options.style === 'string') {
                style = options.style.split(',');
            } else if (Array.isArray(options.style)) {
                style = options.style;
            }
            if (style) {
                for (var i = 0; i < style.length; i++) {
                    if (styles.hasOwnProperty(style[i])) {
                        cls.push(styles[style[i]]);
                    }
                }
            }
            return cls;
        }

        function makeHeaderCellContents(fields, i) {
            return function(ctx) {
                alia.doText(ctx, {
                    text: fields[i].heading
                });
            };
        }

        function doHeader(header, options) {
            var cells = [];
            alia.layoutTableRow(header, {}, function(ctx) {
                for (var i = 0; i < options.fields.length; ++i) {
                    if (!options.fields[i].hidden) {
                        cells.push(alia.layoutTableCell(ctx, {
                            type: 'heading',
                            sortable: options.sortable
                        }, makeHeaderCellContents(options.fields, i)).sortOrder);
                    }
                }
                if (options.removable === true) {
                    alia.layoutTableCell(ctx, {
                        type: 'heading'
                    }, function(ctx) {
                        var btn = alia.doButton(ctx, {
                            style: 'link'
                        }).onClick(function() {
                            options.data.set([]);
                        });
                        btn.css('padding', '0');
                        alia.doText(btn, {
                            text: ' Delete All '
                        });
                        alia.doIcon(btn, {
                            name: 'remove'
                        });
                    });
                }
            });
            return alia.all(cells);
        }

        function makeRowCallback(lookup, idx) {
            return function() {
                var lookupArr = lookup.get();
                var low = lookupArr.splice(idx, 1)[0];
                for (var i = 0; i < lookupArr.length; ++i) {
                    if (lookupArr[i] > low) {
                        lookupArr[i]--;
                    }
                }
                lookup.set(lookupArr);
            };
        }

        function doBody(table, body, options, lookup) {
            $('#' + body.id()).empty();
            var len = 0;
            options.data.property('.length').onResolve(function(size) {
                if (size < len) {
                    len = size;
                } else {
                    for (var i = len; i < size; ++i) {
                        doRow(table, body, options, i, makeRowCallback(lookup, i));
                        len++;
                    }
                }
            });
        }

        function doRow(table, body, options, rowindex, onUnresolve) {
            alia.layoutTableRow(body, {
                selectable: options.selectable,
                style: table.currentRow.then(function(value) {
                    return (value === rowindex) ? 'info' : '';
                })
            }, function(row) {
                options.data.at(rowindex).onUnresolve(function() {
                    $('#' + row.id()).remove();
                    onUnresolve();
                });

                // Row click
                if (options.clickable === true) {
                    row.css('cursor', 'pointer');
                }
                row.onClick(function() {
                    table.emitRowClick(options.data.get()[rowindex]);
                });

                // Row selection
                if (options.selectable === true) {
                    row.onClick(function() {
                        table.currentRow.set(rowindex);
                        table.currentItem.set(options.data.get()[rowindex]);
                    });
                }

                for (var i = 0; i < options.fields.length; ++i) {
                    doCell(row, options, rowindex, i);
                }

                // Row deletion
                if (options.removable === true) {
                    alia.layoutTableCell(row, {}, function(cell) {
                        var btn = alia.doButton(cell, {
                            style: 'link'
                        }).onClick(function() {
                            var tempData = options.data.get();
                            tempData.splice(rowindex, 1);
                            options.data.set(tempData);
                        });
                        btn.css('padding', '0');
                        alia.doIcon(btn, {
                            name: 'remove'
                        });
                    });
                }
            });
        }

        function doCell(row, options, rowindex, colindex) {
            alia.layoutTableCell(row, {}, function(cell) {
                doCellContents(cell, options, rowindex, colindex);
                if (options.fields[colindex].hidden === true) {
                    $('#' + cell.id()).hide();
                }
            });
        }

        function doCellContents(cell, options, rowindex, colindex) {
            var data = options.data;
            var field = options.fields[colindex];

            var contents;
            if (typeof field.map === 'function') {
                contents = data.property('.' + rowindex + field.property).then(field.map);
            } else {
                contents = data.property('.' + rowindex + field.property);
            }

            if (typeof field.editableType === 'string') {
                cell.css('padding', '0');
                switch (field.editableType) {
                    case 'number':
                    case 'text':
                        alia.doEditableTextbox(cell, {
                            type: field.editableType,
                            text: contents,
                            deferred: false
                        });
                        break;
                }
            } else {
                alia.doText(cell, {
                    text: contents
                });
            }
        }

        function resolve(obj, name) {
            if (name.substr(0, 1) === '.') {
                name = name.substring(1, name.length);
            }
            if (typeof name === 'string') {
                var names = name.split('.');
                var resolved = obj[names.shift()];
                if (names.length === 0) {
                    return resolved;
                } else {
                    return resolve(resolved, names.join('.'));
                }
            } else if (typeof name === 'number') {
                return obj[name];
            } else {
                return;
            }
        }

        function defaultCmp(a, b) {
            if (a == b) return 0;
            return (a < b) ? -1 : 1;
        }

        function getCmpFcn(primer, reverse) {
            var dfc = defaultCmp, // closer in scope
                cmp = defaultCmp;
            if (primer) {
                cmp = function(a, b) {
                    return dfc(primer(a), primer(b));
                };
            }
            if (reverse === '') {
                return function() {
                    return 0;
                };
            } else if (reverse === 'D') {
                return function(a, b) {
                    return -1 * cmp(a, b);
                };
            }
            return cmp;
        }

        function getSortFunctions(sortOrders, options) {
            var fields = options.fields;
            var fcns = [];
            var sortIdx = 0;

            for (var i = 0; i < fields.length; ++i) {
                if (!fields[i].hidden) {
                    fcns.push({
                        property: fields[i].property,
                        cmp: getCmpFcn(fields[i].sortPrimer, sortOrders[sortIdx])

                    });
                    sortIdx++;
                }
            }

            return fcns;
        }

        function manageSort(sortOrders, options, body, lookup, callback) {
            alia.join(sortOrders, options.data, function(arg0, arg1) {
                return [arg0, arg1];
            }).onResolve(function(state) {
                var lookupArr = lookup.get();
                if (lookupArr.length < state[1].length) {
                    for (var i = lookupArr.length; i < state[1].length; ++i) {
                        lookupArr[i] = i;
                    }
                    lookup.set(lookupArr);
                }

                // Preprocess sort functions
                var sortFcns = getSortFunctions(state[0], options);

                lookup.set(performSort(state[1], sortFcns, body, lookup.get()));
                callback();
            });
        }

        function performSort(data, sortFcns, body, prevLookup) {
            if (prevLookup !== null) {
                resetOrder(prevLookup, body);
            }

            var lookup = [];
            for (var i = 0; i < data.length; ++i) {
                lookup.push(i);
            }
            stableSort(data, lookup, sortFcns);
            return lookup;
        }

        function stableSort(data, lookup, sortFcns) {
            var lookupCopy = JSON.parse(JSON.stringify(lookup));
            lookup.sort(function(a, b) {
                for (var sortIdx = 0; sortIdx < sortFcns.length; ++sortIdx) {
                    var resolvedA = resolve(data[lookup[a]], sortFcns[sortIdx].property);
                    var resolvedB = resolve(data[lookup[b]], sortFcns[sortIdx].property);

                    // Compare the results
                    var cmpResult = sortFcns[sortIdx].cmp(resolvedA, resolvedB);
                    if (cmpResult !== 0) return cmpResult;
                }
                return lookupCopy[a] - lookupCopy[b];
            });
        }

        function resetOrder(lookup, body) {
            var tempArr = [],
                i;
            for (i = 0; i < lookup.length; ++i) {
                tempArr[lookup[i]] = $('#' + body.id() + ' tr:nth-child(' + (i + 1) + ')');
            }
            for (i = 0; i < tempArr.length; ++i) {
                $('#' + body.id()).append(tempArr[i]);
            }
        }

        function filter(body, f) {
            var filtered = [];
            if (f) {
                $('#' + body.id() + ' tr').each(function(index, value) {
                    $(value).show();
                    var found = false;
                    $(value).children('td').each(function(index, value) {
                        var t = $(value).text();
                        if (t.toLowerCase().indexOf(f.toLowerCase()) > -1) {
                            found = true;
                            return false;
                        }
                    });
                    if (!found) {
                        $(value).hide();
                        filtered.push(index);
                    }
                });
            }
            return filtered;
        }

        function makeColumnFilter(filtered, filters, idx) {
            return function(index, value) {
                if (filtered.indexOf(index) < 0) {
                    var elm = $(value).children('td:nth-child(' + (idx + 1) + ')');
                    var t = elm.text();
                    if (t.toLowerCase().indexOf(filters[idx].toLowerCase()) < 0) {
                        $(value).hide();
                        filtered.push(index);
                    }
                }
            };
        }

        function filterByColumns(body, filtered, filters) {
            for (var i = 0; i < filters.length; ++i) {
                if (typeof filters[i] === 'string') {
                    $('#' + body.id() + ' tr').each(makeColumnFilter(filtered, filters, i));
                }
            }

            filtered.sort(function(a, b) {
                return a - b;
            });
        }

        function makePageLink(i, pager, body, filtered, total, pageSize) {
            return function(ctx) {
                alia.doLink(ctx, {
                    text: (i + 1) + ''
                }).onClick(function(idx) {
                    return function() {
                        rePage(pager, body, filtered, total, idx, pageSize);
                    };
                }(i));
            };
        }

        function doPager(pager, body, pageSize, total, filtered) {
            var unfilteredRows = total - filtered.length;
            var pages = Math.ceil(unfilteredRows / pageSize);
            $('#' + pager.id()).empty();
            for (var i = 0; i < pages; ++i) {
                alia.layoutListItem(pager, {}, makePageLink(i, pager, body, filtered, total, pageSize));
            }
            rePage(pager, body, filtered, total, 0, pageSize);
        }

        function rePage(pager, body, filtered, total, currentPage, pageSize) {
            $('#' + pager.id() + '.pagination li').removeClass('active');
            $('#' + pager.id() + '.pagination li:nth-child(' + (currentPage + 1) + ')').addClass('active');
            var filterIdx = 0;
            var nextSkip = filtered[filterIdx];
            var itemCount = 0;
            for (var i = 0; i < total; ++i) {
                if (i === nextSkip) {
                    nextSkip = filtered[++filterIdx];
                    continue;
                }
                if (itemCount < (currentPage * pageSize) || itemCount >= (currentPage + 1) * pageSize) {
                    $('#' + body.id() + ' tr:nth-child(' + (i + 1) + ')').css('display', 'none');
                } else {
                    $('#' + body.id() + ' tr:nth-child(' + (i + 1) + ')').css('display', 'table-row');
                }
                itemCount++;
            }
        }

        var spin_opts = {
            lines: 9, // The number of lines to draw
            length: 5, // The length of each line
            width: 1.5, // The line thickness
            radius: 2.7, // The radius of the inner circle
            corners: 0.8, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 2.2, // Rounds per second
            trail: 45, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'table-spinner' // The CSS class to assign to the spinner
        };

        return function(options) {
            alia.applyDefaults(options, {
                sortable: false,
                selectable: false,
                removable: false,
                spinner: false,
                clickable: false,
                visible: true
            });

            // Determine class
            var cls = getClass(options);

            // Set up variables
            var i;
            var selectedPageSize;
            var pager;

            var table = this.append('<table alia-context class=":class"></table>', {
                class: cls.join(' ')
            });

            // Handle selectables
            table.defineProperty('currentItem', null);
            table.defineProperty('currentRow', null);

            // Calculate span
            var span = options.fields.length;
            if (options.removable === true) span++;

            // Create sections of the table
            var header = table.append('<thead alia-context></thead>');
            var body = table.append('<tbody alia-context></tbody>');
            var footer = table.append('<tfoot><tr><td alia-context colspan=":span" class="footer-cell"></td></tr></tfoot>', {
                span: span
            });

            // Set up pager
            if (typeof options.paging === 'object' && typeof options.paging.default === 'number' && Array.isArray(options.paging.options)) {
                alia.layoutUnorderedList(footer, {}, function(pagination) {
                    pager = pagination;
                    pagination.class('add', 'pagination');
                });

                selectedPageSize = alia.doSelect(footer, {
                    selected: options.paging.default,
                    options: options.paging.options
                }).class('add', 'pull-right').selected;

                alia.doText(footer, {
                    weight: 'bold',
                    text: 'Page Size: '
                }).class('add', 'pull-right').css('margin-right', '5px').css('position', 'relative').css('top', '7px');
            }

            // Set up spinner in footer if applicable
            if (options.spinner === true) {
                var target = $('#' + footer.id(''))[0];
                var spinner = new Spinner(spin_opts);

                spinner.spin(target);

                options.data.observe(function() {
                    spinner.stop();
                }, function() {
                    spinner.spin(target);
                }, null);
            }

            // Populate header
            var sortOrders = doHeader(header, options);

            // Populate table body
            var lookupArr = [];
            if (typeof options.data.get() !== 'undefined') {
                for (i = 0; i < options.data.get().length; ++i) {
                    lookupArr.push(i);
                }
            }
            var lookup = alia.state(lookupArr);
            doBody(table, body, options, lookup);

            var filters = [];
            for (i = 0; i < options.fields.length; ++i) {
                if (alia.isAccessor(options.fields[i].filter)) {
                    filters.push(options.fields[i].filter);
                } else {
                    filters.push(null);
                }
            }
            var observableFilters = alia.all(filters);
            // Perform and manage sort and filters
            manageSort(sortOrders, options, body, lookup, function() {
                // Page table
                if (typeof options.paging === 'object' && typeof options.paging.default === 'number' && Array.isArray(options.paging.options)) {
                    alia.all([selectedPageSize, options.data, options.filter, observableFilters]).onResolve(function(value) {
                        var filtered = [],
                            selected = value[0];
                        if (typeof value[2] === 'string') {
                            filtered = filter(body, value[2]);
                        }
                        if (Array.isArray(value[3])) {
                            filterByColumns(body, filtered, value[3]);
                        }
                        if (typeof value[0] !== 'number') {
                            selected = parseInt(value[0]);
                        }
                        doPager(pager, body, selected, value[1].length, filtered);
                    });
                }
            });

            table.bindVisible(options.visible);

            // Define events
            table.defineEvent('RowClick');

            return table;
        };
    }());

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Table Control

    alia.defineControl({
        name: 'propertyTable'
    }, function() {

        function doNormalTextDisplay(ctx, field, data) {
            var elm;
            if (typeof field.map === 'function') {
                elm = alia.doText(ctx, {
                    text: data.property('.' + field.name).then(field.map)
                });
            } else {
                elm = alia.doText(ctx, {
                    text: data.property('.' + field.name)
                });
            }
            elm.class('add', 'normal');
            return elm.width() + 13;
        }

        function doEditableTextDisplay(ctx, field, data, deferred) {
            var elm;
            switch (field.editableType) {
                case 'number':
                case 'text':
                    elm = alia.doEditableTextbox(ctx, {
                        type: field.editableType,
                        text: data.property('.' + field.name),
                        deferred: deferred
                    }).onSubmit(field.onSubmit);
                    break;
                case 'boolean':
                    elm = alia.doEditableBoolean(ctx, {
                        type: 'y/n',
                        value: data.property('.' + field.name),
                        map: field.map,
                        deferred: deferred
                    }).onSubmit(field.onSubmit);
                    break;
                default:
                    throw new Error('Cannot render editable type ' + field.editableType);
            }
            return elm.width();
        }

        function makeListItem(options, field, min, i) {
            return function(item) {
                item.class('add', 'item');
                if (i % 2 == 1) item.class('add', 'item-right');

                alia.layoutDiv(item, {
                    classes: 'wrap'
                }, function(wrap) {
                    alia.doText(wrap, {
                        text: field.label + ':'
                    }).class('add', 'name').class('add', 'text-muted');

                    // Check whether field is editable
                    if (typeof field.editableType === 'string' && typeof field.onSubmit === 'function') {
                        min = Math.max(doEditableTextDisplay(wrap, field, options.data, options.deferred), min);
                    } else {
                        min = Math.max(doNormalTextDisplay(wrap, field, options.data, options.deferred), min);
                    }
                });
            };
        }

        function doPropertyList(ctx, options) {
            alia.layoutDiv(ctx, {
                classes: 'property-list'
            }, function(container) {
                var min = 0;

                if (options.newLine) {
                    container.class('add', 'skinny');
                } else {
                    container.onResize(function(width) {
                        if (width < 2 * (min + 150)) {
                            container.class('add', 'skinny');
                        } else {
                            container.class('remove', 'skinny');
                        }
                    });
                }

                options.data.onResolve(function() {
                    container.empty();
                    alia.layoutUnorderedList(container, {}, function(list) {
                        for (var i = 0; i < options.fields.length; ++i) {
                            var field = options.fields[i];

                            alia.layoutListItem(list, {}, makeListItem(options, field, min, i));
                        }
                    });
                });
            });
        }

        return function(options) {

            alia.applyDefaults(options, {
                deferred: true
            });

            var div = this.append('<div alia-context></div>');

            doPropertyList(div, options);
        };
    }());
}($, alia));