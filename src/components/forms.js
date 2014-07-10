(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Form

    alia.defineLayout({
        name: 'form'
    }, function() {

        var styles = {
            'default': 'form',
            'horizontal': 'form-horizontal',
            'inline': 'form-inline'
        };

        var positions = {
            'left': 'navbar-form navbar-left',
            'right': 'navbar-form navbar-right'
        };

        return function(options) {

            // Set default options
            if (typeof options.style !== 'string' || !styles.hasOwnProperty(options.style)) {
                options.style = styles.default;
            }

            // Determine class
            var cls = [styles[options.style]];
            if (typeof options.position === 'string' && positions.hasOwnProperty(options.position)) {
                cls.push(positions[options.position]);
            }

            // Append table element
            var elm = this.append('<form alia-context class=":class"></form>', {
                class: cls.join(' ')
            });

            // Define properties
            elm.defineStatic('style', options.style);

            // Return component
            return elm;
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Form

    alia.defineLayout({
        name: 'formField'
    }, function() {

        var types = {
            'large': 'lg',
            'medium': 'md',
            'small': 'sm',
            'xsmall': 'xs'
        };

        return function(options) {
            var prop, labelcls;
            switch (this.style) {
                case 'horizontal':

                    // Determine class
                    labelcls = ['control-label'];
                    if (typeof options.labelwidth === 'object' && !Array.isArray(options.labelwidth)) {
                        for (prop in options.labelwidth) {
                            if (types.hasOwnProperty(prop)) {
                                labelcls.push('col-' + types[prop] + '-' + options.labelwidth[prop]);
                            }
                        }
                    }
                    if (typeof options.labeloffset === 'object' && !Array.isArray(options.labeloffset)) {
                        for (prop in options.labeloffset) {
                            if (types.hasOwnProperty(prop)) {
                                labelcls.push('col-' + types[prop] + '-offset-' + options.labeloffset[prop]);
                            }
                        }
                    }
                    var cls = [];
                    if (typeof options.width === 'object' && !Array.isArray(options.width)) {
                        for (prop in options.width) {
                            if (types.hasOwnProperty(prop)) {
                                cls.push('col-' + types[prop] + '-' + options.width[prop]);
                            }
                        }
                    }
                    if (typeof options.offset === 'object' && !Array.isArray(options.offset)) {
                        for (prop in options.offset) {
                            if (types.hasOwnProperty(prop)) {
                                cls.push('col-' + types[prop] + '-offset-' + options.offset[prop]);
                            }
                        }
                    }

                    if (typeof options.special === 'string' && options.special === 'checkbox') {
                        return this.append(
                            '<div class="form-group">' +
                            '  <div class=":class">' +
                            '    <div class="checkbox">' +
                            '      <label alia-context></label>' +
                            '    </div>' +
                            '  </div>' +
                            '</div>', {
                                class: cls.join(' ')
                            });
                    } else if (typeof options.special === 'string' && options.special === 'button') {
                        return this.append(
                            '<div class="form-group">' +
                            '  <div alia-context class=":class">' +
                            '  </div>' +
                            '</div>', {
                                class: cls.join(' ')
                            });
                    } else {
                        return this.append(
                            '<div class="form-group">' +
                            '  <label class=":labelclass">:text</label>' +
                            '  <div alia-context class=":class"></div>' +
                            '</div>', {
                                labelclass: labelcls.join(' '),
                                class: cls.join(' '),
                                text: options.text
                            });
                    }

                    break;
                case 'inline':
                default:
                    // Determine class
                    labelcls = ['sr-only'];

                    if (typeof options.checkbox === 'boolean' && options.checkbox) {
                        return this.append(
                            '<div class="checkbox">' +
                            '  <label alia-context></label>' +
                            '</div>', {});
                    } else {
                        return this.append(
                            '<div alia-context class="form-group">' +
                            '  <label class=":labelclass">:text</label>' +
                            '</div>', {
                                labelclass: labelcls.join(' '),
                                text: options.text
                            });
                    }
                    break;
            }
        };
    }());

    alia.defineControl({
        name: 'form'
    }, function() {
        function doField(ctx, field, model, options) {
            switch (field.type) {
                case 'checkbox':
                    alia.layoutFormField(ctx, {
                        special: 'checkbox',
                        offset: options.label,
                        width: options.control
                    }, function(ctx) {
                        var checkbox = alia.doCheckbox(ctx, {
                            checked: model.property(field.lens)
                        });
                        alia.doText(ctx, {
                            text: field.label
                        });

                        model.property(field.lens).onUnresolve(function() {
                            checkbox.checked.set(null);
                        });
                    });
                    break;
                case 'textbox':
                    alia.layoutFormField(ctx, {
                        text: field.label,
                        labelwidth: options.label,
                        width: options.control
                    }, function(ctx) {
                        var textbox = alia.doTextbox(ctx, {
                            text: model.property(field.lens),
                            type: field.datatype || 'text',
                            placeholder: field.placeholder || '',
                            disabled: field.disabled
                        });

                        model.property(field.lens).onUnresolve(function() {
                            textbox.text.set(null);
                        });
                    });
                    break;
                case 'typeahead':
                    alia.layoutFormField(ctx, {
                        text: field.label,
                        labelwidth: options.label,
                        width: options.control
                    }, function(ctx) {
                        var typeahead = alia.doTypeahead(ctx, {
                            value: model.property(field.lens),
                            type: field.sourcetype,
                            pool: field.source,
                            editable: field.editable
                        });

                        model.property(field.lens).onUnresolve(function() {
                            typeahead.text.set(null);
                            typeahead.value.set(null);
                        });
                    });
                    break;
                case 'datepicker':
                    alia.layoutFormField(ctx, {
                        text: field.label,
                        labelwidth: options.label,
                        width: options.control
                    }, function(ctx) {
                        var datepicker = alia.doDatepicker(ctx, {
                            placeholder: 'Enter Date',
                            date: model.property(field.lens)
                        });

                        model.property(field.lens).onUnresolve(function() {
                            datepicker.date.set(null);
                        });
                    });
                    break;
            }
        }

        return function(options) {
            // Append div element (for encapsulating widget)
            var div = this.append('<div alia-context></div>');

            var model;
            if (alia.isAccessor(options.model)) {
                model = options.model;
            } else {
                model = alia.state(options.model);
            }
            var fields = options.fields;

            alia.layoutForm(div, {
                style: 'horizontal'
            }, function(ctx) {
                for (var i = 0; i < fields.length; ++i) {
                    var field = fields[i];

                    doField(ctx, field, model, options);
                }
            });

            div.getData = function() {
                return model.get();
            };

            div.refresh = function() {};

            return div;
        };
    }());
}($, alia));