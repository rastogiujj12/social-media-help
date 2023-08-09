const keystone = require('../ks');
// const date = require('../ks/fields/types/date/DateType');
const User = keystone.list('User').model;
const DirectorCut = keystone.list('DirectorCut').model;
const Video = keystone.list('Video').model;
const moment = require('moment')
const _ = require("lodash");

const FFMPEG = require('./ffmpeg');
const { body } = require('express-validator');

const get = async (req, res)=>{
    // console.log("req", req)
    console.log("req.headers.origin", req.headers.origin)
    let domainName = req.headers.origin.split('//')[1] //remove protocol
    domainName = domainName.split(':')[0] //remove port
    domainName = domainName.split('/')[0] //just in case

    // console.log("domainName", domainName)
    
    if(domainName=="localhost"||domainName=="192.168.2.6"||domainName=="127.0.0.1") domainName = "localhost"; //for testing

    //find user with domain name
    const user = await User.findOne({'subdomain':domainName});
    // console.log("user found", user._id)

    if(!user || (user.expiresOn && user.expiresOn<moment())){
        // console.log("hit from domain name", domainName);
        res.status(400).json({message: 'user not found'});
        // return;
    }else{
        //find the video links
        const videos = await Video.findOne({'owner':user._id}).populate('directorCut')
        // console.log("videos", videos);

        if(!videos){
            res.status(400 ).json({message: 'videos not found'});
            // return;
        }
        else{
            let directorCut=[];
            if(videos._doc.directorCut){
                videos._doc.directorCut.forEach(e=>{
                    let temp = {
                        view:e._doc.view,
                        time:e._doc.time
                    }
                    directorCut.push(temp);
                })
                directorCut = _.sortBy(directorCut, ['time']); //sort
                // console.log('sorted', directorCut);
            }

            let response = {
                projectname: videos._doc.name,
                audio: videos._doc.audioUrl,
                video: [
                    videos._doc.view1Url,
                    videos._doc.view2Url,
                    videos._doc.view3Url,
                    videos._doc.view4Url,
                ],
                directorCut
            }
            // console.log("response", response)
            res.status(200).json(response);
        }
    }
}

const getVideo = async (req, res) =>{
    // console.log(req.headers.origin)
    // let domainName = req.headers.origin.split('//')[1] //remove protocol
    // domainName = domainName.split(':')[0] //remove port
    // domainName = domainName.split('/')[0] //just in case

    // console.log("domainName", domainName)
    
    // if(domainName=="localhost"||domainName=="192.168.2.6"||domainName=="127.0.0.1") domainName = "localhost"; //for testing

    // console.log("req", req.params.slug)
    // let user = await User.findOne({'subdomain':domainName}).lean();
    // console.log("user", user);
    // if(!user){
    //     // console.log("hit from domain name", domainName);
    //     res.status(400).json({message: 'user not found'});
    //     // return;
    // }else{
        console.log("slug", req.params.slug)
        let video = await Video.findOne({slug:req.params.slug}).populate('directorCut').lean()
        console.log("video", video)
        if(!video){
            res.status(400).json({error: true, message: 'videos not found'});
            // return;
        }
        else if(video.status!="processed"){
            res.status(400).json({error: true, message: 'videos still processing'});
        }
        else{
            console.log("video found", video);
            let directorCut=[];
            if(video.directorCut){
                video.directorCut.forEach(e=>{
                    let temp = {
                        view:e.view,
                        time:e.time
                    }
                    directorCut.push(temp);
                })
                directorCut = _.sortBy(directorCut, ['time']); //sort
                // console.log('sorted', directorCut);
            }
            // console.log("response", response)
            res.status(200).json({url:video.outputUrl, directorCutArr:directorCut});
        }
    // }

}

const getVideosList = async (req, res) =>{
    let domainName = req.headers.origin.split('//')[1] //remove protocol
    domainName = domainName.split(':')[0] //remove port
    domainName = domainName.split('/')[0] //just in case

    // console.log("domainName", domainName)
    
    if(domainName=="localhost"||domainName=="192.168.2.6"||domainName=="127.0.0.1") domainName = "localhost"; //for testing

    // console.log("req", req.params.slug)
    let user = await User.findOne({'subdomain':domainName}).lean();
    // console.log("user", user);
    if(!user){
        // console.log("hit from domain name", domainName);
        res.status(400).json({message: 'user not found'});
        // return;
    }else{
        let video = await Video.find({owner:user._id}).lean()
        if(!video){
            res.status(400 ).json({message: 'videos not found'});
            // return;
        }
        else{
            let directorCut=[];
            if(video.directorCut){
                video.directorCut.forEach(e=>{
                    let temp = {
                        view:e.view,
                        time:e.time
                    }
                    directorCut.push(temp);
                })
                directorCut = _.sortBy(directorCut, ['time']); //sort
                // console.log('sorted', directorCut);
            }
            let response = [];
            
            Video.forEach((e)=>{
                let temp = {
                    projectname: e.name,
                    slug: e.slug,
                }
                response.push(temp);
            })

            // console.log("response", response)
            res.status(200).json(response);
        }
    }

}

const getBySlug = async (req, res) =>{

    // console.log("get slug", req)

    let video = await Video.findOne({slug:req.body.slug}).populate('directorCut').lean()
    // console.log("Video", Video)
    if(video){
        // if(video.owner==req.user.id){
            video.directorCut.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
            res.status(200).json({video})
        // }
        // else res.status(400).json({err:"Video Not Found"});
    }
    else res.status(400).json({err:"Video Not found"})
}

