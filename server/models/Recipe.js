/* Recipe.js
 *
 * Author(s):  Andrew Brown
 * Date:       6/10/2014
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Getters
 */

var getTags = function(tags) {
	return tags.join(',')
}

/**
 * Setters
 */

var setTags = function(tags) {
	return ''; //tags.split(',')
}

/**
 * Recipe Schema
 */

var RecipeSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: String,
		default: '',
		trim: true
	},
	ingredients: [{
		name: {
			type: String,
			default: ''
		},
		quantity: {
			type: String,
			default: '',
			trim: true
		}
	}],
	steps: [{
		number: {
			type: Number,
			default: 1
		},
		description: {
			type: String,
			default: '',
			trim: true
		}
	}],
	tags: {
		type: [],
		get: getTags,
		set: setTags
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

/**
 * Validations
 */

RecipeSchema.path('name').required(true, 'Recipe name cannot be blank');
RecipeSchema.path('description').required(true, 'Recipe description cannot be blank');

/**
 * Pre-save hook
 */

// RecipeSchema.pre('save', function(next) {
// 	if (!this.isNew) return next()

// 	if (name === '') {
// 		next(new Error('Provide a name'));
// 	} else {
// 		next();
// 	}
// })

/**
 * Methods
 */

RecipeSchema.methods = {


	addIngredient: function(ingredient, cb) {

		this.ingredients.push({
			name: ingredient.name,
			quantity: ingredient.quantity
		});

		this.save(cb)
	},
	editIngredient: function(ingredient, cb) {
		console.log('model.editIngredient: ' + this.ingredients.length);
		for (var i = 0; i < this.ingredients.length; ++i) {
			if (this.ingredients[i]._id == ingredient._id) {
				this.ingredients[i].name = ingredient.name;
				this.ingredients[i].quantity = ingredient.quantity;
				break;
			}
		}

		// this.update({_id: this._id}, this.ingredients, cb);

		this.save(cb);
	},
	removeIngredient: function(ingredient, cb) {

		this.save(cb);
	},
	addStep: function(step, cb) {
		console.log(step);
		this.steps.push({
			number: step.number,
			description: step.description
		});

		this.save(cb)
	},
	editStep: function(step, cb) {
		console.log('model.editStep');
		for (var i = 0; i < this.steps.length; ++i) {
			if (this.steps[i]._id == step._id) {
				this.steps[i].name = step.name;
				this.steps[i].description = step.description;
				break;
			}
		}
		this.save(cb);

	},
	removeStep: function(step, cb) {

		this.save(cb);
	},

};


mongoose.model('Recipe', RecipeSchema)