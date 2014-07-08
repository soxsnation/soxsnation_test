'use strict';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Image

alia.defineControl({
    name: 'image'
}, function() {

    var styles = {
        rounded: 'img-rounded',
        circle: 'img-circle',
        thumbnail: 'img-thumbnail'
    }

    return function(options) {

        var cls = [];
        if (typeof options.style === 'string' && styles.hasOwnProperty(options.style)) {
            cls.push(styles[options.style]);
        }
        if (typeof options.responsive === 'boolean' && options.responsive) {
            cls.push('img-responsive');
        }

        var content=":text";
        if (typeof options.link === 'object' && options.link.hasOwnProperty('href')) {
            content = alia.replace('<a href=":href">:text</a>', {
                href: options.link
            });
        }

        var elm = this.append(alia.replace(content, { text: '<img src=":source" alt=":alt" class=":class">' }), {
            source: options.source,
            alt: options.alt || '',
            class: cls.join(' ')
        });

        // Return component
        return elm;
    };
}());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Media

alia.defineLayout({
    name: 'media'
}, function () {
    return function (options) {

        var html = [
            '<div class="media" style="cursor:pointer">',
            '  <a class="pull-left">',
            '    <img class="media-object" src=":source" alt=":alt">',
            '  </a>',
            '  <div alia-context class="media-body"></div>',
            '</div>'
        ];

        var elm = this.append(html.join(''), {
            source: options.source,
            alt: options.alt || ''
        });

        // Return component
        return elm;
    };
}());