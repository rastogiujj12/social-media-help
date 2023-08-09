var keystone = require('./../ks');
var Types = keystone.Field.Types;

/**
 * License Model
 * ==========
 */
var License = new keystone.List('License');

License.add({
	name: { type: String, required: true, initial: true, index: true },
	// type: { type: Types.Select, options: 'FREE, PAID' },
	amount: { type: Types.Money, format: '$0,0.00' },
	activeFor: { type: Types.Number, required:true, initial: true }
});


/**
 * Registration
 */
License.defaultColumns = 'name, amount, activeFor';
License.register();