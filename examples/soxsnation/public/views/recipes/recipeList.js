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
        var table = alia.doReadTable(ctx, {
            style: 'hover',
            header: ['Recipe Name', 'Description', 'Made By', 'Added Date'],
            dataType: 'object',
            data: recipes,
            sortable: true,
            paging: {
                'default': 10,
                options: [10, 50]
            },
            rowClick: function(event, data) {
                view.push('recipe', {
                    id: data._id
                });
            },
            fields: [{
                name: 'name'
            }, {
                name: 'description'
            },{
                name: 'user'
            }, {
                name: 'createdAt'
            }]
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

        recipes.onResolve(function(data){
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