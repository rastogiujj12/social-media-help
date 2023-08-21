<template>
    <div>
        <div v-if="!isEdit">
            <div v-if="image" class="facebook-body-image">
                <img :src="image" />
            </div>
            <div v-else-if="video" class="facebook-body-image">
                <video
                    :src="video"
                    controls
                    type="video/mp4"
                    playsinline
                />
            </div>
        </div>
        <div v-else class="facebook-body-media">
            <div class="file-upload">
                <div v-if="!uploadImage && !uploadVideo" class="input-dialogue">
                    <div>
                        <svg-icon
                            type="mdi"
                            class="file-upload-icon"
                            :path="fileUploadIcon"
                        ></svg-icon>
                    </div>
                    <div class="file-upload-heading">
                        Add photos or videos
                    </div>
                    <div class="file-upload-subheading">
                        or drag and drop
                    </div>
                    <!-- <span>{{view1 && view1.name || "View 1"}}</span> -->
                </div>
                <div v-else class="facebook-body-image">
                    <svg-icon
                        v-if="isEdit"
                        type="mdi"
                        class="file-upload-icon remove-media-icon"
                        @click.native="removeMedia()"
                        :path="removeMediaIcon"
                        v-b-tooltip.hover
                        title="Remove media"
                    ></svg-icon>
                    <img v-if="uploadImage" :src="uploadImage" />
                    <video
                        v-if="uploadVideo"
                        :src="uploadVideo"
                        controls
                        type="video/mp4"
                        playsinline
                    />
                    <!-- <b-button v-if="file" variant="success" class="btn btn-block" @click="uploadMedia">Upload Media</b-button> -->
                </div>
                <input
                    v-if="!uploadImage && !uploadVideo"
                    type="file"
                    @change="fileUpload"
                    accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                />
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import {
    mdiFilePlus,
    mdiClose,
} from "@mdi/js";
import AxiosService from '../../Services/AxiosService';
import {     
    BTooltip,
    VBTooltip,
    BButton 
} from "bootstrap-vue";
export default {
    components: {
        SvgIcon,
        BTooltip,
        BButton
    },
    directives: {
        "b-tooltip": VBTooltip,
    },
    data() {
        return {
            uploadVideo:null,
            uploadImage:null,
            file:null,

            fileUploadIcon: mdiFilePlus,
            removeMediaIcon:mdiClose,
        }
    },
    props:{
        image:String,
        video:String,
        isEdit:Boolean,
        saveUploadedMedia:Function
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            // console.log("isEdit", this.isEdit, "image", this.image, "video", this.video)
            if(this.isEdit && (this.image || this.video)){
                if(this.image) this.uploadImage = this.image
                else this.uploadVideo = this.video
            }
        },
        fileUpload(file) {
            this.file = file.target.files[0]
            if(this.file.type.includes("image")) this.uploadImage = URL.createObjectURL(file.target.files[0]);
            else this.uploadVideo = URL.createObjectURL(file.target.files[0]);
            
            // this.uploadFile = URL.createObjectURL(file.target.files[0]);
        },
        removeMedia(){
            // this.uploadFile = null;
            this.uploadImage = null
            this.uploadVideo = null
            this.saveUploadedMedia(null, null)
        },
        async uploadMedia(){
            this.$store.dispatch('setIsLoading',{value:true})
            // console.log("file", this.file)
            // await this.$store.dispatch("getUploadUrl", {
            //     name:this.file.name
            // })

            AxiosService.post('/getUploadUrl', {name:this.file.name}).then((data)=>{
                // console.log("data", data)
                if(data.url){
                    // console.log("url", data.url)
                    const configUpload = {
                        onUploadProgress: function(progressEvent) {
                            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            console.log("percentCompleted", percentCompleted)
                            // store.dispatch("setView1Progress", percentCompleted);
                        }
                    }

                    Promise.all(
                        [this.axios.put(data.url, this.file, configUpload)]
                    ).then(result=>{
                        // console.log("promise completed")
                        this.$store.dispatch('setIsLoading',{value:false})
                        let image = null
                        let video = null
                        if(this.file.type.includes("image")) image = data.url.split("?")[0]
                        else video = data.url.split("?")[0]

                        // console.log("media", image, video)

                        this.saveUploadedMedia(image, video)
                    })
                }
            })
        },
    },
    watch:{
        isEdit(){
            this.init()
        },
        file(newVal){
            if(!newVal) return
            this.uploadMedia()
        }
    }


}
</script>

<style scoped>
img {
    width: 100%;
    height: 100%;
}
video{
    width: 100%;
    height: 100%;
}
.facebook-body-media {
    min-height: 300px;
}
.file-upload {
    border: 1px #ced0d4 solid;
    height: 100%;
    min-height:300px;
    margin: 10px 15px;
    border-radius: 5px;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
}
.file-upload input {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    cursor: pointer;
}
.file-upload .input-dialogue {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
}
.file-upload-heading {
    font-size: 17px;
    font-weight: 600;
}
.file-upload-icon {
    background: #d8dadf;
    padding: 5px;
    height: 34px;
    width: 34px;
    border-radius: 50%;
}

.remove-media-icon{
    right:0 !important;
    z-index: 10;
}
.btn{
    position: relative;
    z-index: 10;
}
.file-upload .btn{
    position: absolute;
    bottom: 0;
}
.facebook-body-image svg {
    right: 0;
    position: absolute;
    cursor: pointer;
}
</style>