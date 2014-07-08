/* addRecipe.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/1/2014
 *
 */

"use strict";

(function() {



    function doHeader(ctx) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: 'Add Recipe'
            });
        });
    }

    function doSubheader(ctx, sox) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            alia.doButton(ctx, {
                text: 'Add Recipe'
            }).onClick(function(event) {
                ctx.push('addRecipe', {});
            });


        });
    }

    function doTable(ctx, view, recipes) {
        var table = alia.doReadTable(ctx, {
            style: 'hover',
            header: ['Doc #', 'Employee', 'Status', 'Items'],
            dataType: 'object',
            data: recipes,
            sortable: true,
            paging: {
                'default': 10,
                options: [10, 50]
            },
            rowClick: function(event, data) {
                view.push('current', {
                    id: data.docNum
                });
            },
            fields: [{
                name: 'docNum'
            }, {
                name: 'username'
            }, {
                name: 'status',
                map: function(value) {
                    switch (value) {
                        case 'boposPlanned':
                            return 'Planned';
                        case 'boposReleased':
                            return 'Released';
                    }
                }
            }, {
                name: 'items',
                map: function(items) {
                    return items.length;
                },
                sortPrimer: function(items) {
                    return 0;
                }
            }]
        });
    }

    alia.defineView({
        path: '/addRecipe',
        dependencies: ['sox']
    }, function(ctx, sox) {
        var view = ctx;

        // alia.doButton(ctx, {
        //     text: 'Add Recipe'
        // }).onClick(function(event) {
        //     console.log('click');
        // });
        // State
        var recipes = alia.state(sox.getRecipes());
        // var recipes = alia.state([]);

        doHeader(ctx);
        doSubheader(ctx, sox);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, view, recipes);
        });
    });
}());