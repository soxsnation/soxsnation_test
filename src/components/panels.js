(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Tabset

    alia.defineLayout({
        name: 'panel',
    }, function() {

        var styles = {
            'default': 'panel-default',
            'primary': 'panel-primary',
            'success': 'panel-success',
            'info': 'panel-info',
            'warning': 'panel-warning',
            'danger': 'panel-danger'
        };

        var headerStyles = {
            'default': null,
            'h1': 'h1',
            'h2': 'h2',
            'h3': 'h3',
            'h4': 'h4',
            'h5': 'h5',
            'h6': 'h6',
        };

        return function(options) {

            // Apply defaults
            alia.applyDefaults(options, {
                style: 'default',
                headerStyle: 'default',
                visible: true,
                collapsible: false,
                collapsed: false
            }, {
                style: styles,
                headerStyle: headerStyles
            });

            // Append component
            var html = '<div alia-context="div" class="panel :style">';
            if (options.header) {
                if (options.headerStyle) {
                    html += '<div class="panel-heading"><:hs alia-context="header" class="panel-title"></:hs></div>';
                } else {
                    html += '<div alia-context="header" class="panel-heading"></div>';
                }
            }
            html += '<div alia-context class="panel-body"></div>';
            if (options.footer) {
                html += '<div alia-context="footer" class="panel-footer"></div>';
            }
            html += '</div>';
            var elm = this.append(html, {
                style: styles[options.style],
                hs: headerStyles[options.headerStyle]
            });

            // Bind visibility
            elm.bindVisible('div', options.visible);

            // Define property
            if (options.collapsible) {
                elm.bindCollapse('', options.collapsed);
                $('#' + elm.id('header')).css('cursor', 'pointer');

                if (options.headerStyle) {
                    $('#' + elm.id('header')).parent().click(function() {
                        elm.collapsed.set(!elm.collapsed.get());
                    });
                } else {
                    // Bind click
                    $('#' + elm.id('header')).click(function() {
                        elm.collapsed.set(!elm.collapsed.get());
                    });
                }
            }

            // Establish bindings
            var headerProperty, footerProperty;
            if (options.header) {
                headerProperty = elm.defineProperty('header', options.header);
                headerProperty.onResolve(function(value) {
                    $('#' + elm.id('header')).html(value);
                });
            }
            if (options.footer) {
                footerProperty = elm.defineProperty('footer', options.footer);
                footerProperty.onResolve(function(value) {
                    $('#' + elm.id('footer')).html(value);
                });
            }

            // Return component
            return elm;
        };
    }());
}($, alia));