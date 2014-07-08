'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Jumbotron

alia.defineLayout({
    name: 'jumbotron',
}, function() {
    return function(options) {
        if (options.type === 'extend') {
            return this.append('<div class="jumbotron"><div alia-context class="container"></div></div>');
        } else {
            return this.append('<div alia-context class="jumbotron" id=":id"></div>');
        }
    };
}());