'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Button

alia.defineControl({
    name: 'button',
}, function() {

    var styles = {
        'default': 'btn-default',
        'primary': 'btn-primary',
        'success': 'btn-success',
        'info': 'btn-info',
        'warning': 'btn-warning',
        'danger': 'btn-danger',
        'link': 'btn-link',
    }

    var sizes = {
        'large': 'btn-lg',
        'small': 'btn-sm',
        'xsmall': 'btn-xs'
    };

    var loadingStyles = {
        'none': null,
        'expand-right': 'expand-right'
    }

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            disabled: false,
            loadingStyle: 'none',
            progress: null,
            visible: true
        }, {
            loadingStyle: loadingStyles
        });

        // Determine class
        var cls = ['btn'];
        if (typeof options.close === 'boolean' && options.close) {
            cls[0] = 'close';
        } else {
            if (typeof options.style === 'string' && styles.hasOwnProperty(options.style)) {
                cls.push(styles[options.style]);
            } else {
                cls.push(styles['default']);
            }
            if (typeof options.size === 'string' && sizes.hasOwnProperty(options.size)) {
                cls.push(sizes[options.size]);
            }
        }

        // Handle plain vs ladda button styles
        var elm;
        if (alia.isAccessor(options.loading)) {

            // Append button component
            var html =
                '<button alia-context type="button" class=":class ladda-button" data-style=":loadingStyle">' +
                '  <span alia-context="label" class="ladda-label"></span>' +
                '</button>';
            // var html = '<button alia-context type="button" class=":class"></button>';
            elm = this.append(html, {
                class: cls.join(' '),
                loadingStyle: loadingStyles[options.loadingStyle]
            });

            // Bind properties
            var j = $('#' + elm.id());
            var jlabel = $('#' + elm.id('label'));
            var jladda = Ladda.create(j[0]);
            elm.bindHtml('label', 'text', options.text);
            elm.bindDisabled(options.disabled);
            elm.defineProperty('loading', options.loading).onResolve(function(value) {
                if (value !== jladda.isLoading()) {
                    jladda.toggle();
                }
            });

        } else {

            // Append button component
            var html = '<button alia-context type="button" class=":class"></button>';
            elm = this.append(html, {
                class: cls.join(' ')
            });

            // Bind properties
            var j = $('#' + elm.id());
            elm.bindHtml('text', options.text);
            elm.bindDisabled(options.disabled);
        }

        elm.bindVisible(options.visible);

        // Return component
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Button Addon

alia.defineLayout({
    name: 'buttonAddon'
}, function () {
    return function (options) {
        var elm = this.append('<span alia-context class="input-group-btn"></span>');

        return elm;
    }
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Button Group

alia.defineLayout({
    name: 'buttonGroup',
}, function() {

    var sizes = {
        'large': 'btn-group-lg',
        'small': 'btn-group-sm',
        'xsmall': 'btn-group-xs'
    };

    return function(options) {

        // Determine class
        var cls = ['btn-group'];
        if (options.vertical == true) {
            cls[0] += '-vertical';
        }
        if (typeof options.size === 'string' && sizes.hasOwnProperty(options.size)) {
            cls.push(sizes[options.size]);
        }
        if (typeof options.justified === 'boolean' && options.justified) {
            cls.push('btn-group-justified');
        }

        // Append button group component
        return this.append('<div alia-context class=":class"></div>', {
            class: cls.join(' ')
        });
    };
}());

alia.defineControl({
    name: 'buttonRadioGroup'
}, function() {

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            currentIndex: 0
        });

        var buttons = [];
        var activeIndex = -1;

        var set = function(index) {
            return function() {
                currentIndex.set(index);
            };
        }

        var elm = alia.layoutButtonGroup(this, {}, function(ctx) {
            for (var i = 0; i < options.options.length; ++i) {
                var btn = alia.doButton(ctx, {
                    text: options.options[i]
                }).onClick(set(i));
                buttons.push({
                    text: options.options[i],
                    btn: btn,
                    j: $('#' + btn.id())
                });
            }
        });

        var currentIndex = elm.defineProperty('currentIndex', options.currentIndex);
        currentIndex.onResolve(function(value) {
            if (activeIndex !== value) {
                if (activeIndex !== null && activeIndex > -1) {
                    var prev = buttons[activeIndex];
                    prev.j.removeClass('btn-info');
                    prev.j.addClass('btn-default');
                }
                if (value !== null && value > -1) {
                    var next = buttons[value];
                    next.j.removeClass('btn-default');
                    next.j.addClass('btn-info');
                }
                activeIndex = value;
            }
        })

        // Return element
        return elm;
    };
}());