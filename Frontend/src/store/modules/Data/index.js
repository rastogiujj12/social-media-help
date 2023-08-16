import AxiosService from '../../../Services/AxiosService'
import { ToastProgrammatic as Toast } from 'buefy'

const state = {
    videos: [],
    dashboardVideo: null,
    uploadUrl: null
}

const getters = {
    getVideos(state) {
        return state.videos;
    },
    dashboardVideo(state){
        return state.dashboardVideo;
    },
    getUploadUrl(state) {
        let urls = state.uploadUrl; 
        // state.uploadUrl = null;
        return urls;
    }
}


const mutations = {
    setAllVideos(state, videos) {
        state.videos = videos;
    },
    dashboardVideo(state, video){
        state.dashboardVideo = video;
    },
    setUploadUrl(state, url){
        state.uploadUrl = url;
    }
}


const actions = {
    getAllVideos({ commit, rootState: { Auth: { authToken } } }) {
       if(authToken){
            AxiosService.get('/videos').then(({videos})=>{
                // console.log("get all videos called", videos)
                commit("setAllVideos", videos);
            })
       }
    },
    getUploadUrl({commit, dispatch}, payload){
        // console.log("create video", payload)
        return new Promise(async (resolve, reject)=>{
            AxiosService.post('/getUploadUrl', payload).then((data)=>{
                console.log("data", data)
                dispatch('setIsLoading', {value:false})
                if(data.url){
                   commit("setUploadUrl", data.url);
                   
                   return resolve(data);
                }
                else{
                    Toast.open({
                        duration: 5000,
                        message: data.message,
                        type: 'is-danger'
                    })
                }
            })
        })
    },
    getVideoDetails({commit}, slug){
        AxiosService.post(`/videoBySlug`, {slug}).then(({err, video})=>{
            // console.log("video by slug", video)
            if(err){
                Toast.open({
                    duration: 5000,
                    message: err,
                    type: 'is-danger'
                })
            }
            else{
                commit("dashboardVideo", video)
            }
        })
    },
    saveDirectorsCut({commit}, payload){
        // console.log("here");
        AxiosService.post('/directorCuts', payload).then(({err, result})=>{
            if(err){
                Toast.open({
                    duration: 5000,
                    message: err,
                    type: 'is-danger'
                })
            }
            else{
                Toast.open({
                    duration: 5000,
                    message: 'Video Updated Successfully',
                    type: 'is-success'
                })
            }
        })
    },

    // uploadVideos({commit}, {url, file}){
    //     AxiosService.upload(url, file)
    // },
    allFilesUploaded({commit}, id){
        AxiosService.post("/allFilesUploaded", id).then(({err, result})=>{
            if(err){
                Toast.open({
                    duration: 5000,
                    message: err,
                    type: 'is-danger'
                })
            }
            else{
                Toast.open({
                    duration: 5000,
                    message: 'Video Uploaded Successfully',
                    type: 'is-success'
                })
            }
        })
    }

}


export default {
    state,
    getters,
    mutations,
    actions,
}
