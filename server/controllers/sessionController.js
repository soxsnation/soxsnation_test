/* sessionController.js
 *
 * Author(s):  Andrew Brown
 * Date:       7/15/2014
 *
 */


exports.login = function(req, res, next) {
	Utils.parse(req, function(err, step) {
		Recipe.findOne({
			_id: req.params.id
		}).exec(function(err, recipe) {
			if (err) {
				return next(err);
			} else {
				recipe.addStep(step, function(data) {
					res.send(200);
					// res.json(recipe);
				});
			}
		});
	});
}


exports.getSession = function(req, res, next) {

	}

	exports.getUser = function(req, res, next) {

	}

	exports.logout = function(req, res, next) {

	}










