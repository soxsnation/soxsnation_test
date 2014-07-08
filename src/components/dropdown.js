'use strict';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dropdown

alia.defineLayout({
    name: 'dropdown'
}, function() {
    return function(options) {
        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        var elm = this.append([
            '<div alia-context class="dropdown">',
            '  <a alia-context="toggler"></a>',
            '</div>'
        ].join(''));

        if (alia.isAccessor(options.text)) {
            options.text.onResolve(function(value) {
                $('#' + elm.id('toggler')).html(value);
            })
        } else {
            $('#' + elm.id('toggler')).html(options.text);
        }

        $('html').click(function() {
            elm.class('remove', 'open');
        })

        $('#' + elm.id('toggler')).click(function(event) {
            elm.class('add', 'open');
            event.stopPropagation();
        });

        elm.bindVisible(options.visible);

        return elm;
    };
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dropdown Menu

alia.defineLayout({
    name: 'dropdownMenu'
}, function() {
    return function(options) {
        return this.append('<ul alia-context class="dropdown-menu" role="menu"></ul>');
    }
}())


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dropdown Item

alia.defineLayout({
    name: 'dropdownItem'
}, function() {
    return function(options) {
        var elm = this.append('<li alia-context></li>');

        return elm;
    };
}());

alia.defineControl({
    name: 'dropdownItem'
}, function() {
    return function(options) {

        alia.applyDefaults(options, {
            visible: true
        });

        var elm = this.append('<li><a alia-context style="cursor: pointer"></a></li>').bindHtml('text', options.text);

        if (typeof options.link === 'string') {
            elm.attr('href', options.link);
        }

        elm.bindVisible(options.visible);

        return elm;
    };
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dropdown Divider

alia.defineControl({
    name: 'dropdownDivider'
}, function() {
    return function(options) {
        return this.append('<li alia-context class="divider"></li>');
    };
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dropdown Header

alia.defineControl({
    name: 'dropdownHeader'
}, function() {
    return function(options) {

        // Append link element
        var elm = this.append('<li role="presentation" class="dropdown-header">:text</li>', {
            text: alia.getString(options.text)
        });

        // Define and bind properties
        elm.bindHtml('text', options.text);

        // Return component
        return elm;
    };
}());