/* recipe.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/1/2014
 *
 */

"use strict";

(function() {


    function doAddStepModal(ctx, id, sox, stepNumber, refreshRecipe) {
        return alia.doModalForm(ctx, {
            title: 'Add Step',
            size: 'large',
            fields: [{
                name: 'number',
                label: "Step Number",
                type: 'number',
                initValue: stepNumber,
                disabled: true
            }, {
                name: 'description',
                label: 'Step Instructions',
                initValue: ''
            }]
        }).onSubmit(function(event, value, resolve, reject) {
            console.log(value);
            var step = {
                description: value.description,
                number: value.number
            }

            var req = sox.addStep(id.get(), step);
            req.onResolve(function(data) {
                console.log(data);
                refreshRecipe.set(true);
                resolve();
            });
            req.onError(function(err) {
                reject(err);
            });

        });
    }

    function doAddIngredientModal(ctx, id, sox, refreshRecipe) {
        return alia.doModalForm(ctx, {
            title: 'Add Ingredient',
            size: 'large',
            fields: [{
                name: 'name',
                label: 'Name',
                initValue: ''
            }, {
                name: 'quantity',
                label: "Quantity",
                initValue: ''
            }]
        }).onSubmit(function(event, value, resolve, reject) {
            console.log(value);
            var ingredient = {
                name: value.name,
                quantity: value.quantity
            }

            var req = sox.addIngredient(id.get(), ingredient);
            req.onResolve(function(data) {
                console.log(data);
                refreshRecipe.set(true);
                resolve();
            });
            req.onError(function(err) {
                reject(err);
            });

        });
    }

    function doHeader(ctx, recipeName) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-header'
        }, function(ctx) {
            alia.doHeading(ctx, {
                type: 1,
                text: recipeName
            });
        });
    }

    function doSubheader(ctx, sox, recipe) {
        alia.layoutDiv(ctx, {
            classes: 'fancy-subheader'
        }, function(ctx) {

            alia.doButton(ctx, {
                text: 'Save Recipe'
            }).onClick(function() {
                sox.updateRecipe(recipe.get()).onResolve(function(data) {
                    console.log(data);
                })
            })
        });
    }

    function doIngredients(ctx, recipe, sox, refreshRecipe) {
        var ingredients = recipe.property('.ingredients');
        alia.doBreak(ctx, {});
        // alia.doText(ctx, {
        //     text: 'Ingredients'
        // });

        alia.layoutPanel(ctx, {
            header: 'Ingredients',
            headerStyle: 'h1',
            collapsible: true,
            visible: true
        }, function(ctx) {

            var table = alia.doTable(ctx, {
                style: 'hover,striped',
                selectable: false,
                sortable: true,
                // paging: {
                //     'default': 10,
                //     options: [10, 25, 50]
                // },
                spinner: true,
                data: ingredients,
                fields: [{
                    heading: 'Ingredient',
                    property: '.name'
                }, {
                    heading: 'Quantity',
                    property: '.quantity'
                }]
            });

            var button = alia.doButton(ctx, {
                text: 'Add Ingredient'
            }).onClick(function() {

                doAddIngredientModal(ctx, recipe.property('._id'), sox, refreshRecipe).show();
                // ingredientModal.show();
            });


        });
    }

    function doSteps(ctx, recipe, sox, refreshRecipe) {
        var steps = recipe.property('.steps');
        alia.doBreak(ctx, {});
        // alia.doText(ctx, {
        //     text: 'Steps'
        // })

        alia.layoutColumn(ctx, {
            width: {
                xsmall: 12,
                small: 6
            }
        }, function(ctx) {
            alia.layoutPanel(ctx, {
                header: 'Steps',
                headerStyle: 'h1',
                collapsible: true,
                visible: true
            }, function(ctx) {

                var table = alia.doTable(ctx, {
                    style: 'hover,striped',
                    selectable: false,
                    sortable: true,
                    spinner: true,
                    data: steps,
                    fields: [{
                        heading: '#',
                        property: '.number'
                    }, {
                        heading: 'Step Directions',
                        property: '.description'
                    }]
                });

                var button = alia.doButton(ctx, {
                    text: 'Add Step'
                }).onClick(function() {

                    var stepModal = doAddStepModal(ctx, recipe.property('._id'), sox, steps.get().length + 1, refreshRecipe);
                    stepModal.show();
                });

            });
        });
    }



    alia.defineView({
        path: '/recipe',
        dependencies: ['sox', '$query']
    }, function(ctx, sox, $query) {
        var view = ctx;

        var recipe = alia.state(sox.getRecipeById($query.id));
        // var ingredients = recipe.property('.ingredients');
        var refreshRecipe = alia.state(false);
        // var steps = recipe.property('.steps');

        // var stepModal = doStepModal(ctx, steps);

        refreshRecipe.onResolve(function(value) {
            console.log(value);
            if (value) {
                var rec = sox.getRecipeById($query.id);
                rec.onResolve(function(data) {
                    recipe.set(data);
                });
                refreshRecipe.set(false);
            }
            // if (value) {
            //     console.log('Refreshing recipe');
            //     var rec = sox.getRecipeById($query.id);
            //     rec.onResolve(data) {
            //         recipe.set(data);
            //     }
            //     refreshRecipe.set(false);
            // }

        });

        recipe.onResolve(function(value) {
            console.log('Recipe');
            console.log(value);
        });

        doHeader(ctx, recipe.property('.name'));
        // doSubheader(ctx, sox, recipe);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doIngredients(ctx, recipe, sox, refreshRecipe);
            doSteps(ctx, recipe, sox, refreshRecipe);
        });
    });
}());