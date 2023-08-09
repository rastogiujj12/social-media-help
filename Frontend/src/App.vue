<template>
  <b-overlay :show="isLoading">
    <div id="app" class="container">
      <router-view/>
      <!-- <b-toast? id="my-toast" variant="warning" solid/> -->
      <profile/>
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
  name: 'App',
  created() {
    // Check for token in LocalStorage 
    this.$store.dispatch('autoLogin')
    this.$store.dispatch('setIsLoading',{value:false})
  },
  computed:{
    isLoading(){
      // console.log('isLoading changed',this.$store.getters.isLoading);
      return this.$store.getters.isLoading || false;
    }
  },
  methods:{
    async init(){
      const authToken = this.$store.getters.getAuthToken
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
