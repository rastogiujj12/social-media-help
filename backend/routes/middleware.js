/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('./../ks');
const jwt = require("jsonwebtoken");
const User = keystone.list('User').model;


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


//check if user is logged in
exports.isLoggedIn = function(req, res, next) {
	const token = req.header("Authorization");
	// console.log('header', req.header("Authorization"));
	if (!token) return res.json({
		error:"Token expired"
	})
  
	try {
	  const decoded = jwt.verify(token, process.env.JWT_SECRET, async (err, decoded)=>{
		//   console.log(decoded);
		if(err){
			console.log('err', err)
			return res.json({authError: true, message: 'Failed to authenticate token'});
		}
		else{
			let user = await User.findOne({_id:decoded.user.id});
			if(user)
			{
				req.user = decoded.user;
				next();
			}
			else{
				// console.log('error', user)
				return res.json({authError: true, message: 'Account Not Found'});
			}
		}		
	  });
	} catch (e) {
	  console.error(e);
	  return res.json({
		error:"Token expired"
	  })
	}
};