const keystone = require('../ks');
const Page = keystone.list('Page').model;

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: 'us-west-1', 
});

const bucket = process.env.S3_BUCKET

const getPreSignedUrl = async (key) =>{
    console.log("key", key)
    return new Promise( async(resolve, reject)=>{
        let url = await s3.getSignedUrl('putObject', {
            Bucket: bucket,
            Key: `${key}-collabkey-${Date.now()}`,
            Expires: 60 * 60,
        });

        // ResponseContentDisposition: 'attachment; filename ="' + key + '"' 

        // console.log("url", url)
        // url = url.replace(/%2F/g, "/")
        // console.log("url",url);
        return resolve(url)
    })
}
const getUploadUrl = async(req, res) => {
    let url = await getPreSignedUrl(req.body.name)
    res.send({url})
}

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
            posts,
            author:req.user.id
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

const getEpisodes = async(req, res) =>{

    console.log("get Episodes")

    let epiosdeList = await Page.find({author:req.user.id}, {title:1, createdAt:1}).sort({createdAt:-1}).lean();
    console.log("episodeList", epiosdeList)
    res.send({data:epiosdeList});
}

module.exports = {
    save,
    getPage,
    getPreSignedUrl,
    getUploadUrl,
    getEpisodes
}