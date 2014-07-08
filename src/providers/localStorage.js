'use strict';

alia.defineProvider({
    name: '$localStorage',
    dependencies: []
}, function() {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Provider functions

    var sto = {};

    sto.set = function(prop, value) {
        if (typeof prop === 'string') {
            var key = 'alia-' + prop;
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            throw new Error('Attempted to set localStorage value for non-string property');
        }
    }

    sto.get = function(prop) {
        if (typeof prop === 'string') {
            var key = 'alia-' + prop;
            return JSON.parse(localStorage.getItem(key));
        } else {
            throw new Error('Attempted to get localStorage value for non-string property');
        }
    }

    sto.remove = function(prop) {
        if (typeof prop === 'string') {
            var key = 'alia-' + prop;
            localStorage.removeItem(key);
        } else {
            throw new Error('Attempted to remove localStorage item for non-string property');
        }
    }

    sto.clear = function (prop) {
        for (var key in localStorage) {
            if (key.substr(0, 5) === 'alia-') {
                localStorage.removeItem(key);
            }
        }
    }

    return sto;

});