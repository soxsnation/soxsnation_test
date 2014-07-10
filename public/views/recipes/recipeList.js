/* recipeList.js
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
                text: 'Recipe List'
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
                // ctx.push('addRecipe', {});
                console.log('click');
            });


        });
    }

    function doTable(ctx, view, recipes) {
        var table = alia.doTable(ctx, {
            style: 'hover,striped',
            selectable: true,
            clickable: true,
            sortable: true,
            paging: {
                'default': 10,
                options: [10, 25, 50]
            },
            spinner: true,
            data: recipes,
            fields: [{
                heading: 'Recipe Name',
                property: '.name'
            }, {
                heading: 'Description',
                property: '.description'
            }, {
                heading: 'Made By',
                property: '.user'
            }, {
                heading: 'Added Date',
                property: '.createdAt'
            }]
        }).onRowClick(function(event, item) {
            view.push('recipe', {
                id: item._id
            });
        });


    }

    alia.defineView({
        path: '/recipeList',
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

        recipes.onResolve(function(data) {
            console.log(data)
        })

        doHeader(ctx);
        doSubheader(ctx, sox);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, view, recipes);
        });
    });
}());