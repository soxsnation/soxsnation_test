'use strict';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Alert

alia.defineControl({
    name: 'alert'
}, function () {
    var alertTypes = {
        'success': 'alert-success',
        'info': 'alert-info',
        'warning': 'alert-warning',
        'danger': 'alert-danger'
    };

    return function (options) {

        // Determine class
        var cls = ['alia-alert'];
        if (typeof options.type === 'string' && alertTypes.hasOwnProperty(options.type)) {
            cls.push(alertTypes[options.type]);
        }

        var elm = alia.alerts.append([
            '<div class=":class" alia-context>',
            '  <span alia-context="content"></span>',
            '  <button alia-context="close" type="button" class="close">&times;</button>',
            '</div>'].join(''), {
                class: cls.join(' ')
            });

        if (typeof options.autohide === 'number') {
            setTimeout(function() {
                $('#' + elm.id()).fadeOut(500, function() {
                    $(this).remove();
                });
            }.bind(this), options.autohide);
        }

        if (alia.isAccessor(options.text)) {
            options.text.onResolve(function (value) {
                elm.khtml('content', value);
            });
        } else {
            elm.khtml('content', options.text);
        }

        $('#' + elm.id('close')).click(function (e) {
            $('#' + elm.id()).remove();
        });

        return elm;
    }
}());