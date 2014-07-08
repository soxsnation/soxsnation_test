'use strict';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Div

alia.defineLayout({
    name: 'div',
}, function() {

    var float = {
        'right': 'pull-right',
        'left': 'pull-left'
    };

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        // Determine class
        var cls = [];
        if (typeof options.classes === 'string') {
            cls = options.classes.split(',');
        } else if (Array.isArray(options.classes)) {
            cls = options.classes;
        }

        if (typeof options.float === 'string' && float.hasOwnProperty(options.float)) {
            cls.push(float[options.float]);
        }

        var elm = this.append('<div alia-context class=":class"></div>', {
            class: cls.join(' ')
        });

        // Check special width
        if (typeof options.width === 'object') {
            if (options.width.hasOwnProperty('percent') && typeof options.width.percent === 'number') {
                elm.css('width', options.width.percent + '%');
                elm.css('white-space', 'nowrap');
                elm.css('overflow-x', 'auto');
            }
            if (options.width.hasOwnProperty('pixel') && typeof options.width.pixel === 'number') {
                elm.css('width', options.width.pixel + 'px');
                elm.css('white-space', 'nowrap');
                elm.css('overflow-x', 'auto');
            }
        } else if (typeof options.width === 'string') {
            if (options.width === 'auto') {
                elm.css('width', 'auto');
            }
        }

        elm.bindVisible(options.visible);

        // Return element
        return elm;
    }
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Container

alia.defineLayout({
    name: 'container',
}, function() {

    var types = {
        'fixed': 'container',
        'fluid': 'container-fluid'
    };

    return function(options) {

        // Determine class
        var cls = [];
        if (typeof options.type === 'string' && types.hasOwnProperty(options.type)) {
            cls.push(types[options.type]);
        }

        // Append container element
        return this.append('<div alia-context class=":class"></div>', {
            class: cls.join(' ')
        });
    };
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Row

alia.defineLayout({
    name: 'row',
}, function(options) {

    var elm = this.append('<div alia-context class="row"></div>');

    switch (typeof options.padding) {
        case 'object':
            if (typeof options.padding.top === 'number') {
                elm.css('padding-top', options.padding.top + 'px');
            }
        case 'number':
        default:
    }

    return elm;
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Column

alia.defineLayout({
    name: 'column',
}, function() {

    var types = {
        'large': 'lg',
        'medium': 'md',
        'small': 'sm',
        'xsmall': 'xs'
    };

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        // Determine class
        var cls = [];
        if (options.width && typeof options.width === 'object' && !Array.isArray(options.width)) {
            for (var prop in options.width) {
                if (types.hasOwnProperty(prop)) {
                    cls.push('col-' + types[prop] + '-' + options.width[prop]);
                }
            }
        }
        if (options.offset && typeof options.offset === 'object' && !Array.isArray(options.width)) {
            for (var prop in options.offset) {
                if (types.hasOwnProperty(prop)) {
                    cls.push('col-' + types[prop] + '-offset-' + options.offset[prop]);
                }
            }
        }

        var elm = this.append('<div alia-context class=":class"></div>', {
            class: cls.join(' ')
        });

        elm.bindVisible(options.visible);

        // Append container element
        return elm;
    };
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Affix

alia.defineLayout({
    name: 'affix'
}, function() {

    return function(options) {

        var elm = this.append('<div alia-context></div>');

        if (typeof options.top === 'number') {
            elm.css('position', 'fixed');
            elm.css('top', options.top);
        }

        // Append container element
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Wells

alia.defineLayout({
    name: 'well',
}, function() {

    var sizes = {
        'large': 'well-lg',
        'small': 'well-sm'
    };

    return function(options) {

        // Determine class
        var cls = ['well']
        if (typeof options.size === 'string' && sizes.hasOwnProperty(options.size)) {
            cls.push(sizes[options.size]);
        }

        var elm = this.append('<div alia-context class=":class"></div>', {
            class: cls.join(' ')
        });

        // Return element
        return elm;
    }
}());