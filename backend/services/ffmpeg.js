var ffmpeg = require('fluent-ffmpeg');
const keystone = require('../ks');
const Video = keystone.list('Video').model;

const AWS = require('aws-sdk');
const fs = require('fs')
const util = require('util');
const writeFile = util.promisify(fs.writeFile)

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: 'us-west-1',
    
});
const uploadedBucket  = process.env.S3_UPLOADED_BUCKET;
const finalBucket     = process.env.S3_FINAL_BUCKET;
const thumbnailBucket = process.env.S3_THUMBNAIL_BUCKET
// console.log("finalBucket", finalBucket);

const getPreSignedUrl = async (key) =>{
    console.log("key", key)
    return new Promise( async(resolve, reject)=>{
        let url = await s3.getSignedUrl('putObject', {
            Bucket: uploadedBucket,
            Key: key,
            Expires: 60 * 60
        });
        // console.log("url", url)
        // url = url.replace(/%2F/g, "/")
        // console.log("url",url);
        return resolve(url)
    })
}

const mergeVideos = async (id) => {
    return new Promise( async(resolve, reject)=>{
        let video = await Video.findOne({_id:id}).lean();

        //downloadVideos to local machine. May have to move this function to another machine to save cost.
        
        await Promise.all([
            downloadVideo(`${id}/${video.view1}`, uploadedBucket, `./inputVideos/${video.view1}`),
            downloadVideo(`${id}/${video.view2}`, uploadedBucket, `./inputVideos/${video.view2}`),
            downloadVideo(`${id}/${video.view3}`, uploadedBucket, `./inputVideos/${video.view3}`),
            downloadVideo(`${id}/${video.view4}`, uploadedBucket, `./inputVideos/${video.view4}`)
        ])
        .catch(error => {
            console.error(error)
            return;
            //TODO show the error occured in Keystone and frontend 
        });

        // Video.findOneAndUpdate({_id:id, status:'downloaded'})
        console.log("all videos downloaded")
        await mergeVideosTosingle(video.view1,video.view2,video.view3,video.view4, id)
        .catch(error=>{
            console.error(error)
            return;
        })
        await createThumbnail(video.view4, id)
        .catch(error=>{
            console.error(error)
            return;
        })
        console.log("videos merged and upload started")
        await uploadOutputToS3(id, video.view1.split('.').pop())
        .catch(error=>{
            console.error(error)
            return;
        })
        await uploadThumbnailToS3(`${id}`)
        .catch(error=>{
            console.error(error)
            return;
        })
        .then(value=>{
            console.log("processing done")
            fs.unlink(`./inputVideos/${video.view1}`, ()=>console.log(`${video.view1} deleted`))
            fs.unlink(`./inputVideos/${video.view2}`, ()=>console.log(`${video.view2} deleted`))
            fs.unlink(`./inputVideos/${video.view3}`, ()=>console.log(`${video.view3} deleted`))
            fs.unlink(`./inputVideos/${video.view4}`, ()=>console.log(`${video.view4} deleted`))
            fs.unlink(`./thumbnails/${id}.png`, ()=>console.log('Thumbnail deleted'))
            fs.unlink(`./outputVideos/${id}.${video.view1.split('.').pop()}`, ()=>console.log(`output deleted`)) //video.view1.split('.').pop() to get file extension

            resolve({fileName:`${id}.${video.view1.split('.').pop()}`})
        })
    })

}

const downloadVideo = async (key, bucket, writePath) => {
    return new Promise(async (resolve, reject)=>{
        const params = {
            Bucket: bucket, 
            Key: key
        };
        console.log("writing file", params)
        s3.getObject(params).promise()
        .then((data)=>{
            console.log("data", data);
            writeFile(writePath, data.Body)
            console.log("write file successful")
            return resolve()
        }).catch((err)=>{
            console.log("err", err);
            return reject(err);
        })
    })
}

