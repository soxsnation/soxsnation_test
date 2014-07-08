'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Carousel

alia.defineLayout({
    name: 'carousel',
}, function() {

    return function(options) {

        var html = [
            '<div alia-context class="carousel slide" data-ride="carousel">',
            '  <ol alia-context="indicators" class="carousel-indicators"></ol>',
            '  <div alia-context="items" class="carousel-inner"></div>',
            '</div>'
        ]
        var elm = this.append(html.join(''));

        if (typeof options.auto === 'number') {
            elm.attr('data-interval', options.auto);
        }

        var navigation = [
            '<a class="left carousel-control" data-target=":target" data-slide="prev">',
            '  <span class="glyphicon glyphicon-chevron-left"></span>',
            '</a>',
            '<a class="right carousel-control" data-target=":target" data-slide="next">',
            '  <span class="glyphicon glyphicon-chevron-right"></span>',
            '</a>'
        ];

        var nav = elm.append(navigation.join(''), {
            target: '#' + elm.ids['']
        });

        // Return component
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Carousel items

alia.defineLayout({
    name: 'carouselItem',
}, function() {

    return function(options) {

        // Determine class
        var cls = ['item'];
        if (typeof options.active === 'boolean' && options.active === true) {
            cls.push('active');
        }
        var elm = this.append('items', '<div alia-context class=":class"></div>', {
            class: cls.join(' ')
        });

        var count = $('#' + this.id('indicators') + ' li').length;
        var cls_incicator = [];
        if (typeof options.active === 'boolean' && options.active === true) {
            cls_incicator.push('active');
        }
        this.append('indicators', '<li data-target=":target" data-slide-to=":no" class=":class"></li>', {
            no: count,
            target: '#' + this.id(),
            class: cls_incicator.join(' ')
        });

        // Return component
        return elm;
    };
}());