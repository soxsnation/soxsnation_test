(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Modal

    alia.defineLayout({
        name: 'modal'
    }, function() {

        var sizes = {
            'large': 'modal-lg',
            'small': 'modal-sm'
        };

        return function(options) {

            // Determine classes
            var fade = '';
            var cls = ['modal-dialog'];
            if (typeof options.size === 'string' && sizes.hasOwnProperty(options.size)) {
                cls.push(sizes[options.size]);
            }
            if (typeof options.fade === 'undefined' || options.fade === true) {
                fade = 'fade';
            }

            // Append components
            var content =
                '<div alia-context class="modal :fade" tabindex="-1" role="dialog" aria-labelledby=":title" aria-hidden="true">' +
                '  <div class=":class">' +
                '    <div alia-context="content" class="modal-content"></div>' +
                '  </div>' +
                '</div>';
            var elm = this.append(content, {
                title: options.title,
                class: cls.join(' '),
                fade: fade
            });

            // Initialize modal using jquery
            $('#' + elm.id()).modal({
                backdrop: 'static',
                show: false
            });

            // Overwrite show and hide functions
            elm.hide = function() {
                $('#' + elm.id()).modal('hide');
            };
            elm.show = function() {
                $('#' + elm.id()).modal('show');
            };

            $('#' + elm.id()).on('shown.bs.modal', function() {
                $('#' + elm.id() + ' form:first *:input[type!=hidden][disabled!="disabled"][class!="form-control tt-hint"]:first').focus();
            });

            // Return component
            return elm;
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Modal Header

    alia.defineLayout({
        name: 'modalHeader'
    }, function() {
        return this.append('content', '<div alia-context class="modal-header"></div>');
    });


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Modal

    alia.defineLayout({
        name: 'modalBody'
    }, function() {
        return this.append('content', '<div alia-context class="modal-body"></div>');
    });


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Modal

    alia.defineLayout({
        name: 'modalFooter'
    }, function() {
        return this.append('content', '<div alia-context class="modal-footer"></div>');
    });


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Modal 

    alia.defineControl({
        name: 'modalForm'
    }, function() {

        var fieldTypes = {
            'text': {
                type: 'string',
                default: '',
                inputType: 'textbox'
            },
            'number': {
                type: 'number',
                default: 0,
                inputType: 'textbox'
            },
            'boolean': {
                type: 'boolean',
                default: true,
                inputType: 'checkbox'
            },
            'typeahead': {
                default: '',
                inputType: 'typeahead'
            },
            'datepicker': {
                default: '',
                inputType: 'datepicker'
            }
        };

        function getResolvedEmitName(name) {
            var emit = 'emit' + name.charAt(0).toUpperCase() + name.slice(1);
            return emit;
        }

        function makeClickHandler(form, name, submitting, message, modal) {
            return function() {
                submitting.set(true);
                var data = form.getData();
                var resolve = function() {
                    submitting.set(false);
                    message.set(null);
                    modal.hide();
                    form.refresh();
                };
                var reject = function(msg) {
                    submitting.set(false);
                    message.set(msg);
                };
                modal[getResolvedEmitName(name)](data, resolve, reject);
            };
        }

        return function(options) {

            // Determine form data (should eventually be moved to form control)
            var i,
                formdata = {},
                formfields = [];
            for (i = 0; i < options.fields.length; ++i) {
                var field = options.fields[i];
                if (typeof field.name !== 'string') {
                    throw new Error("Invalid form field name");
                }
                var t;
                var fieldType;
                if (typeof field.type === 'string' && fieldTypes.hasOwnProperty(field.type)) {
                    t = field.type;
                    fieldType = fieldTypes[field.type];
                } else {
                    t = 'text';
                    fieldType = fieldTypes.text;
                }
                if (!alia.isAccessor(options.formdata)) {
                    formdata[field.name] = typeof field.initValue === fieldType.type ? field.initValue : fieldType.default;
                }
                var fielddata = {
                    type: fieldType.inputType,
                    label: field.label,
                    lens: '.' + field.name,
                    datatype: t,
                    placeholder: field.placeholder || '',
                    disabled: field.disabled || false
                };
                // Add extra properties for typeahead
                if (fielddata.type === 'typeahead') {
                    fielddata.sourcetype = field.sourcetype;
                    fielddata.source = field.source;
                    fielddata.editable = field.editable;
                }
                formfields.push(fielddata);
            }
            if (alia.isAccessor(options.formData)) {
                formdata = options.formData;
            }

            // Initialize state
            var submitting = alia.state(false);
            var message = alia.state(null);

            // Layout modal
            var modal = alia.layoutModal(this, {
                size: options.size,
                title: options.title,
                fade: options.fade
            }, function(ctx) {
                var modalCtx = ctx;

                alia.layoutModalHeader(ctx, {}, function(ctx) {
                    alia.doButton(ctx, {
                        close: true,
                        text: '&times;'
                    }).onClick(function() {
                        submitting.set(false);
                        message.set(null);
                        modal.hide();
                    });
                    alia.doHeading(ctx, {
                        type: 4,
                        text: options.title
                    });
                });
                var form;

                alia.layoutModalBody(ctx, {}, function(ctx) {
                    form = alia.doForm(ctx, {
                        label: {
                            large: 3,
                            small: 4
                        },
                        control: {
                            large: 9,
                            small: 8
                        },
                        model: formdata,
                        fields: formfields
                    });
                });

                alia.layoutModalFooter(ctx, {}, function(ctx) {
                    if (Array.isArray(options.buttons)) {
                        var buttons = options.buttons;
                        for (var i = 0; i < buttons.length; ++i) {
                            alia.doButton(ctx, {
                                text: buttons[i].text,
                                eventName: buttons.eventName,
                                disabled: submitting
                            }).onClick(makeClickHandler(form, buttons[i].eventName, submitting, message, modalCtx));
                        }
                    }

                    alia.doText(ctx, {
                        text: message,
                        style: 'danger',
                        visible: message.then(alia.isNotEmptyString)
                    });
                    alia.doText(ctx, {
                        text: '&nbsp;&nbsp;&nbsp;',
                    });
                    alia.doButton(ctx, {
                        text: 'Cancel',
                        disabled: submitting
                    }).onClick(function() {
                        form.refresh();
                        message.set(null);
                        modal.hide();
                    });
                    var saveBtn = alia.doButton(ctx, {
                        text: 'Save',
                        style: 'primary',
                        loading: submitting,
                        loadingStyle: 'expand-right'
                    }).onClick(function() {
                        submitting.set(true);
                        var data = form.getData();
                        var resolve = function() {
                            submitting.set(false);
                            message.set(null);
                            modal.hide();
                            form.refresh();
                        };
                        var reject = function(msg) {
                            submitting.set(false);
                            message.set(msg);
                        };
                        modal.emitSubmit(data, resolve, reject);
                    });

                    if (options.onEnterKeySubmit) {
                        modalCtx.onEnterKey(function() {
                            saveBtn.doClick();
                        });
                    }
                });
            });

            // Define events
            modal.defineEvent('Submit');

            if (Array.isArray(options.buttons)) {
                var buttons = options.buttons;
                for (i = 0; i < buttons.length; ++i) {
                    modal.defineEvent(buttons[i].eventName);
                }
            }

            // Return modal
            return modal;
        };
    }());
}($, alia));