(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Multiview Navigation Linkset

    alia.defineLayout({
        name: 'multiviewNavigationLinkset'
    }, function() {
        return function() {
            // Append list element
            var elm = this.append('<ul alia-context class="mulitview-navigation-linkset"></ul>');


            var self = this;
            elm.push = function() {
                self.push.apply(self, arguments);
                return this;
            };

            // Return component
            return elm;
        };
    }());

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Multiview Navigation Header

    alia.defineControl({
        name: 'multiviewNavigationHeader',
    }, function() {
        return function(options) {

            // Append link element
            var elm = this.append('<li role="presentation" class="multiview-navigation-header">:text</li>', {
                text: options.text
            });

            // Define and bind properties
            elm.bindHtml(elm.defineProperty('text', options.text));

            // Return component
            return elm;
        };
    }());

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Multiview Navigation Item

    alia.defineControl({
        name: 'multiviewNavigationItem',
    }, function() {
        return function(options) {

            // Set default options
            alia.applyDefaults(options, {
                visible: true
            });

            var elm;
            if (options.hasOwnProperty('view')) {
                elm = this.append('<li><a alia-context style="cursor: pointer;">:text</a></li>', {
                    link: options.link,
                    text: options.text
                }).onClick(function() {
                    this.push(options.view, options.query);
                }.bind(this));
                elm.bindHtml('text', options.text);
            } else if (options.hasOwnProperty('link')) {
                elm = this.append('<li><a alia-context href=":link">:text</a></li>', {
                    link: options.link,
                    text: options.text
                });
                elm.bindHtml('text', options.text);
            }

            elm.bindVisible(options.visible);

            return elm;
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Multiview Navigation Item

    alia.defineControl({
        name: 'multiviewNavigationDivider',
    }, function() {
        return function() {
            return this.append('<li alia-context class="divider"></li>');
        };
    }());
}($, alia));