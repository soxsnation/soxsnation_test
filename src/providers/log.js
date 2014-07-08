'use strict';

alia.defineProvider({
	name: '$log',
	dependencies: ['$window']
}, function($window) {

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Private variables

	var debug = true;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Private functions

	function consoleLog(type) {
		var console = $window.console || {};
		var fcn = console[type] || console.log || alia.noop;
		var hasApply = false;

		// Note: reading fcn.apply throws an error in IE11 in IE8 document mode.
		// The reason behind this is that console.log has type "object" in IE8...
		try {
			hasApply = !!fcn.apply;
		} catch (e) {}

		if (hasApply) {
			return function() {
				var args = [];
				forEach(arguments, function(arg) {
					args.push(formatError(arg));
				});
				return logFn.apply(console, args);
			};
		}

		// we are IE which either doesn't have window.console => this is noop and we do nothing,
		// or we are IE where console.log doesn't have apply so we log at least first 2 args
		return function(arg1, arg2) {
			logFn(arg1, arg2 == null ? '' : arg2);
		};
	}


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Provider

	return {};
});