<template>
    <div v-if="post" class="post">
        <div class="facebook-post">
            <div class="facebook-heading">
                <img src="@/assets/user-profile.png" />
                <div>
                    <div class="facebook-heading-name">John Doe</div>
                    <div class="facebook-heading-time">19h</div>
                </div>
                <div class="edit-icons" v-if="isLoggedIn">
                    <svg-icon
                        class="action-icon"
                        type="mdi"
                        @click.native="editPost()"
                        :path="editIcon"
                        v-b-tooltip.hover
                        title="Edit"
                    ></svg-icon>
                    <svg-icon
                        class="delete-icon action-icon"
                        type="mdi"
                        @click.native="deletePost()"
                        :path="deleteIcon"
                        v-b-tooltip.hover
                        title="Delete"
                    ></svg-icon>
                </div>
            </div>
            <div class="facebook-body">
                <div v-if="!isEdit" class="facebook-body-text">
                    {{ post.text }}
                    <!-- <svg-icon
                        type="mdi"
                        class="action-icon"
                        @click.native="copyText(post.text)"
                        :path="textCopy"
                        v-b-tooltip.hover
                        title="Copy Text"
                    ></svg-icon> -->
                </div>
                <div v-else class="facebook-body-text facebook-text-default">
                    <b-form-group>
                        <b-form-textarea
                            id="text-input"
                            v-model="post.text"
                            class="form-input-text"
                            placeholder="What's on your mind?"
                            rows="3"
                            :lazy="true"
                            :no-resize="true"
                            required
                        ></b-form-textarea>
                    </b-form-group>
                </div>
                <media-handler :image="post.image" :video="post.video" :isEdit="isEdit" :saveUploadedMedia="uploadMedia"/>
                <!-- <div v-if="post.image" class="facebook-body-image">
                    <img :src="post.image" />
                </div>
                <div v-else-if="post.video" class="facebook-body-image">
                    <video
                        :src="post.video"
                        controls
                        type="video/mp4"
                        playsinline
                    />
                </div>
                <div v-else-if="isNotSaved" class="facebook-body-media">
                    <div class="file-upload">
                        <div v-if="!uploadFile" class="input-dialogue">
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
                        </div>
                        <div v-else class="facebook-body-image">
                            <svg-icon
                                v-if="isLoggedIn"
                                type="mdi"
                                class="file-upload-icon remove-media-icon"
                                @click.native="removeMedia()"
                                :path="removeMediaIcon"
                                v-b-tooltip.hover
                                title="Remove media"
                            ></svg-icon>
                            <img :src="uploadFile" />
                            <b-button variant="success" class="btn btn-block" @click="uploadMedia">Save</b-button>
                        </div>
                        <input
                            type="file"
                            @change="fileUpload"
                            accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                        />
                    </div>
                </div> -->
            </div>
            <div class="facebook-footer-1">
                <div class="facebook-like-number">
                    <img src="@/assets/facebook-like.svg" />
                    <img src="@/assets/facebook-heart.svg" />
                    <div class="facebook-like-count">634</div>
                </div>
                <div class="facebook-comment-number">
                    <div class="facebook-comment-number-container">
                        <div class="facebook-comment-count">201</div>
                        <svg-icon type="mdi" :path="comment"></svg-icon>
                    </div>
                    <div class="facebook-comment-number-container">
                        <div class="facebook-comment-count">23</div>
                        <svg-icon type="mdi" :path="share"></svg-icon>
                    </div>
                </div>
            </div>

            <div class="facebook-footer-2">
                <div class="facebook-footer-2-container">
                    <svg-icon type="mdi" :path="like"></svg-icon>
                    <div class="facebook-footer-2-wrapper">Like</div>
                </div>
                <div class="facebook-footer-2-container">
                    <svg-icon type="mdi" :path="comment"></svg-icon>
                    <div class="facebook-footer-2-wrapper">Comment</div>
                </div>
                <div class="facebook-footer-2-container">
                    <svg-icon type="mdi" :path="share"></svg-icon>
                    <div class="facebook-footer-2-wrapper">Share</div>
                </div>
            </div>
        </div>
        <div class="action-buttons">
            <b-button
                variant="success"
                class="btn primary"
                @click="copyAndDownloadMedia()"
                >Copy Text & Download</b-button
            >
            <b-button
                href="https://facebook.com"
                target="_blank"
                variant="success"
                class="btn facebook-style"
                >Open Facebook</b-button
            >
        </div>
    </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import {
    mdiCommentOutline,
    mdiThumbUpOutline,
    mdiShareOutline,
    mdiDownloadOutline,
    mdiContentCopy,
    mdiPencil,
    mdiTrashCanOutline,
    mdiFilePlus,
    mdiClose
} from "@mdi/js";
import {
    BTooltip,
    VBTooltip,
    BToast,
    BModal,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    BFormTextarea
} from "bootstrap-vue";
import { saveAs } from "file-saver";
import AxiosService from '../../Services/AxiosService';
import MediaHandler from "../MediaHandler/MediaHandler.vue"
export default {
    components: {
        SvgIcon,
        BTooltip,
        BModal,
        BFormGroup,
        BFormInput,
        BForm,
        BButton,
        MediaHandler,
        BFormTextarea
    },
    directives: {
        "b-tooltip": VBTooltip,
    },
    data() {
        return {
            comment: mdiCommentOutline,
            like: mdiThumbUpOutline,
            share: mdiShareOutline,
            mediaDownload: mdiDownloadOutline,
            textCopy: mdiContentCopy,
            editIcon: mdiPencil,
            deleteIcon: mdiTrashCanOutline,
            fileUploadIcon: mdiFilePlus,
            removeMediaIcon:mdiClose,

            text: null,
            image: null,
            video: null,
            uploadFile: null,
            isNotSaved:false,
            file:null,
            isEdit:false
        };
    },
    props: {
        post: Object,
        isLoggedIn: Boolean,
        editPostSelector: Function,
        deletePostSelector: Function,
        sectionIndex: Number,
        postIndex: Number,
        setMedia: Function
    },
    mounted(){
        console.log("post", this.post)
        if(!this.post.text && !this.post.image && !this.post.video) 
            this.isNotSaved = true 


        this.isEdit = this.isLoggedIn;
        // if(this.isLoggedIn && !this.post.image && !this.post.video) this.isEdit = true;
        // else this.isEdit = false;
    },
    methods: {
        copyAndDownloadMedia() {
            this.copyText(this.post.text);
            if (this.post.image) this.downloadURI(this.post.image);
            else this.downloadURI(this.post.video);
        },
        copyText(text) {
            navigator.clipboard.writeText(text);
            this.$bvToast.toast(`Text copied Preparing Media download`, {
                autoHideDelay: 5000,
            });
        },
        downloadURI(uri) {
            this.$store.dispatch("setIsLoading", { value: true });
            setTimeout(
                () => this.$store.dispatch("setIsLoading", { value: false }),
                2000
            );
            let fileName = uri.split("/").pop();
            saveAs(uri, fileName);
        },
        editPost() {
            this.editPostSelector(this.sectionIndex, this.postIndex);
        },
        deletePost() {
            this.deletePostSelector(this.sectionIndex, this.postIndex);
        },
        uploadMedia(image, video){
            console.log("facebook upload media called", image, video)
            this.setMedia(this.sectionIndex, this.postIndex, image, video)
            this.isEdit = false
        }
        // fileUpload(file) {
        //     this.file = file.target.files[0]
        //     this.uploadFile = URL.createObjectURL(file.target.files[0]);
        // },
        // removeMedia(){
        //     this.uploadFile = null;
        // },
        // async uploadMedia(){
        //     this.$store.dispatch('setIsLoading',{value:true})
        //     console.log("file", this.file)
        //     // await this.$store.dispatch("getUploadUrl", {
        //     //     name:this.file.name
        //     // })

        //     AxiosService.post('/getUploadUrl', {name:this.file.name}).then((data)=>{
        //         console.log("data", data)
        //         this.$store.dispatch('setIsLoading',{value:false})
        //         if(data.url){
        //             console.log("url", data.url)
        //             const configUpload = {
        //                 onUploadProgress: function(progressEvent) {
        //                     let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //                     console.log("percentCompleted", percentCompleted)
        //                     // store.dispatch("setView1Progress", percentCompleted);
        //                 }
        //             }

        //             this.axios.put(data.url, this.file, configUpload)
        //         }
        //     })
        // },
       
    },
    computed:{
        url(){
            return this.$store.uploadUrl || null
        }
    },
    watch:{
        url(newVal){
            console.log(">", newVal)
            if(!newVal)
                return;

            const configUpload = {
                onUploadProgress: function(progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    console.log("percentCompleted", percentCompleted)
                    // store.dispatch("setView1Progress", percentCompleted);
                }
            }
            // this.axios.put(newVal, this.file, configUpload)

        }
    }
};
</script>

