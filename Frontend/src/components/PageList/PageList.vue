<template>
    <b-container>
        <h3>Episode Lisst</h3>

        <b-table
            :items="items"
            :fields="fields"
        >
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
    </b-container>
</template>

<script>
import {BContainer, BTable, BButton } from "bootstrap-vue";
import AxiosService from '../../Services/AxiosService';
export default {
    components:{
        BContainer, 
        BTable,
        BButton
    },
    data(){
        return{
            items:[],
            fields:[
                {key:"title",  label:"Episode Name"},
                {key:"createdAt", label:"Created At"},
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
            AxiosService.get("/episodeList").then(({data})=>{
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