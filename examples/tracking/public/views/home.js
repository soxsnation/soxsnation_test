alia.defineView({
    path: '/',
    dependencies: [
        '$location'
    ]
}, function(ctx, $location) {



    alia.layoutDiv(ctx, {
            classes: 'fancy-header',
        dependencies: ['session']
        }, function(ctx, session) {
            alia.doHeading(ctx, {
                type: 1,
                text: '.decimal Tracking'
            });
        });

});