<style scoped>
.facebook-post {
    /* width: 680px; */
    border-radius: 10px;
    background: white;
}
facebook-post::backdrop {
    background-color: salmon;
}
.facebook-heading {
    display: flex;
    font-family: Arial, Helvetica, sans-serif;
    padding: 12px 16px 0;
    margin: 0 0 12px;
}
.facebook-heading img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
}
.facebook-heading-name {
    font-size: 15px;
    font-weight: 800;
}
.facebook-heading-time {
    font-size: 13px;
}
.facebook-body-text {
    padding: 4px 16px 16px;
    font-size: 15px;
}
.facebook-body-text svg {
    right: 20px;
    position: absolute;
    cursor: pointer;
}
.facebook-body-image svg {
    right: 20px;
    position: absolute;
    cursor: pointer;
}
.facebook-body-image {
    /* max-height: 500px; */
    height: 100%;
    overflow: hidden;
}
.facebook-body img {
    width: 100%;
    /* max-height: 500px; */
}
.facebook-body video {
    width: 100%;
    /* max-height: 500px; */
}
.facebook-footer-1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid #bec3c9 1px;
    margin: 0 16px;
}
.facebook-like-number img {
    width: 18px;
    height: 18px;
}
.facebook-like-number {
    font-size: 15px;
    font-weight: 400;
    display: flex;
    align-items: center;
}
.facebook-like-count {
    padding-left: 4px;
}
.facebook-comment-number {
    display: flex;
    font-size: 15px;
    font-weight: 100;
}
.facebook-comment-count {
    padding: 6px 2px;
}
.facebook-comment-number-container {
    padding: 6px;
    display: flex;
    align-items: center;
}
.facebook-footer-2 {
    /* border-bottom: solid #BEC3C9 1px; */
    margin: 0 16px;
    display: flex;
    justify-content: space-around;
}
.facebook-footer-2-container {
    display: flex;
    align-items: center;
}
.facebook-footer-2-wrapper {
    padding: 6px 4px;
    font-weight: 700;
}
.edit-icons {
    right: 20px;
    position: absolute;
}
.action-icon {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    border: 1px dotted black;
}
.delete-icon {
    color: white;
    background: red;
}
.action-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
}
.facebook-style {
    background: #3b5998;
}
.post {
    margin-bottom: 20px;
}
.facebook-text-default {
    height: 90px;
}
.form-input-text {
    height: 80px;
    border: none;
}
</style>