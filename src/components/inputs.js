'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Textbox

alia.defineControl({
    name: 'textbox',
}, function() {

    var sizes = {
        large: 'input-lg',
        small: 'imput-sm'
    };

    var types = {
        text: 'text',
        email: 'email',
        number: 'number',
        password: 'password'
    };

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            type: types.text,
            disabled: false,
            visible: true
        });

        // Determine class
        var cls = ['form-control'];
        if (typeof options.size === 'string' && sizes.hasOwnProperty(options.size)) {
            cls.push(sizes[options.size]);
        }

        // Append text element
        var elm = this.append('<input alia-context type=":type" class=":class">', {
            type: options.type,
            class: cls.join(' ')
        });

        // Set attributes
        if (typeof options.placeholder === 'string') {
            elm.attr('placeholder', options.placeholder);
        }

        // Bind properties
        elm.bindDisabled(options.disabled);
        elm.bindText(options.text, options.type);
        elm.bindVisible(options.visible);

        // Return component
        return elm;

        // var autofillPoller = function() {
        //     return Bacon.interval(50).take(10).map(get).filter(alia.isNotEmptyString).take(1);
        // };

        // var events = j.asEventStream("keyup input").merge(j.asEventStream("cut paste").delay(1)).merge(autofillPoller());
        // elm.defineProperty('text', options.text).bind(Bacon.Binding({
        //     initValue: alia.getString(options.text),
        //     get: get,
        //     events: events,
        //     set: function(value) {
        //         return j.val(value);
        //     }
        // }));        
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Checkbox

alia.defineControl({
    name: 'checkbox',
}, function() {

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            checked: false,
            visible: true
        });

        // Append checkbox element
        var elm = this.append('<input alia-context type="checkbox">');

        // Define properties
        var checked = elm.defineProperty('checked', options.checked);

        // Establish bindings
        elm.bindCheckboxField(checked);
        elm.bindVisible(options.visible);

        // Return component
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Textarea

alia.defineControl({
    name: 'textarea',
}, function() {

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true,
            resize: 'both'
        });

        // Append textarea element
        var elm = this.append('<textarea alia-context rows=":rows" class="form-control" style="resize::resize"></textarea>', {
            rows: options.rows,
            resize: options.resize
        });

        // Apply attributes
        if (typeof options.placeholder === 'string') {
            elm.attr('placeholder', options.placeholder);
        }

        // Apply styles
        elm.css('width', '100%');

        // Establish bindings
        elm.bindText(options.text, 'text');
        elm.bindVisible(options.visible);

        // Return component
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Select (Combo Box)

