/* createModel.js
 *
 * Author(s):  Andrew Brown
 * Date:       8/5/2014
 *
 */

"use strict";

(function() {

	function doHeader(ctx, recipeName) {
		alia.layoutDiv(ctx, {
			classes: 'fancy-header'
		}, function(ctx) {
			alia.doHeading(ctx, {
				type: 1,
				text: 'Create Model'
			});
		});
	}

	function doContent(ctx, view, sox) {

		var modelName = alia.state('');
		var modelDescription = alia.state('');

		alia.doTextbox(ctx, {
			text: modelName,
			placeholder: 'Model Name'
		});

		alia.doTextbox(ctx, {
			text: modelDescription,
			placeholder: 'Model Description'
		});



		alia.doTextarea(ctx, {
			rows: 3,
			resize: 'vertical',
			text: workOrder.property('.comments'),
			placeholder: 'Enter Comments',
			disabled: disabled
		});


	}


	alia.defineView({
		path: '/createModel',
		dependencies: [
			'session', '$location', 'sox'
		]
	}, function(ctx, session, $location, sox) {


		doHeader(ctx);

		alia.layoutDiv(ctx, {
			classes: 'fancy-viewport-content'
		}, function(ctx) {
			doContent(ctx, view, sox);
		});

	});
}());