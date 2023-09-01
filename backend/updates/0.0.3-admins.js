var keystone = require('../ks');
var async = require('async');
var Page = keystone.list('Page').model;
var User = keystone.list('User').model;


const addEpisodeAuthor = async () =>{
    let user = await User.findOne({}).lean();

    console.log("user", user)
	let res = await Page.updateMany({},{author:user._id})
    console.log("res", res)
}

exports = module.exports = async function (done) {
	await addEpisodeAuthor()
    done()
};