const videos = async (req, res)=>{
    // console.log("header", req.user);
    let userId = req.user.id;
    let videos = await Video.find({owner:userId}).populate('directorCut').lean();

    res.status(200).json({videos})
}

const getUploadUrls = async(req, res) => {
    let views = [];
    views[0] = req.body.view1,
    views[1] = req.body.view2,
    views[2] = req.body.view3,
    views[3] = req.body.view4

   let video = new Video({
        name:req.body.name,

        view1:views[0],
        view2:views[1],
        view3:views[2],
        view4:views[3],

        // audioUrl:req.body.audioUrl,
        owner: req.user.id,
    })
    console.log("views", views);
    video.status='not_processed';

    await video.save(async function(err, result){
        if(err)
            res.status(400).json({created:false, message:"Some error occured, please check the input or try again"});
        else{
            // console.log("result", result._doc._id);
            let temp = await DirectorCut.create({
                time:0,
                view:4,
                default:true,
            })
            await Video.findOneAndUpdate({_id:result._doc._id}, { $push: { 'directorCut' : temp._doc._id } } );
            
            // let view1Url = FFMPEG.getPreSignedUrl(views[0]);
            // let view1Url = FFMPEG.getPreSignedUrl(views[0]);
            // let view1Url = FFMPEG.getPreSignedUrl(views[0]);
            // let view1Url = FFMPEG.getPreSignedUrl(views[0]);
            Promise.all([
                FFMPEG.getPreSignedUrl(`${result._doc._id}/${views[0]}`), 
                FFMPEG.getPreSignedUrl(`${result._doc._id}/${views[1]}`), 
                FFMPEG.getPreSignedUrl(`${result._doc._id}/${views[2]}`),
                FFMPEG.getPreSignedUrl(`${result._doc._id}/${views[3]}`)
            ])
            .then(signedUrls=>{
                // console.log("result", signedUrls);
                res.status(200).json({urls:signedUrls, id:result._doc._id});
            })
            .catch(error=>{
                console.log("some error", error)
                res.status(400).json({created:false, message:"Some error occured, please check the input or try again"});
            })
        }
    });
}

const directorCuts = async (req, res) => {
    // console.log("director cut", req.body.directorCuts);
    const {slug, directorCuts} = req.body;
    let removeArray=[];

    let video = await Video.findOne({slug}).populate('directorCut').lean();
    let oldDirectorCuts = video.directorCut.map((e)=>{
        e._id = e._id.toString();
        return e;
    })
    let removeFromVideo = _.differenceWith(oldDirectorCuts, directorCuts, _.isEqual) //return values that are in param1, but not in param2
    
    removeFromVideo.forEach(e=>{
        removeArray.push({_id:e._id})
    });

    await Video.findOneAndUpdate({slug}, {$pullAll:{'directorCut':removeArray}});
    await DirectorCut.remove({_id:{$in: removeArray}});

    let addToVideo = _.differenceWith(directorCuts, oldDirectorCuts, _.isEqual);
    let objectIds = [];
    addToVideo.forEach(async e=>{
        let temp = await DirectorCut.create({
            time:e.time,
            view:e.view
        })
        // temp.save();
        // console.log("res",temp._doc._id);
        objectIds.push(temp._doc._id)
        await Video.findOneAndUpdate({slug}, { $push: { 'directorCut' : temp._doc._id } } );
    })
    
    res.status(200).json({result:true});
}

const allFilesUploaded = async (req, res) =>{
    let _id = req.body.id;
// const allFilesUploaded = async (_id) =>{
    console.log("start processing video ", _id);
    Video.findOneAndUpdate({_id:_id}, {status:"processing"});
    await FFMPEG.mergeVideos(_id)
    .then(({fileName})=>{
        //TODO work on this
        console.log("filename", fileName);
        Video.findOneAndUpdate({_id:_id}, {
            status:'processed', 
            outputUrl:`https://final-processed-video.s3-us-west-1.amazonaws.com/${fileName}`, 
            thumbnail:`https://processed-video-thumbnail.s3-us-west-1.amazonaws.com/${_id}.png`
        }, (err, data)=>{
            console.log("err", err, 'data', data)
        });
    })
}

const deleteVideo = async (req, res) =>{
    let _id = req.body._id;
    // console.log("delete request", req.user);
    let video = await Video.findOne({_id, owner:req.user.id})
    if (!video) {
        console.log("error", err);
        res.json({error:"some error occurred, Please refresh the page and try again"});
    } else{
        video.remove();
        res.json({data:"video deleted"});
    }
    
}

// allFilesUploaded('60afb02550fc9b7821e4a9aa');

//  Video.findOneAndUpdate({_id:'60afb02550fc9b7821e4a9aa'}, {
//     status:'processed', 
//     outputUrl:`https://final-processed-video.s3-us-west-1.amazonaws.com/60afb02550fc9b7821e4a9aa.mp4`, 
//     thumbnail:`https://processed-video-thumbnail.s3-us-west-1.amazonaws.com/60afb02550fc9b7821e4a9aa.png`
// }, (err, data)=>{
//     console.log("err", err, 'data', data)
// });

module.exports = {
	get,
    videos,
    getUploadUrls,
    getBySlug,
    directorCuts,
    getVideo,
    getVideosList,
    allFilesUploaded,
    deleteVideo
} 