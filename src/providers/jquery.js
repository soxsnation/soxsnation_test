(function(alia, $) {
    "use strict";

    alia.defineProvider({
        name: '$'
    }, function() {
        return $;
    });
}(alia, $));