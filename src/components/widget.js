'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Widget

alia.defineControl({
    name: 'widget',
}, function() {

    var displays = {
        inlineBlock: 'inline-block'
    }

    var float = {
        'right': 'pull-right',
        'left': 'pull-left'
    };

    return function(options) {
        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        // Append div element (for encapsulating widget)
        var div = this.append('<div alia-context></div>');

        if (typeof options.display === 'string' && displays.hasOwnProperty(options.display)) {
            div.css('display', displays[options.display]);
        }
        if (typeof options.margin === 'number') {
            div.css('margin', options.margin + 'px');
        }
        if (typeof options.float === 'string' && float.hasOwnProperty(options.float)) {
            div.class('add', float[options.float]);
        }

        var values = [];

        var set = function(index, value) {
            values[index] = value;
        }

        // Define render function
        function render() {
            for (var i = 0; i < values.length; ++i) {
                if (typeof values[i] === 'undefined') {
                    return;
                }
            }
            div.empty();
            var args = [div];
            for (var i = 0; i < values.length; ++i) {
                args.push(values[i]);
            }
            options.fcn.apply(null, args);
        }

        // Bind to argument changes
        for (var i = 0; i < options.args.length; ++i) {
            if (alia.isAccessor(options.args[i])) {
                values.push(undefined);
                options.args[i].onResolve(function (index) {
                    return function (value) {
                        set(index, value);
                        render();
                    }
                }(i));
            } else {
                values.push(options.args[i]);
            }
        }

        // Render current state
        render();

        div.bindVisible(options.visible);

        // Return component
        return div;
    }
}());