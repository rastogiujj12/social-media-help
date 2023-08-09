var keystone = require('./../ks');
var Types = keystone.Field.Types;
let licenses = keystone.list('License').model;
const moment = require('moment');

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	// subdomain: { type: String }, 
	password: { type: Types.Password, initial: true, required: true },
	// license: {type: Types.Relationship, ref:'License', default: 'FREE'},
	//to check when it expires
	// expiresOn: {type: Types.Date, noedit:true}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();

// User.model.schema.pre('save', async function(next){
// 	console.log("this.liscense", this.license)
// 	let liscense = await licenses.findOne({_id:this.license});
// 	console.log("liscense",liscense );
// 	if(liscense && liscense._doc.activeFor) this.expiresOn = moment().add(liscense._doc.activeFor, 'days') 


// 	next();
// })