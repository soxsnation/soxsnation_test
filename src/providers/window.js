(function(alia, window) {
    "use strict";

    alia.defineProvider({
        name: '$window'
    }, function() {
        return window;
    });
}(alia, window));