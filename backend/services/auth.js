const keystone = require('../ks');
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const User = keystone.list('User').model;


async function signup(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		});
	}
	
	const {
		firstName,
		lastName,
		email,
		password,
		domain, 
		subdomain
	} = req.body;
	try {
		let user = await User.findOne({
			email
		});
		if (user) {
			return res.status(400).json({
				msg: "Email Already Exists"
			});
		}

		user = new User({
			name:{ first: firstName, last: lastName },
			email,
			password,
			subdomain: `${subdomain}.${domain}`
		});

		await user.save();

		const payload = {
			user: {
				id: user.id
			}
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET, {
				expiresIn: 36000
			},
			(err, token) => {
				if (err) throw err;
				// res.cookie('xsrf-token', token, {maxAge: 900000, httpOnly: true});
				res.status(200).json({token, userData:user});
			}
		);
	} catch (err) {
		console.log(err);
		res.status(500).send("Error in Saving");
	}
}

async function login(req, res) {
	const errors = validationResult(req);
	// console.log('err', errors)
	if (!errors.isEmpty()) {
		console.log('inside error')
		return res.status(400).json({
			errors: errors.array()
		});
	}

	const {email, password} = req.body;
	try {
		let user = await User.findOne({
			email
		});
		// console.log(user._.password.compare.toString());
		if (!user){
			return res.status(400).json({
				message: "User Not Exist"
			});
		}		

		// compare password and call userFound if found
		user._.password.compare(password, function (err, isMatch) {
			if (!err && isMatch) {
				const payload = {
					user: {
						id: user.id
					}
				};

				jwt.sign(
					payload,
					process.env.JWT_SECRET,
					{
						expiresIn: 360000
					},
					(err, token) => {
						if (err) throw err;
						// console.log('token', token)
						res.status(200).json({
							token,
							userData:user
						});
					}
				);
			} else {
				return res.status(400).json({
					message: "email or password is incorrect"
				});
			}
		})
	} catch (e) {
		console.log('login error', e);
		res.status(500).json({
			message: "Server Error"
		});
	}
}

async function autoLogin(req, res){
	if(req.user){
		res.status(200).json({login:true});
	}
	else res.status(400).json({login:false});
}

async function getUser(req, res){
	if(req.user){
		let user = await User.findOne({_id:req.user.id});
		res.status(200).json({user:user});
	}
	else res.status(400).json({user:false});
}

module.exports = {
    signup,
    login,
	autoLogin,
	getUser
}