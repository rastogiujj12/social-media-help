var keystone = require('./../ks');
var Types = keystone.Field.Types;

/**
 * Payment Model
 * ==========
 */
var Payment = new keystone.List('Payment',{
	nocreate:true
});

Payment.add({
	user:{ type: Types.Relationship, ref: 'User', required: true, initial: true, index: true },
	timestamp: { type: Types.Datetime, default: Date.now},
	amount: { type: Types.Money, format: '$0,0.00'}
});


/**
 * Registration
 */
Payment.defaultColumns = 'user, timestamp, amount';
Payment.register();