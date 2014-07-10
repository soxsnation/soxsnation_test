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
	// user: {
	// 	type: String,
	// 	default: 'Andrew',
	// 	trim: true
	// },
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
	removeIngredient: function(ingredient, cb) {

		this.save(cb);
	},
	addStep: function(step, cb) {

		this.steps.push({
			number: step.number,
			description: step.description
		});

		this.save(cb)
	},
	removeStep: function(step, cb) {

		this.save(cb);
	},

};


mongoose.model('Recipe', RecipeSchema)