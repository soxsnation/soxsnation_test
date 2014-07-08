"use strict";


alia.defineControl({
    name: 'pageSpinner'
}, function () {

    var spin_opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1.0, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1.0, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'table-spinner' // The CSS class to assign to the spinner
    };

    return function (options) {
        var elm = alia.viewport.append('<div alia-context class="page-spinner-background"></div>');

        var target = $('#' + elm.id())[0];
        var spinner = new Spinner(spin_opts);

        spinner.spin(target);

        $('#' + elm.id()).attr('style', '');

        elm.stop = function () {
            spinner.stop();
            $('#' + elm.id()).hide();
        }

        elm.stopAndRemove = function () {
            spinner.stop();
            $('#' + elm.id()).remove();
        }

        elm.start = function () {
            spinner.spin(target);
            $('#' + elm.id()).show();
        }

        return elm;
    }
}());