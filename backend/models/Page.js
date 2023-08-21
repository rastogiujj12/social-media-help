var keystone = require('./../ks');
var Types = keystone.Field.Types;

/**
 * Page Model
 * ==========
 */
var Page = new keystone.List('Page',{
    track:true
});

Page.add({
	title: { type: String, required: true, index: true, initial:true },
	posts: { type: String },
	author: { type:Types.Relationship, ref:"User", many:false }
});


/**
 * Registration
 */
Page.defaultColumns = 'title';
Page.register();

// Page.model.schema.pre('save', async function(next){
// 	console.log("this.liscense", this.license)
// 	let liscense = await licenses.findOne({_id:this.license});
// 	console.log("liscense",liscense );
// 	if(liscense && liscense._doc.activeFor) this.expiresOn = moment().add(liscense._doc.activeFor, 'days') 


// 	next();
// })