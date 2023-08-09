var keystone = require('./../ks');
var Types = keystone.Field.Types;
// let FFMEGService = require('../services/ffmpeg')


/**
 * Page Model
 * ==========
 */
var Video = new keystone.List('Video',{
	track:true,
	autokey: { path: 'slug', from: 'name' }
});

Video.add({
    name:{label: 'Project Name',  type: String, required:true, index:true, initial:true},

	view1:       { type: String, initial: true, required: true, hidden: true },
	view2:       { type: String, initial: true, required: true, hidden: true },
	view3:       { type: String, initial: true, required: true, hidden: true },
	view4:       { type: String, initial: true, required: true, hidden: true },
    outputUrl:   { type: Types.Url, required: false },
	thumbnail:   { type: Types.Url, required: false },
    status:      { type: Types.Select, options: 'not_processed, processing, processed, error, deleted' },
    directorCut: { type: Types.Relationship, ref:'DirectorCut', many:true, noedit: true },

	processVideoAgain: { type: Types.Boolean, default:false },

	owner:       { type: Types.Relationship, ref: 'User', index:true }
});


/**
 * Registration
 */
Video.defaultColumns = 'name, owner, status';
Video.register();

Video.model.schema.pre('save', async function(next){
	if(this.processVideoAgain){
		this.processVideoAgain = false;
		const FFMPEG = require('./../services/ffmpeg');
		this.status="processing";
		next();
		FFMPEG.mergeVideos(this._id)
		.then(({fileName})=>{
			//TODO work on this
			console.log("filename", fileName);
			const Video = keystone.list('Video').model;
			Video.findOneAndUpdate({_id:this._id}, {
				status:'processed', 
				outputUrl:`https://final-processed-video.s3-us-west-1.amazonaws.com/${fileName}`, 
				thumbnail:`https://processed-video-thumbnail.s3-us-west-1.amazonaws.com/${this._id}.png`
			}, (err, data)=>{
				console.log("err", err)
			});
		})

	}
	else{
		next();
	}
})

Video.model.schema.pre('remove', async function(next){
	console.log("schema is called", this._doc);
	let video = this._doc;
	const FFMEGService = require('../services/ffmpeg')
	FFMEGService.videoDeleteCleanup(video.thumbnail, video.outputUrl, video.view1, video.view2, video.view3, video.view4, video._id)
	next();

	//thumbnail, outputUrl, view1, view2, view3, view4
	//TODO delete files from s3


})
