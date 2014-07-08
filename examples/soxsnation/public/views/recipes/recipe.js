/* recipe.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/1/2014
 *
 */

"use strict";

(function() {


    function doStepModal(ctx, steps) {
        return alia.doModalForm(ctx, {
            title: 'Add Step',
            size: 'large',
            fields: [{
                name: 'description',
                label: 'Description',
                initValue: ''
            }, {
                name: 'number',
                label: "Number",
                type: 'number',
                initValue: 0
            }]
        }).onSubmit(function(event, value, resolve, reject) {
            var stepsCopy = steps.get();
            console.log(value);
            var step = {
                description: value.description,
                number: value.number
            }
            stepsCopy.push(step);
            steps.set(stepsCopy);
            resolve();
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
                sox.updateRecipe(recipe.get()).onResolve(function(data){
                    console.log(data);
                })
            })

            // alia.doText(ctx, {
            //     text: 'SubHeader'
            // })
            //     alia.doButton(ctx, {
            //         text: 'Receive Material'
            //     }).onClick(function() {
            //         console.log(purchaseOrderItems.get());

            //         // var temp = purchaseOrderItems.get();
            //         // purchaseOrderItems.set(temp);
            //         // inv.getPurchaseOrderById(args.id).onValue(function(po) {
            //         // inv.insertGoodsReceiptPO(po)
            //         // });
            //         // inv.insertGoodsReceiptPO(purchaseOrder.get());

            //     });

            //     alia.doButton(ctx, {
            //         text: 'Add PO Line'
            //     }).onClick(function() {
            //         console.log('Add PO Line');
            //         modal.show();
            //     });
        });
    }

    function doIngredients(ctx, ingredients) {
        alia.doBreak(ctx, {});
        alia.doText(ctx, {
            text: 'Ingredients'
        });

        var table = alia.doReadTable(ctx, {
            style: 'hover,striped',
            header: ['Ingredient', 'Quantity'],
            selectable: false,
            sortable: true,
            spinner: true,
            data: ingredients,
            fields: [{
                name: 'name'
            }, {
                name: 'quantity'
            }],
            deferred: false
        });

        // alia.doButton(ctx, {
        //     text: 'DeBug'
        // }).onClick(function() {
        //     console.log(ingredients.get());
        // })
        // alia.doBreak(ctx, {});
        // alia.doBreak(ctx, {});
        // var ingredientList = ingredients.get();
        // alia.layoutUnorderedList(ctx, {}, function(ctx) {
        //     alia.layoutListItem(ctx, {}, function(ctx) {
        //         alia.doText(ctx, {
        //             text: 'Corn Beef'
        //         });
        //     });
        //     alia.layoutListItem(ctx, {}, function(ctx) {
        //         alia.doText(ctx, {
        //             text: 'Carrots'
        //         });
        //     });
        // });
    }

    function doSteps(ctx, steps, stepModal) {
        alia.doBreak(ctx, {});
        alia.doText(ctx, {
            text: 'Steps'
        })

        var table = alia.doReadTable(ctx, {
            style: 'hover,striped',
            header: ['Number', 'Description'],
            selectable: false,
            sortable: true,
            spinner: true,
            data: steps,
            fields: [{
                name: 'number'
            }, {
                name: 'description'
            }],
            deferred: false
        });

        var button = alia.doButton(ctx, {
            text: 'Add Step'
        }).onClick(function() {
            stepModal.show();
        })

    }



    alia.defineView({
        path: '/recipe',
        dependencies: ['sox', '$query']
    }, function(ctx, sox, $query) {
        var view = ctx;

        var recipe = alia.state(sox.getRecipeById($query.id));
        var ingredients = recipe.property('.ingredients');
        var steps = recipe.property('.steps');

        var stepModal = doStepModal(ctx, steps);

        recipe.onResolve(function(value) {
            console.log('Recipe');
            console.log(value);
        })

        doHeader(ctx, recipe.property('.name'));
        doSubheader(ctx, sox, recipe);

        alia.layoutDiv(ctx, {
            classes: 'fancy-viewport-content'
        }, function(ctx) {
            doIngredients(ctx, ingredients);
            doSteps(ctx, steps, stepModal);
        });
    });
}());