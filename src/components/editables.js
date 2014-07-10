(function($, alia, Spinner) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Textbox

    alia.defineControl({
        name: 'editableTextbox',
    }, function() {

        var types = {
            text: 'text',
            email: 'email',
            number: 'number',
            password: 'password'
        };

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
            className: 'spinner' // The CSS class to assign to the spinner
        };

        return function(options) {

            // Set default options
            alia.applyDefaults(options, {
                type: 'text',
                disabled: false,
                visible: true,
                deferred: true
            }, {
                type: types
            });

            // Append div element
            var div = this.append('<div alia-context class="editable-element text-toggle"></div>');

            // Append text element
            alia.doText(div, {
                text: options.text
            }).class('add', 'editable-text').onClick(function() {
                div.class('toggle', 'text-toggle');
                jinput.focus();
            }).onHover(function() {
                editIcon.class('add', 'visible');
            }, function() {
                editIcon.class('remove', 'visible');
            });

            // Append glyph element
            var editIcon = alia.doIcon(div, {
                name: 'pencil'
            });

            // Append form element
            var form = div.append('<form alia-context class="editable-form"></form>');

            // Append input element
            var input = form.append('<input alia-context type=":type">', {
                type: options.type
            }).onFocusOut(function() {
                if (options.deferred === false) {
                    div.class('toggle', 'text-toggle');
                    if (text.isSettable()) {
                        text.set(temp.get());
                    }
                }
            });
            var jinput = $('#' + input.id());

            if (options.deferred) {

                // Append button elements
                var btns = form.append('<div alia-context class="save-options"></div>');
                alia.layoutButtonGroup(btns, {
                    size: 'small'
                }, function(ctx) {
                    var btn_accept = alia.doButton(ctx, {}).onClick(function() {
                        var data = temp.get();
                        var resolve = function() {
                            spinner.stop();
                            div.class('toggle', 'text-toggle');
                            text.set(data);
                        };
                        var reject = function(msg) {
                            spinner.stop();
                            alia.error(msg);
                        };
                        spinner.spin(target);
                        $(spinner.el).removeAttr('style');
                        div.emitSubmit(data, resolve, reject);
                    });
                    alia.doIcon(btn_accept, {
                        name: 'ok'
                    });
                    var btn_cancel = alia.doButton(ctx, {}).onClick(function() {
                        div.class('toggle', 'text-toggle');
                        temp.set(text.get());
                    });
                    alia.doIcon(btn_cancel, {
                        name: 'remove'
                    });
                });

                // Append and start spinner
                var spinnerSpan = div.append('<span alia-context class="spinner"></span>');
                var target = $('#' + spinnerSpan.id(''))[0];
                var spinner = new Spinner(spin_opts);
            }

            // Define properties
            var text = input.defineProperty('text', options.text);
            var temp = alia.state();

            // if (alia.isAccessor(options.text)) {
            //     console.log('here');
            //     options.text.onResolve(function(value) {
            //         console.log('options.text', value);
            //     })
            // }

            if (options.deferred === true) {
                text.onResolve(function(value) {
                    temp.set(value);
                    options.text.set(value);
                });
            } else {
                text.onResolve(function(value) {
                    temp.set(value);
                });
            }

            input.bindText('edited', temp, options.type);

            div.defineEvent('submit');

            return div;
        };
    }());

    alia.defineControl({
        name: 'editableBoolean'
    }, function() {
        var types = {
            'y/n': 'y/n',
            't/f': 't/f'
        };

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
            className: 'spinner' // The CSS class to assign to the spinner
        };

        return function(options) {
            // Set default options
            alia.applyDefaults(options, {
                type: 't/f',
                disabled: false,
                visible: true
            }, {
                type: types
            });

            // Append div element
            var div = this.append('<div alia-context class="editable-element text-toggle"></div>');

            // Append text element
            alia.doText(div, {
                text: (typeof options.map === 'function') ? options.map(options.value) : options.value
            }).class('add', 'editable-text').onClick(function() {
                div.class('toggle', 'text-toggle');
            }).onHover(function() {
                editIcon.class('add', 'visible');
            }, function() {
                editIcon.class('remove', 'visible');
            });

            // Append glyph element
            var editIcon = alia.doIcon(div, {
                name: 'pencil'
            });

            // Append form element
            var form = div.append('<form alia-context class="editable-form"></form>');

            // Append select element
            var select = form.append([
                '<select alia-context>',
                '  <option value="true">:textTrue</option>',
                '  <option value="false">:textFalse</option>',
                '</select>'
            ].join(''), {
                textTrue: (options.type === 't/f') ? 'True' : 'Yes',
                textFalse: (options.type === 't/f') ? 'False' : 'No'
            });

            // Append button elements
            var btns = form.append('<div alia-context class="save-options"></div>');
            alia.layoutButtonGroup(btns, {
                size: 'small'
            }, function(ctx) {
                var btn_accept = alia.doButton(ctx, {}).onClick(function() {
                    var data = (temp.get() === 'true') ? true : false;
                    var resolve = function() {
                        spinner.stop();
                        div.class('toggle', 'text-toggle');
                        bool.set(data);
                    };
                    var reject = function(msg) {
                        spinner.stop();
                        alia.error(msg);
                    };
                    spinner.spin(target);
                    $(spinner.el).removeAttr('style');
                    div.emitSubmit(data, resolve, reject);
                });
                alia.doIcon(btn_accept, {
                    name: 'ok'
                });
                var btn_cancel = alia.doButton(ctx, {}).onClick(function() {
                    div.class('toggle', 'text-toggle');
                    temp.set((bool.get()) ? 'true' : 'false');
                });
                alia.doIcon(btn_cancel, {
                    name: 'remove'
                });
            });

            // Append and start spinner
            var spinnerSpan = div.append('<span alia-context class="spinner"></span>');
            var target = $('#' + spinnerSpan.id(''))[0];
            var spinner = new Spinner(spin_opts);

            // Define properties
            var bool = select.defineProperty('bool', options.value);

            var temp = alia.state((options.value === true) ? 'true' : 'false');

            // Establish bindings
            select.bindText('text', temp, 'text');

            div.defineEvent('submit');

            return div;
        };
    }());

    alia.defineControl({
        name: 'editableMarkdown'
    }, function() {

        // var spin_opts = {
        //     lines: 9, // The number of lines to draw
        //     length: 5, // The length of each line
        //     width: 1.5, // The line thickness
        //     radius: 2.7, // The radius of the inner circle
        //     corners: 0.8, // Corner roundness (0..1)
        //     rotate: 0, // The rotation offset
        //     direction: 1, // 1: clockwise, -1: counterclockwise
        //     color: '#000', // #rgb or #rrggbb or array of colors
        //     speed: 2.2, // Rounds per second
        //     trail: 45, // Afterglow percentage
        //     shadow: false, // Whether to render a shadow
        //     hwaccel: false, // Whether to use hardware acceleration
        //     className: 'spinner' // The CSS class to assign to the spinner
        // };

        return function(options) {

            // Set default options
            alia.applyDefaults(options, {
                visible: true
            });

            var elm = this.append('<div alia-context>test</div>');

            // Return element 
            return elm;
        };
    }());
}($, alia, Spinner));