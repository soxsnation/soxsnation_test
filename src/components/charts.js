'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Button

alia.defineControl({
    name: 'donutChart',
}, function() {



    return function(options) {

        // Set default options
        alia.defaults(options, {
            visible: true
        });

        var width = 960,
            height = 500,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.category20();

        var pie = d3.layout.pie().value(function(d) {
            return d;
        }).sort(null);

        var arc = d3.svg.arc()
            .innerRadius(radius - 100)
            .outerRadius(radius - 20);

        var elm = this.append('<div alia-context></div>');
        var j = $('#' + elm.id());

        var svg = d3.select(j[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = null;

        options.data.onResolve(function(data) {
            if (path === null) {
                var indices = [];
                for (var i = 0; i < data.length; ++i) {
                    indices.push(i);
                }

                path = svg.datum(indices).selectAll("path")
                    .data(pie)
                    .enter().append("path")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", arc)
                    .each(function(d) {
                        this._current = d;
                    }); // store the initial angles
            }
            // // clearTimeout(timeout);
            pie.value(function(d) {
                return data[d];
            }); // change the value function
            path = path.data(pie); // compute the new angles
            path.attr("d", arc);
            path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        });


        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
        }


        // btn.bindEnabled(enabled);
        // elm.bindVisible(options.visible);

        // Return component
        return elm;
    };
}());