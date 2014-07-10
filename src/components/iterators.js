(function($, alia) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Widget

    alia.defineControl({
        name: 'repeat',
    }, function() {


        return function(options) {

            // Append div element (for encapsulating widget)
            var div = this.append('<div alia-context></div>');


            // Initialize data
            var data = alia.state(options.data);
            var rowCount = null;
            data.onResolve(function(rows) {
                if (rows.length !== rowCount) {
                    rowCount = rows.length;
                    render();
                }
            });

            div.defineProperty('data', data);



            // var values = [];

            // var setter = function(index) {
            //     return function(value) {
            //         values[index] = value;
            //     }
            // }

            // Define render function
            function render() {
                div.empty();
                for (var i = 0; i < rowCount; ++i) {
                    var ctx = div.append('<div alia-context></div>');
                    var value = data.at(i);
                    options.callback.call(null, ctx, value);
                }
            }

            // Render current state
            render();

            // Return component
            return div;
        };
    }());
}($, alia));