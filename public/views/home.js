alia.defineView({
    path: '/',
    dependencies: [
        '$location'
    ]
}, function(ctx, $location) {



    alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'soxsnation'
            });
        });

});



