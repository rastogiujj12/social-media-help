<template>
    <div class="facebook-post">
        <div class="facebook-heading">
            <img src="@/assets/user-profile.png" />
            <div>
                <div class="facebook-heading-name">John Doe</div>
                <div class="facebook-heading-time">19h</div>
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
        <div class="facebook-body">
            <div v-if="post.text" class="facebook-body-text">
                {{ post.text }}
                <svg-icon
                    type="mdi"
                    class="action-icon"
                    @click.native="copyText(post.text)"
                    :path="textCopy"
                    v-b-tooltip.hover
                    title="Copy Text"
                ></svg-icon>
            </div>
            <div v-if="post.image" class="facebook-body-image">
                <img :src="post.image" />
                <svg-icon
                    type="mdi"
                    class="action-icon"
                    :path="mediaDownload"
                    v-b-tooltip.hover
                    @click.native="downloadURI(post.image)"
                    title="Download Image"
                ></svg-icon>
            </div>
            <div v-else-if="post.video" class="facebook-body-image">
                <video :src="post.video" controls type="video/mp4" />
                <svg-icon
                    type="mdi"
                    class="action-icon"
                    :path="mediaDownload"
                    v-b-tooltip.hover
                    @click.native="downloadURI(post.video)"
                    title="Download Video"
                ></svg-icon>
            </div>
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
    mdiTrashCanOutline
} from "@mdi/js";
import { 
    BTooltip,
    VBTooltip,
    BToast,
    BModal,
    BFormGroup,
    BFormInput,
    BForm
} from "bootstrap-vue";
import { saveAs } from "file-saver";
export default {
    components: {
        SvgIcon,
        BTooltip,
        BModal,
        BFormGroup,
        BFormInput,
        BForm
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
            deleteIcon:mdiTrashCanOutline,
            text: null,
            image: null,
            video: null,
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
    methods: {
        copyText(text) {
            navigator.clipboard.writeText(text);
            this.$bvToast.toast(`Text copied`, {
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

            if (!this.isLoggedIn) {
                let route = this.$router.resolve("/facebook");
                window.open(route.href, "_blank");
            }
        },
        editPost() {
            this.editPostSelector(this.sectionIndex, this.postIndex)
        },
        deletePost(){
            this.deletePostSelector(this.sectionIndex, this.postIndex)
        }
    },
};
</script>

<style scoped>
.facebook-post {
    /* width: 680px; */
    border-radius: 10px;
    background: white;
    margin-bottom: 20px;
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
    max-height: 500px;
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
.delete-icon{
    color: white;
    background: red;
}
</style>