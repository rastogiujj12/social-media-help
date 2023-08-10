const keystone = require('../ks');
const Page = keystone.list('Page').model;


const save = async (req, res) =>{
    const { id, title, posts } = req.body;

    // console.log("title", title, "posts", posts)
    let result = null
    if(id){
        await Page.update({_id:id}, {title, posts})
        result = await Page.findOne({_id:id});
    }
    else {
        page = new Page({
            title,
            posts
        })
        result = await page.save()
    }

    res.send({data:result})
}

const getPage = async (req,res) =>{
    let id = req.query.url
    console.log("req", req.query)
    let page = await Page.findOne({_id:id})
    res.send({data:page})
}

module.exports = {
    save,
    getPage
}