const mergeVideosTosingle = async (input1, input2, input3, input4, output) =>{
    return new Promise(async (resolve, reject)=>{
        console.log("merging");

        ffmpeg()
        .input(`./inputVideos/${input1}`)
        .input(`./inputVideos/${input2}`)
        .input(`./inputVideos/${input3}`)
        .input(`./inputVideos/${input4}`)
        .complexFilter([
            "[0:v][1:v]hstack[top]",
            "[2:v][3:v]hstack[bottom]",
            "[top][bottom]vstack,format=yuv420p[v]",
            "[0:a][1:a][2:a][3:a]amerge=inputs=4[a]"
        ])
        .output(`./outputVideos/${output}.${input1.split('.').pop()}`)
        .outputOptions([
            '-map [v]',
            '-map [a]'
        ])
        .on("error",function(er){
            console.log("error occured: "+er.message);
            return reject(er.message)
        })
        .on("end",function(){
            console.log("videos merged");
            return resolve()
        })
        .run();
    })
}
const createThumbnail = async (input, output) =>{
    return new Promise( async (resolve, reject)=>{
        ffmpeg()
        .input(`./inputVideos/${input}`)
        .takeScreenshots({ timemarks: [ '00:00:02.000' ], filename:`${output}.png`, size: '256x144'}, './thumbnails')
        
        .on('end', function(err, filenames) {
            // console.log(filenames);
            console.log('screenshots were saved');
            return resolve()
        });
        
        // .output(`./thumbnails/${output}.png`)
        // .seek('0:05')
        // .on("error",function(er){
        //     console.log("error occured: "+er.message);
        //     return reject(er.message)
        // })
        // .on("end",function(){
        //     console.log("thumbnail created");
        //     return resolve()
        // })
        // .run()
    })
    
    
}

const uploadOutputToS3 = async (output, extension) => {
    return new Promise(async (resolve, reject)=>{
        fs.readFile(`./outputVideos/${output}.${extension}`, function (err, data) {
            if (err) { throw err; }
            
            let params = {
                Bucket:finalBucket, 
                Key:`${output}.${extension}`,
                Body: data,
                ContentType: `video/${extension}`
            }

            s3.upload(params, function(err, data) {
                console.log(err, data);
                
                if(!err) {
                    //TODO delete input and output videos
                    return resolve()
                }
                else return reject()
            });
        })
    })
}

const uploadThumbnailToS3 = async (output) => {
    return new Promise(async (resolve, reject)=>{
        fs.readFile(`./thumbnails/${output}.png`, function (err, data) {
            if (err) { throw err; }
            
            let params = {
                Bucket:thumbnailBucket, 
                Key:`${output}.png`,
                Body: data,
                ContentType: 'image/png'
            }

            s3.upload(params, function(err, data) {
                console.log(err, data);
                
                if(!err) {
                    //TODO delete input and output videos
                    return resolve()
                }
                else return reject()
            });
        })
    })
}

const deleteFromS3 = async(fileName, bucketName) => {
    console.log("delete from s3", fileName, bucketName)
    s3.deleteObject({ Bucket: bucketName, Key: fileName }, function(err, data) {
        if (err) {
         console.log("error for",fileName, err);
        }
    })
}

const videoDeleteCleanup = async(thumbnail, outputUrl, view1, view2, view3, view4, id) =>{
    console.log("delete from ffmpeg called")
    await deleteFromS3(thumbnail.split('/').pop(), thumbnailBucket);
    await deleteFromS3(outputUrl.split('/').pop(), finalBucket);

    await deleteFromS3(`${id}/${view1}`, uploadedBucket);
    await deleteFromS3(`${id}/${view2}`, uploadedBucket);
    await deleteFromS3(`${id}/${view3}`, uploadedBucket);
    await deleteFromS3(`${id}/${view4}`, uploadedBucket);
    
    await deleteFromS3(`${id}`, uploadedBucket);
}

// mergeVideosTosingle('raven-try-left-no sound.mp4', 'raven-try-main-no sound.mp4', 'raven-try-right-no sound.mp4', 'raven-try-top-no sound.mp4', '60afa529a6eaec55adab4ce0')
// createThumbnail('file_example_MP4_480_1_5MG.mp4','60afa529a6eaec55adab4ce0' )
module.exports = {
    getPreSignedUrl,
    mergeVideos,
    videoDeleteCleanup
}