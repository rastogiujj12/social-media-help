<template>
    <b-container>
        <div v-if="!editTitle" class="header">{{title}}
            <svg-icon
                class="action-icon"
                v-if="!!user"
                type="mdi"
                @click.native="editTitleButton()"
                :path="editIcon"
            ></svg-icon>
        </div>
        <div v-else class="header">
            <b-form-input
                id="title-input"
                v-model="title"
                v-on:keyup.enter="saveTitle"
                required
            ></b-form-input>
        </div>
        <!-- <div v-for="(section, index) in sections" :key="index" class="columns">
            {{ section.type }}
        </div> -->

        <b-row
            v-for="(section, sectionIndex) in sections"
            :key="section.name"
            class="section"
            :class="`section-class-${section.name}`"
        >
            <b-col cols="12" class="section-heading">
                {{ section.name }}
            </b-col>
            <b-col
                v-for="(post, postIndex) in section.posts"
                :key="`${section.name}-${postIndex}`"
                lg="6"
                cols="12"
            >
                <div v-if="section.name == 'Facebook'">
                    <facebook
                        :post="post"
                        :isLoggedIn="!!user"
                        :editPostSelector="editPostSelect"
                        :deletePostSelector="deletePostSelect"
                        :sectionIndex="sectionIndex"
                        :postIndex="postIndex"
                    />
                </div>

                <div v-else-if="section.name == 'Instagram'">
                    <instagram 
                        :post="post" 
                        :isLoggedIn="!!user"
                        :editPostSelector="editPostSelect"
                        :deletePostSelector="deletePostSelect"
                        :sectionIndex="sectionIndex"
                        :postIndex="postIndex" />
                </div>
            </b-col>

            <b-col lg="6" cols="12">
                <div class="empty" @click="addPost(section.name, sectionIndex)">
                    Add Post
                </div>
            </b-col>
        </b-row>

        <b-row v-if="user">
            <b-col md="6" cols="12" class="buttons-row">
                <b-button
                    variant="outline-primary"
                    class="w-100"
                    @click="addSection"
                    >Add Section</b-button
                >
                <!-- class="btn btn-primary w-100" -->
            </b-col>
            <b-col md="6" cols="12" class="buttons-row">
                <b-button
                    variant="success"
                    class="w-100"
                    @click="saveAndShare()"
                    >Save and Share</b-button
                >
                <!-- class="btn btn-primary w-100" -->
            </b-col>
        </b-row>
        <b-row v-if="shareUrl" class="pb-3">
            <b-form-input id="share-url" v-model="shareUrl"></b-form-input>
        </b-row>

        <b-modal id="addPost" title="Add new post">
            <b-form id="addPostForm" @submit.stop.prevent="handleAddPost">
                <b-form-group
                    v-if="postType != 'Instagram'"
                    label="Text"
                    label-for="text-input"
                >
                    <b-form-input
                        id="text-input"
                        v-model="text"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Image url" label-for="image-url-input">
                    <b-form-input
                        id="image-url-input"
                        type="url"
                        v-model="image"
                        :required="
                            postType == 'Instagram' &&
                            !(this.image || this.video)
                        "
                    ></b-form-input>
                </b-form-group>

                <div class="center">--or--</div>

                <b-form-group label="Video url" label-for="video-url-input">
                    <b-form-input
                        id="video-url-input"
                        type="url"
                        v-model="video"
                        :required="
                            postType == 'Instagram' &&
                            !(this.image || this.video)
                        "
                    ></b-form-input>
                </b-form-group>
            </b-form>
            <template #modal-footer="{ cancel }">
                <!-- <b-btn @click="cancel">Cancel</b-btn> -->
                <!-- <b-btn variant="primary" type="submit" form="my-form">OK</b-btn> -->
                <button
                    class="btn btn-danger"
                    @click="cancel"
                    form="addPostForm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="btn btn-primary"
                    form="addPostForm"
                >
                    OK
                </button>
            </template>
        </b-modal>

        <b-modal id="addSection" title="Add section">
            <b-form id="form" @submit.stop.prevent="handleAddSection">
                <b-form-group label="Section type" label-for="section-input">
                    <b-form-select
                        v-model="selectedSection"
                        :options="sectionOptions"
                        disabled-field="isAdded"
                        text-field="name"
                        value-field="id"
                    ></b-form-select>
                </b-form-group>
            </b-form>
            <template #modal-footer="{ cancel }">
                <!-- <b-btn @click="cancel">Cancel</b-btn> -->
                <!-- <b-btn variant="primary" type="submit" form="my-form">OK</b-btn> -->
                <button class="btn btn-danger" @click="cancel" form="form">
                    Cancel
                </button>
                <button type="submit" class="btn btn-primary" form="form">
                    OK
                </button>
            </template>
        </b-modal>

        <b-modal id="editPost" title="Edit post">
            <b-form id="editPostForm" @submit.stop.prevent="editPostSave">
                <b-form-group v-if="postType != 'Instagram'" label="Text" label-for="text-input">
                    <b-form-input
                        id="text-input"
                        v-model="editPost.text"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Image url" label-for="image-url-input">
                    <b-form-input
                        id="image-url-input"
                        type="url"
                        v-model="editPost.image"
                        :required="
                            postType == 'Instagram' &&
                            !(this.editPost.image || this.editPost.video)
                        "
                    ></b-form-input>
                </b-form-group>

                <div class="center">--or--</div>

                <b-form-group label="Video url" label-for="video-url-input">
                    <b-form-input
                        id="video-url-input"
                        type="url"
                        v-model="editPost.video"
                        :required="
                            postType == 'Instagram' &&
                            !(this.editPost.image || this.editPost.video)
                        "
                    ></b-form-input>
                </b-form-group>
            </b-form>
            <template #modal-footer="{ cancel }">
                <button class="btn btn-danger" @click="cancel">Cancel</button>
                <button
                    type="submit"
                    class="btn btn-primary"
                    form="editPostForm"
                >
                    OK
                </button>
            </template>
        </b-modal>
    </b-container>
