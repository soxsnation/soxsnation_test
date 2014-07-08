/* recipes.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/1/2014
 *
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Multiview

alia.defineMultiview({
	path: '/recipes',
	dependencies: [
		'$location', '$route','sox'
	],
}, function(multiview, $location, $route, sox) {
	multiview.navigation(function(ctx) {
		alia.layoutMultiviewNavigationLinkset(ctx, {}, function(ctx) {
			alia.doMultiviewNavigationHeader(ctx, {
				text: 'Recipes'
			});
			alia.doMultiviewNavigationItem(ctx, {
				text: 'Recipe List',
				view: 'recipeList'
			});
			alia.doMultiviewNavigationItem(ctx, {
				text: 'Add Recipe',
				view: 'addRecipe'
			})
			// alia.doMultiviewNavigationDivider(ctx, {});

			// alia.doMultiviewNavigationHeader(ctx, {
			//     text: 'Work Orders'
			// });
			// alia.doMultiviewNavigationItem(ctx, {
			//     text: 'Past Work Orders',
			//     view: 'past'
			// });
			// alia.doMultiviewNavigationItem(ctx, {
			//     text: 'My Work Orders',
			//     view: 'mine'
			// });
		});
	}).include({
		name: 'recipeList',
		path: '/recipeList'
	}).include({
		name: 'addRecipe',
		path: '/addRecipe'
	}).include({
		name: 'recipe',
		path: '/recipe'
	}).begin('recipeList');
});