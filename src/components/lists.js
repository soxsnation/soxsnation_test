// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Lists

alia.defineLayout({
	name: 'unorderedList'
}, function(options) {
	return this.append('<ul alia-context></ul>');
});

alia.defineLayout({
	name: 'orderedList'
}, function(options) {
	return this.append('<ol alia-context></ol>');
});

alia.defineLayout({
	name: 'listItem'
}, function(options) {
	return this.append('<li alia-context></li>');
});

alia.defineLayout({
	name: 'descriptionList'
}, function() {

	var styles = {
		'default': null,
		'horizontal': 'dl-horizontal'
	};

	return function(options) {

		// Set default options
		alia.applyDefaults(options, {
			visible: true,
			style: 'default'
		}, {
			style: styles
		});

		// Determine class
		return this.append('<dl alia-context class=":class"></dl>', {
			class: _.compact([
				styles[options.style]
			]).join('')
		});
	}
}());

alia.defineLayout({
	name: 'descriptionTerm'
}, function(options) {
	return this.append('<dt alia-context></dt>');
});

alia.defineLayout({
	name: 'descriptionItem'
}, function(options) {
	return this.append('<dd alia-context></dd>');
});

alia.defineControl({
	name: 'descriptionList'
}, function(options) {

	var elm = alia.layoutDescriptionList(this, options, function(ctx) {
		for (var i = 0; i < options.items.length; ++i) {
			alia.layoutDescriptionTerm(ctx, {}, function(ctx) {
				alia.doText(ctx, {
					text: options.items[i].term
				});
			});
			alia.layoutDescriptionItem(ctx, {}, function(ctx) {
				alia.doText(ctx, {
					text: options.items[i].description
				});
			});
		}
	});

	return elm;

});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// List group

alia.defineLayout({
	name: 'listGroup'
}, function() {

	return function(options) {
		return this.append('<ul alia-context class="list-group"></ul>');
	};
}());

alia.defineLayout({
	name: 'listGroupItem'
}, function() {

	var styles = {
		default: null,
		success: 'list-group-item-success',
		info: 'list-group-item-info',
		warning: 'list-group-item-warning',
		danger: 'list-group-item-danger',
	};

	return function(options) {

		// Set default options
		alia.applyDefaults(options, {
			visible: true,
			style: 'default'
		}, {
			style: styles
		});

		var elm = this.append('<ul alia-context class=":class"></ul>', {
			class: _.compact([
				'list-group-item',
				styles[options.style]
			]).join('')
		});

		elm.bindVisible(options.visible);

		return elm;
	};
}());

alia.defineControl({
	name: 'listGroup'
}, function() {



	return function(options) {

	};
}());