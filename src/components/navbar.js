(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navbar

    alia.defineLayout({
        name: 'navbar',
    }, function() {

        var styles = {
            'default': 'navbar-default',
            'inverse': 'navbar-inverse'
        };

        var fixedPositions = {
            'top': 'navbar-fixed-top',
            'bottom': 'navbar-fixed-bottom'
        };

        return function(options) {

            // Determine class
            var cls = ['navbar'];
            if (typeof options.style === 'string' && styles.hasOwnProperty(options.style)) {
                cls.push(styles[options.style]);
            } else {
                cls.push(styles.default);
            }

            if (typeof options.fixed === 'string' && fixedPositions.hasOwnProperty(options.fixed)) {
                // if (options.fixed === 'top') $('body').css('padding-top', '51px');
                // if (options.fixed === 'bottom') $('body').css('padding-bottom', '51px');
                cls.push(fixedPositions[options.fixed]);
            }

            // Append containing component
            var containerContent =
                '<nav class=":class" role="navigation">' +
                '  <div alia-context class="container-fluid"></div>' +
                '</nav>';
            var container = this.append(containerContent, {
                class: cls.join(' ')
            });

            var brand;
            if (typeof options.brand === 'string') {
                brand = options.brand;
            } else {
                brand = 'Brand';
            }

            // Append header component
            var header = container.append(
                '<div class="navbar-header">' +
                '  <button alia-context="collapse" type="button" class="navbar-toggle" data-toggle="collapse">' +
                '    <span class="sr-only">Toggle navigation</span>' +
                '    <span class="icon-bar"></span>' +
                '    <span class="icon-bar"></span>' +
                '    <span class="icon-bar"></span>' +
                '  </button>' +
                '  <a class="navbar-brand" href="#">:brand</a>' +
                '</div>', {
                    brand: brand
                });

            // Append content component
            var content = container.append(
                '<div alia-context class="collapse navbar-collapse">' +
                '  <ul alia-context="nav" class="nav navbar-nav"></ul>' +
                '</div>');

            // Associate collapsable content
            header.kattr('collapse', 'data-target', '#' + content.id());

            // Return component
            return content;
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navbar Form

    alia.defineLayout({
        name: 'navbarForm'
    }, function() {
        return function() {
            return this.append('<form alia-context class="navbar-form navbar-left"></form>');
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navbar Right

    alia.defineLayout({
        name: 'navbarRight'
    }, function() {
        return function() {
            return this.append('<ul alia-context="nav" class="nav navbar-nav navbar-right"></ul>');
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navbar Link

    alia.defineControl({
        name: 'navbarLink',
    }, function() {
        return function(options) {

            // Set default options
            alia.applyDefaults(options, {
                visible: true
            });

            // Append link element
            var elm = this.append('nav', '<li alia-context="navLink" class="navLink"><a alia-context href=":link"></a></li>', {
                link: options.link,
            });

            // Bind common properties
            elm.bindVisible('navLink', options.visible);

            // Define properties and bind to element
            var j = $('#' + elm.id());
            var text = elm.defineProperty('text', options.text);
            text.onResolve(function(value) {
                j.html(value);
            });
            text.onError(function() {
                j.empty();
            });

            // Return element
            return elm;
        };
    }());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navbar Dropdown

    alia.defineLayout({
        name: 'navbarDropdown',
    }, function() {
        return function(options) {

            // Set default options
            alia.applyDefaults(options, {
                visible: true
            });

            // Append dropdown element
            var content =
                '<li alia-context="dropdown" class="dropdown">' +
                '  <a alia-context="link" class="dropdown-toggle" style="cursor:pointer;" data-toggle="dropdown">:text <b class="caret"></b></a>' +
                '  <ul alia-context class="dropdown-menu"></ul>' +
                '</li>';
            var elm = this.append('nav', content, {
                link: options.link
            });

            // Bind common properties
            elm.bindVisible('dropdown', options.visible);

            // Define and bind custom properties
            var text = elm.defineProperty('text', options.text);
            text.onResolve(function(value) {
                elm.khtml('link', value + ' <b class="caret"></b>');
            });
            text.onError(function() {
                elm.khtml('link', '');
            });

            // Return element
            return elm;
        };
    }());
}($, alia));