alia.defineControl({
    name: 'select',
}, function() {

    function doStaticOptions(elm, opts) {
        if (!Array.isArray(opts)) {
            return;
        }

        for (var i = 0; i < opts.length; ++i) {
            var opt = opts[i];
            if (typeof opt === 'string' || typeof opt === 'number') {
                elm.append('<option value=":text">:text</option>', {
                    text: opt
                });
            } else {
                elm.append('<option value=":value">:text</option>', {
                    value: (opt.hasOwnProperty('value')) ? opt.value : opt.text,
                    text: opt.text
                });
            }
        }
        $('#' + elm.id()).trigger('change');
    }

    function doOptions(elm, opts) {
        var len = 0;
        opts.property('.length').onResolve(function (size) {
            if (size < len) {
                len = size;
            } else {
                for (var i = len; i < size; ++i) {
                    var opt = opts.at(i);
                    doOption(elm, opt);
                }
            }
        })
    }

    function doOption(elm, opt) {
        var optelm;
        opt.observe(function (value) {
            if (typeof value === 'string' || typeof value === 'number') {
                optelm = elm.append('<option value=":text">:text</option>', {
                    text: value
                });
                $('#' + elm.id()).trigger('change');
            } else {
                optelm = elm.append('<option value=":value">:text</option>', {
                    value: (value.hasOwnProperty('value')) ? value.value : value.text,
                    text: value.text
                });
                $('#' + elm.id()).trigger('change');
            }
        }, function () {
            if (typeof optelm !== 'undefined') {
                $('#' + optelm.id()).remove();
                optelm = undefined;
            }
            $('#' + elm.id()).trigger('change');
        }, null);
    }

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        // Append checkbox element
        var elm = this.append('<select alia-context class="form-control" :multiple></select>', {
            multiple: (options.multiple) ? 'multiple' : ''
        });

        // Bind properties
        elm.bindSelectValue(options.selected);
        elm.bindVisible(options.visible);

        var opts = null;
        if (alia.isAccessor(options.options)) {
            doOptions(elm, options.options);
        } else {
            doStaticOptions(elm, options.options);
        }

        // Return component
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Date picker 

alia.defineControl({
    name: 'datepicker'
}, function() {
    return function (options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        var elm = this.append('<input alia-context type="text" class="form-control">');

        $('#' + elm.id()).datepicker({
            startDate: options.startDate,
            endDate: options.endDate
        });
        
        // Set attributes
        if (typeof options.placeholder === 'string') {
            elm.attr('placeholder', options.placeholder);
        }

        elm.bindDate(options.date);
        elm.bindVisible(options.visible);

        return elm;
    }
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Typeahead

alia.defineControl({
    name: 'typeahead',
}, function() {

    var sizes = {
        large: 'input-lg',
        small: 'imput-sm'
    };

    return function(options) {

        var engine;
        if (options.type === 'string') {
            engine = new Bloodhound({
                datumTokenizer: function(d) {
                    return Bloodhound.tokenizers.whitespace(d);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: 10,
                local: []
            });
        } else if (options.type === 'object') {
            engine = new Bloodhound({
                datumTokenizer: function(d) {
                    return Bloodhound.tokenizers.whitespace(d.display);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: 10,
                local: []
            });
        }

        engine.initialize();

        // Set default options
        alia.applyDefaults(options, {
            disabled: false,
            visible: true
        });

        // Determine class
        var cls = ['form-control'];
        if (typeof options.size === 'string' && sizes.hasOwnProperty(options.size)) {
            cls.push(sizes[options.size]);
        }

        // Append text element
        var elm = this.append('<input alia-context type="text" class=":class">', {
            class: cls.join(' ')
        });

        // Make it a typeahead
        $('#' + elm.id()).typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'typeahead-dataset',
            displayKey: function(value) {
                if (options.type === 'string') {
                    return value;
                } else if (options.type === 'object') {
                    return value.display;
                }
            },
            source: engine.ttAdapter()
        });

        // Set attributes
        if (typeof options.placeholder === 'string') {
            elm.attr('placeholder', options.placeholder);
        }

        var pools = {};

        function setPools() {
            engine.clear();
            for (var prop in pools) {
                engine.add(pools[prop]);
            }
        }

        if (alia.isAccessor(options.pool)) {
            options.pool.onResolve(function(pool) {
                pools[0] = pool;
                setPools();
            });
        } else if (Array.isArray(options.pool)) {
            for (var i = 0; i < options.pool.length; ++i) {
                if (alia.isAccessor(options.pool[i])) {
                    options.pool[i].onResolve(function (idx) {
                        return function (value) {
                            pools[idx] = JSON.parse(JSON.stringify(value));
                            setPools();
                        }
                    }(i))
                }
            }
        }

        // Bind properties
        elm.bindDisabled(options.disabled);
        elm.bindText(options.text, 'text');
        elm.bindVisible(options.visible);

        // Define property
        var value = elm.defineProperty('value', options.value);

        // Check whether editable
        elm.onFocusOut(function() {
            var found = false;
            elm.text.set($('#' + elm.id()).typeahead('val'));
            var val = elm.text.get();
            if (val === '') value.set(null);
            for (var prop in pools) {
                for (var j = 0; j < pools[prop].length; ++j) {
                    if (options.type === 'string' && pools[prop][j] === val) {
                        value.set(val);
                        found = true;
                        break;
                    } else if (options.type === 'object' && pools[prop][j].display === val) {
                        value.set(pools[prop][j].key);
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
            if (!found && !options.editable) {
                elm.text.set('');
                $('#' + elm.id()).typeahead('val', '');
            } else if (!found && options.editable) {
                value.set(val);
            }
        });

        // Return component
        return elm;
    };
}());