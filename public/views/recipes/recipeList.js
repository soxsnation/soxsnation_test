/* recipeList.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/1/2014
 *
 */

"use strict";

(function() {

    function doAddRecipeModal(ctx, sox, view) {
        return alia.doModalForm(ctx, {
            title: 'Add Recipe',
            size: 'large',
            fields: [{
                name: 'name',
                label: "Recipe Name",
                initValue: ''
            }, {
                name: 'description',
                label: 'Recipe Description',
                initValue: ''
            }]
        }).onSubmit(function(event, value, resolve, reject) {
            console.log(value);
            var recipe = {
                description: value.description,
                name: value.name,
                createdAt: new Date()
            }

            var req = sox.insertRecipe(recipe);
            req.onResolve(function(data) {
                console.log(data._id);
                view.push('recipe', {
                    id: data._id
                });
                // resolve();
            });
            req.onError(function(err) {
                reject(err);
            });

        });
    }

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

    function doSubheader(ctx, sox, view) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {
            alia.doButton(ctx, {
                text: 'Add Recipe'
            }).onClick(function(event) {
                doAddRecipeModal(ctx, sox, view).show();
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
        dependencies: ['$location', 'sox']
    }, function(ctx, $location, sox) {
        var view = ctx;
        console.log('recipeList');

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
        doSubheader(ctx, sox, view);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doTable(ctx, view, recipes);
        });
    });
}());