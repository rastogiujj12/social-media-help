<template>
    <div class="post">
        <div class="instagram-post">
            <div class="instagram-heading">
                <img src="@/assets/user-profile.png" />
                <div>
                    <div class="instagram-heading-name">John Doe</div>
                    <div class="instagram-heading-location">Universal Studios</div>
                </div>
                <div class="edit-icons">
                    <svg-icon
                        class="action-icon"
                        v-if="isLoggedIn"
                        type="mdi"
                        @click.native="editPost()"
                        :path="editIcon"
                        v-b-tooltip.hover
                        title="Edit"
                    ></svg-icon>
                    <svg-icon
                        class="delete-icon action-icon"
                        v-if="isLoggedIn"
                        type="mdi"
                        @click.native="deletePost()"
                        :path="deleteIcon"
                        v-b-tooltip.hover
                        title="Delete"
                    ></svg-icon>
                </div>
            </div>
            <div class="instagram-body">
                <div v-if="post.image" class="instagram-body-image">
                    <img :src="post.image" />
                    <!-- <svg-icon
                        type="mdi"
                        class="action-icon"
                        :path="mediaDownload"
                        v-b-tooltip.hover
                        @click.native="downloadURI(post.image)"
                        title="Download Image"
                    ></svg-icon> -->
                </div>
                <div v-else-if="post.video" class="instagram-body-image">
                    <video :src="post.video" controls type="video/mp4" playsinline/>
                    <!-- <svg-icon
                        type="mdi"
                        class="action-icon"
                        :path="mediaDownload"
                        v-b-tooltip.hover
                        @click.native="downloadURI(post.video)"
                        title="Download Video"
                    ></svg-icon> -->
                </div>
            </div>

            <div class="instagram-footer">
                <div class="footer-left">
                    <div class="instagram-footer-container">
                        <svg
                            aria-label="Like"
                            class="x1lliihq x1n2onr6"
                            color="rgb(38, 38, 38)"
                            fill="rgb(38, 38, 38)"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <title>Like</title>
                            <path
                                d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
                            ></path>
                        </svg>
                    </div>
                    <div class="instagram-footer-container">
                        <svg
                            aria-label="Comment"
                            class="x1lliihq x1n2onr6"
                            color="rgb(0, 0, 0)"
                            fill="rgb(0, 0, 0)"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <title>Comment</title>
                            <path
                                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                fill="none"
                                stroke="currentColor"
                                stroke-linejoin="round"
                                stroke-width="2"
                            ></path>
                        </svg>
                    </div>
                    <div class="instagram-footer-container">
                        <svg
                            aria-label="Share Post"
                            class="x1lliihq x1n2onr6"
                            color="rgb(0, 0, 0)"
                            fill="rgb(0, 0, 0)"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <title>Share Post</title>
                            <line
                                fill="none"
                                stroke="currentColor"
                                stroke-linejoin="round"
                                stroke-width="2"
                                x1="22"
                                x2="9.218"
                                y1="3"
                                y2="10.083"
                            ></line>
                            <polygon
                                fill="none"
                                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                                stroke="currentColor"
                                stroke-linejoin="round"
                                stroke-width="2"
                            ></polygon>
                        </svg>
                    </div>
                </div>
                <div class="footer-right">
                    <svg
                        aria-label="Save"
                        class="x1lliihq x1n2onr6"
                        color="rgb(0, 0, 0)"
                        fill="rgb(0, 0, 0)"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <title>Save</title>
                        <polygon
                            fill="none"
                            points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                        ></polygon>
                    </svg>
                </div>
            </div>
            <div class="instagram-post-like-count">1,523 likes</div>
            <div  class="instagram-text-container">
                <span>
                    <span class="instagram-post-like-count">John Doe</span>
                    {{ post.text }}</span>
                <!-- <svg-icon
                    type="mdi"
                    class="action-icon text-copy"
                    @click.native="copyText(post.text)"
                    :path="textCopy"
                    v-b-tooltip.hover
                    title="Copy Text"
                ></svg-icon> -->
            </div>
        </div>
        <div class="action-buttons">
            <b-button variant="success" class="btn primary" @click="copyAndDownloadMedia()">Copy Text & Download</b-button>
            <b-button href="https://instagram.com" target="_blank" variant="success" class="btn instagram-style">Open Instagram</b-button>
        </div>
    </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import {
    mdiDownloadOutline,
    mdiPencil,
    mdiTrashCanOutline,
    mdiContentCopy
} from "@mdi/js";
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
            mediaDownload: mdiDownloadOutline,
            editIcon: mdiPencil,
            deleteIcon:mdiTrashCanOutline,
            textCopy: mdiContentCopy,
        };
    },
    props: {
        post: Object,
        isLoggedIn: Boolean,
        editPostSelector: Function,
        deletePostSelector: Function, 
        sectionIndex: Number,
        postIndex: Number
    },
    methods:{
        copyAndDownloadMedia(){
            this.copyText(this.post.text)
            if(this.post.image) this.downloadURI(this.post.image)
            else this.downloadURI(this.post.video)
        },
        copyText(text) {
            navigator.clipboard.writeText(text);
            this.$bvToast.toast(`Text copied Preparing Media download`, {
                autoHideDelay: 5000,
            });
        },
        downloadURI(uri) {
            this.$store.dispatch('setIsLoading',{value:true})
            setTimeout(()=>this.$store.dispatch('setIsLoading',{value:false}), 2000)
                let fileName = uri.split("/").pop()
            saveAs(uri, fileName)
        },
        editPost(){
            this.editPostSelector(this.sectionIndex, this.postIndex)
        },
        deletePost(){
            this.deletePostSelector(this.sectionIndex, this.postIndex)
        }
    }
};
</script>

<style scoped>
.instagram-post {
    /* width: 680px; */
    border-radius: 10px;
    background: white;
    line-height: 18px;
}
.instagram-heading {
    display: flex;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
    padding: 12px 16px 0;
    margin: 0 0 12px;
}
.instagram-heading img {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    margin-right: 10px;
}
.instagram-heading-name {
    font-size: 14px;
    font-weight: 800;
}
.instagram-heading-location {
    font-size: 12px;
}
.instagram-body-text {
    padding: 4px 16px 16px;
    font-size: 15px;
}

.instagram-body-image {
    /* max-height: 500px; */
    overflow: hidden;
}
.instagram-body img {
    width: 100%;
    /* max-height: 500px; */
}
.instagram-body video {
    width: 100%;
}
.instagram-footer {
    /* border-bottom: solid #BEC3C9 1px; */
    /* margin: 0 16px; */
    display: flex;
    justify-content: space-between;
}
.instagram-footer-container {
    /* display: flex;
        align-items: center; */
    padding: 8px 16px 8px 0;
}
.footer-left {
    display: flex;
}
.footer-right {
    padding-top: 8px;
}
.instagram-post-like-count {
    font-weight: 800;
}
.edit-icons {
    right:20px;
    position: absolute
}
.action-icon{
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    border: 1px dotted black;
}
.instagram-body-image svg {
    right: 20px;
    position: absolute;
    cursor: pointer;
}
.delete-icon{
    color: white;
    background: red;
}
.instagram-text-container{
    position: relative;
}
.text-copy{
    position: absolute;
    right: 0;
    top: -10px;
}
.action-buttons{
    margin-top:20px;
    display:flex;
    justify-content: space-evenly;
}
.instagram-style{
    background:radial-gradient(ellipse at 30% 147%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
}
.post{
    margin-bottom: 20px;
}
</style>