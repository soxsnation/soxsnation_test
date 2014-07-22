/* recipeComponent.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/16/2014
 *
 */

(function($, alia) {
	"use strict";

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Recipe Component

	alia.defineControl({
		name: 'recipe'
	}, function() {

		function doIngredientModal(ctx, ingredient) {
			return alia.doModalForm(ctx, {
            title: 'Update Ingredient',
            size: 'large',
            fields: [{
                name: 'name',
                label: "Recipe Name",
                initValue: ''
            }, {
                name: 'quantity',
                label: 'Quantity',
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

		function makeListItem(listData, field, field2, index) {
			return function(item) {
				item.class('add', 'item');
				var contents = listData.property('.' + index + field);
				var contents2 = listData.property('.' + index + field2);


				alia.layoutDiv(item, {
					// classes: 'wrap'
				}, function(wrap) {
					// alia.doText(wrap, {
					// 	text: contents2
					// }).class('add', 'name').class('add', 'text-muted');

					alia.doEditableTextbox(wrap, {
						type: 'text',
						text: contents2,
						deferred: false
					}).css('width', '150px');

					alia.doEditableTextbox(wrap, {
						type: 'text',
						text: contents,
						deferred: false
					}).css('width', '450px');



				})
			}
		}



		function doIngredients(div, ingredients) {
			alia.layoutDiv(div, {
				// classes: 'property-list'
			}, function(container) {

				ingredients.onResolve(function(data) {
					container.empty();
					alia.layoutUnorderedList(container, {}, function(list) {
						for (var i = 0; i < data.length; ++i) {
							alia.layoutListItem(list, {}, makeListItem(ingredients, '.name', '.quantity', i));
						}
					})
				})


			});
		}

		return function(options) {

			alia.applyDefaults(options, {
				deferred: true
			});

			var div = this.append('<div alia-context></div>');

			var recipe = options.data;
			var ingredients = recipe.property('.ingredients');

			doIngredients(div, ingredients);

			return div;
		};
	}());
}($, alia));