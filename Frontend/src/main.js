// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import moment from 'moment';
import App from './App';
import router from './router';
import store from './store';
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2';


import './app.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { ModalPlugin, ToastPlugin } from 'bootstrap-vue'
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false;
Vue.prototype.moment = moment
Vue.prototype.axios = axios

Vue.use(ModalPlugin)
Vue.use(ToastPlugin)
Vue.use(VueSweetalert2);


// Vue.use(VueGtag, {
//   config: { id: "GTM-TJGZXBM" }
// }, router);

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCYMJarist-nWJPWn9GHTH8E6ccXWPQOZI",
//   authDomain: "social-media-helper-4a774.firebaseapp.com",
//   projectId: "social-media-helper-4a774",
//   storageBucket: "social-media-helper-4a774.appspot.com",
//   messagingSenderId: "436459683960",
//   appId: "1:436459683960:web:e38889bd07e5bb417a6d8d"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});