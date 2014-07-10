(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Tabset

    alia.defineLayout({
        name: 'tabset',
    }, function() {

        var styles = {
            'horizontal': 'horizontal',
            'vertical': 'vertical'
        };

        return function(options) {

            // Set default options
            alia.applyDefaults(options, {
                visible: true
            });

            var style = styles[options.style] || styles.horizontal;
            var content = '';
            if (style === 'horizontal') {
                content =
                    '<div class="container-fluid" alia-context>' +
                    '  <div class="row">' +
                    '    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
                    '      <ul alia-context="nav" class="nav nav-tabs"></ul>' +
                    '      <div alia-context="content" class="tab-content"></div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
            } else {
                content =
                    '<div class="container-fluid" alia-context>' +
                    '  <div class="row">' +
                    '    <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5">' +
                    '      <ul alia-context="nav" class="nav nav-pills nav-stacked"></ul>' +
                    '    </div>' +
                    '    <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">' +
                    '      <div alia-context="content" class="tab-content"></div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
            }
            var elm = this.append(content);

            // Bind visibility
            elm.bindVisible(options.visible);

            // Return component
            return elm;
        };
    }());

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Tab

    alia.defineLayout({
        name: 'tab',
    }, function() {

        return function(options) {

            // Define properties
            // this.defineProperty('title', options.title);

            // Determine class
            var cls = [];
            if (typeof options.active === 'boolean' && options.active) {
                cls.push('active');
            }

            var content = this.append('content', '<div alia-context class="tab-pane :class"></div>', {
                class: cls.join(' ')
            });

            this.append('nav', '<li alia-context class=":class"><a data-target=":target" data-toggle="tab" style="cursor:pointer;">:title</a></li>', {
                class: cls.join(' '),
                target: '#' + content.ids[''],
                title: alia.getString(options.title)
            }); // Removed onClick - I don't think it's needed - Kyle

            return content;
        };
    }());

    // TODO: Everything needs to be retested
}($, alia));