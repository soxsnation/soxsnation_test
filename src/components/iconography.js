// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Icon

alia.defineControl({
    name: 'icon',
}, function() {
    return function (options) {
        var cls = ['glyphicon'];
        if (typeof options.name === 'string') {
            cls.push('glyphicon-' + options.name);
        }

        var elm = this.append('<span alia-context class=":class"> </span>', {
            class: cls.join(' ')
        });

        if (alia.isAccessor(options.name)) {
            options.name.onResolve(function (value) {
                var cls = ['glyphicon'];
                if (typeof value === 'string') {
                    cls.push('glyphicon-' + value);
                }

                elm.removeAttr('class');
                elm.attr('class', cls.join(' '));
            })
        }

        return elm;
    }
}());