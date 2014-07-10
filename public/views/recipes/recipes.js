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
		'$location', 'sox'
	],
}, function(multiview, $location, sox) {
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
			});
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