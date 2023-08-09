const keystone = require('../ks');
const Page = keystone.list('Page').model;


const save = async (req, res) =>{
    const { id, title, posts } = req.body;

    // console.log("title", title, "posts", posts)
    let page = {}
    if(id){
        page = page.findOne({_id:id})
        page.title = title
        page.posts = posts
    }
    else {
        page = new Page({
            title,
            posts
        })
    }

    let result = await page.save()
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