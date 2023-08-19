<template>
  <b-overlay :show="isLoading">
    <div id="app" class="container">
      <router-view/>
      <!-- <b-toast? id="my-toast" variant="warning" solid/> -->
      <profile v-if="showHeader"/>
    </div>
  </b-overlay>
</template>

<script>
// import Header from './components/Header/Header'; 
import { BOverlay, BToast } from "bootstrap-vue"
import Profile from "../src/components/Auth/LogIn.vue"
export default {
  components:{
    Profile,
    BOverlay,
    BToast
  },
  data(){
    return {
      showHeader:true
    }
  },
  name: 'App',
  created() {
    // Check for token in LocalStorage 
    this.$store.dispatch('autoLogin')
    this.$store.dispatch('setIsLoading',{value:false})
    this.showHeader = this.$route.path!="/signup" && this.$route.path!="/login"
  },
  computed:{
    isLoading(){
      // console.log('isLoading changed',this.$store.getters.isLoading);
      return this.$store.getters.isLoading || false;
    },
    toastMessage(){
      return this.$store.getters.getToastMessage || false;
    }
  },
  methods:{
    async init(){
      const authToken = this.$store.getters.getAuthToken
    }
  },
  watch:{
    toastMessage(newVal){
      if(newVal) this.$bvToast.toast(newVal);
    }
  }
};
</script>

<style>
body{
  font-family: Arial, Helvetica, sans-serif !important;
  background: #f0f2f5 !important;
}
.is-fullwidth, .upload-draggable{
  width:100%;
}
.icon.is-small{
  height: 16px;
  width: 16px;
}
</style>
