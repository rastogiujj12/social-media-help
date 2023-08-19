<template>
    <b-container>
        <h3>Episode List</h3>

        <b-table
            :items="items"
            :fields="fields"
        >
            <template #cell(actions)="row">
                {{ row }}
                <a href="`/episode?page=${row}`" target="_blank">Open Episode</a>
            </template> 
        </b-table>
    </b-container>
</template>

<script>
import {BContainer, BTable} from "bootstrap-vue";
import AxiosService from '../../Services/AxiosService';
export default {
    components:{
        BContainer, 
        BTable
    },
    data(){
        return{
            items:[],
            fields:[
                {key:"title",  label:"Episode Name"},
                {key:"created_at", label:"Created At"},
                {key:"_id", label:"Actions"}
            ]
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
            AxiosService.get("/episodeList").then((data)=>{
                this.$store.dispatch("setIsLoading", {value:false})
                this.items = data;
            })
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

</style>