</template>

<script>
import {
    BContainer,
    BRow,
    BCol,
    BModal,
    BFormGroup,
    BFormInput,
    BForm,
    BFormSelect,
    BButton,
    BToast,
    BvToast,
} from "bootstrap-vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {
    mdiPencil,
} from "@mdi/js";
import Facebook from "../Facebook/Facebook.vue";
import Instagram from "../Instagram/Instagram.vue";
import Axios from "../../Services/AxiosService";
import Swal from 'sweetalert2'

export default {
    components: {
        BContainer,
        BRow,
        BCol,
        BModal,
        BForm,
        BFormGroup,
        BFormInput,
        BFormSelect,
        BButton,
        Facebook,
        Instagram,
        SvgIcon
    },
    // directives:{
    //     "b-toast":VBToast
    // },
    data() {
        return {
            text: "",
            image: "",
            video: "",
            postType: "",
            currSecIndex: "",
            selectedSection: null,
            title:"Episode Title", 
            editTitle:false,

            editIcon: mdiPencil,

            sections: [],
            sectionOptions: [
                {
                    id: 0,
                    name: "Facebook",
                    isAdded: false,
                },
                {
                    id: 1,
                    name: "Instagram",
                    isAdded: false,
                },
            ],
            facebookPosts: {
                text: null,
                image: null,
                video: null,
            },
            instagramPosts: {
                image: null,
                video: null,
            },
            shareUrl: null,
            id: null,

            editSection: null,
            editPost: null,

            editPost:{}
        };
    },
    created() {
        if (this.$route && this.$route.query && this.$route.query.page)
            this.getPageData(this.$route.query.page);
    },
    methods: {
        addPost(section, index) {
            // console.log("section", section);
            this.currSecIndex = index;
            this.postType = section;
            this.formType = "addPostForm";
            this.$bvModal.show("addPost");
        },
        cancel() {
            console.log("cancelled");
        },
        addSection() {
            this.formType = "addSectionForm";
            this.$bvModal.show("addSection");
        },
        handleAddSection() {
            // console.log("here?", this.selectedSection)
            let section = this.sectionOptions[this.selectedSection];
            this.sections.push({
                name: section.name,
                posts: [],
            });
            section.isAdded = true;
            this.selectedSection = null;
            this.$bvModal.hide("addSection");
        },
        handleAddPost() {
            let temp = null;
            if (this.postType == "Facebook") {
                temp = JSON.parse(JSON.stringify(this.facebookPosts));
                temp.text = this.text;
                temp.image = this.image;
                temp.video = this.video;
            } else if (this.postType == "Instagram") {
                temp = JSON.parse(JSON.stringify(this.instagramPosts));
                temp.image = this.image;
                temp.video = this.video;
            }
            this.sections[this.currSecIndex].posts.push(temp);
            this.clearFields();
            this.$bvModal.hide("addPost");
        },
        clearFields() {
            this.text = null;
            this.video = null;
            this.image = null;
            this.formType = null;
            this.postType = null;
            this.currSecIndex = null;
        },
        saveAndShare() {
            Swal.fire({
                title: 'Confirm Save?',
                text: "You won't be able to revert this!",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#14A800',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Save it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$store.dispatch("setIsLoading", { value: true });
                    Axios.post("/savepage", {
                        id: this.id,
                        title: this.title,
                        posts: JSON.stringify(this.sections),
                    }).then(({ data, error }) => {
                        this.$store.dispatch("setIsLoading", { value: false });
                        console.log("data", data);
                        if (data) {
                            this.shareUrl = `${window.location.hostname}/?page=${data._id}`;
                            this.id = data._id;
                            navigator.clipboard.writeText(this.shareUrl);
                            this.$bvToast.toast(`Page saved and share link copied`, {
                                autoHideDelay: 5000,
                                solid: true,
                            });
                            Swal.fire(
                                'Your page has been saved!',
                                'Your page is ready to be shared and the share link has been copied. Share away!',
                                'success'
                            )
                        }
                    });
                }
            })
 
        },
        getPageData(url) {
            this.$store.dispatch("setIsLoading", { value: true });

            Axios.get(`/page?url=${url}`).then(({ data, error }) => {
                this.$store.dispatch("setIsLoading", { value: false });
                if (data) {
                    this.sections = JSON.parse(data.posts);
                } else {
                    this.$bvToast.toast(`Some error occured`, {
                        autoHideDelay: 5000,
                        solid: true,
                    });
                }
            });
        },
        editPostSelect(section, index) {
            // console.log("section", section, "index", index);
            // console.log("post", this.sections[section].posts[index])
            this.postType = this.sections[section].name;
            this.editSection = section;
            this.editPostIndex = index;
            let post = JSON.parse(JSON.stringify(this.sections[section].posts[index]));

            // console.log("edit post", post);
            this.$bvModal.show("editPost");

            this.editPost = post
            // this.text = post.text;
            // this.image = post.image;
            // this.video = post.video;

            // console.log("text", this.text, "image", this.image, "video", this.video)
        },
        editPostSave() {
            // console.log("post");
            this.sections[this.editSection].posts[this.editPostIndex].image =
                this.editPost.image;
            this.sections[this.editSection].posts[this.editPostIndex].text =
                this.editPost.text;
            this.sections[this.editSection].posts[this.editPostIndex].video =
                this.editPost.video;

            this.editSection = null;
            this.editPostIndex=null
            this.editPost = {};

            this.postType = null;


            this.$bvModal.hide("editPost");
        },
        deletePostSelect(section, index){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                    'Deleted!',
                    'Your post has been deleted.',
                    'success'
                    )
                    this.sections[section].posts.splice(index, 1);
                }
            })
        },
        editTitleButton(){
            this.editTitle = true;
        },
        saveTitle(){
            this.editTitle = false;
        }
    },
    watch: {
        video() {
            if(this.value) this.image = null;
        },
        image() {
            if(this.image) this.video = null;
        },
        "editPost.video"(){
            if(this.editPost.video ) this.editPost.image = null;
        },
        "editPost.image"(){
            if(this.editPost.image ) this.editPost.video = null;
        }
    },
    computed: {
        user() {
            return this.$store.getters.userData || false;
        },
    },
};
</script>

<style scoped>
.header {
    text-align: center;
    margin: 20px 0;
    font-size: 30px;
}
.empty {
    min-height: 500px;
    height: calc(100% - 20px);
    border: dotted;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    cursor: pointer;
    margin-bottom: 20px;
}
.section {
    margin-bottom: 20px;
    border-bottom: 2px dotted black;
}
.section-heading {
    margin-bottom: 10px;
    font-size: 30px;
    font-weight: 700px;
}
.center {
    width: 100%;
    text-align: center;
    font-size: 15px;
    color: #aaa;
}
.buttons-row {
    margin-bottom: 20px;
}
.action-icon {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    border: 1px dotted black;
}
</style>