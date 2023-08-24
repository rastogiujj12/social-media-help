<template>
    <div class="collab-history">
        <h3>Collab History</h3>

        <b-table
            :items="items"
            :fields="fields"
        >
            <template v-slot:cell(createdAt)="row">
                {{moment(row.value).format("LL")}}
            </template> 
            <template v-slot:cell(_id)="row">
                <a class="btn btn-primary" :href="`/episode?page=${row.value}`" target="_blank"> Open Episode</a>
            </template> 

            <template #row-details="row">
                <b-card>
                <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                </ul>
                </b-card>
            </template>

        </b-table>
        <div 
            class="add-episode" 
            v-b-tooltip.hover
            title="Add Episode"
            @click="addPost()"
        >
            <svg-icon
                class="action-icon"
                type="mdi"
                :path="addIcon"
            ></svg-icon>
        </div>
    </div>
</template>

<script>
import {BContainer, BTable, BButton, BTooltip, VBTooltip, } from "bootstrap-vue";
import AxiosService from '../../Services/AxiosService';
import SvgIcon from "@jamescoyle/vue-icon";
import {
    mdiPlus
} from "@mdi/js";
export default {
    components:{
        BContainer, 
        BTable,
        BButton,
        SvgIcon,
        BTooltip
    },
    directives: {
        "b-tooltip": VBTooltip,
    },
    data(){
        return{
            items:[],
            fields:[
                {key:"title",  label:"Episode Name"},
                {key:"createdAt", label:"Created At"},
                {key:"_id", label:"Actions"}
            ],
            addIcon: mdiPlus
        }
    },
    created(){
        if (this.$route && this.$route.query && this.$route.query.page)
        this.$router.replace(`/episode?page=${this.$route.query.page}`)
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            this.$store.dispatch("setIsLoading", {value:true})
            AxiosService.get("/episodeList").then(({data})=>{
                this.$store.dispatch("setIsLoading", {value:false})
                this.items = data;
            })
        },
        addPost(){
            this.$router.push("/episode")
        }
    },
    computed: {
        user() {
            return this.$store.getters.userData || false;
        },
    },
    watch:{
        user(newVal){
            if(newVal) this.init();
        }
    }
}
</script>

<style scoped>
.collab-history{
    height:100vh;
}
.add-episode{
    position: fixed;
    right: 50px;
    bottom: 50px;
    border-radius: 50%;
    background: #007bff;
    color: white;
    padding: 10px;
    cursor: pointer;
}
h3{
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid black;
}
</style>