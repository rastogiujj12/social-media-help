import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '../store';

// import auth from "./middleware/auth";

// lazy load these in group "dashboard";
// import Dashboard from '../components/Dashboard/Dashboard';
// import Video from '../components/Dashboard/video.vue';

// import Header from '../components/Header/Header';
// import Navbar from '../components/Navbar/Navbar';
import LogIn from '../components/Auth/LogIn';
// import LogOut from '../components/Auth/LogOut'
// import SignUp from '../components/Auth/SignUp';

// import Profile from '../components/Profile/Profile'

// import MainVideo from '../components/MainVideo/MainVideo'

// import Pages from '../components/Pages/Pages'
import AddCode from "../components/Main/AddCode"
import FacebookRedirect from "../components/Facebook/FacebookRedirect"
import InstagramRedirect from "../components/Instagram/InstagramRedirect"

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    components: {
      default: AddCode,
    }
  },
  {
    name: 'Facebook',
    path: '/facebook',
    components:{
      default:FacebookRedirect
    }
  },
  {
    name: 'Instagram',
    path: '/instagram',
    components:{
      default:InstagramRedirect
    }
  }
];


const router = new VueRouter({
  mode: 'history',
  routes,
});



// router.beforeEach(async (to, from, next) => {
//   // console.log("auth token", store.state.Auth.authToken);
//   let auth = await store.state.Auth.authToken;
//   if (to.path == "/") next({ path: "/dashboard" });
//   if (
//     to.path !== "/login" &&
//     to.path !== "/signup" &&
//     to.path !== "/logout" &&
//     to.path !== "/profile" &&
//     !store.state.Auth.authToken
//   ) {
//     // console.log("to path", to.path);
//     let { login, error } = await store.dispatch("autoLogin");
//     if(login && (to.path =='/login' || to.path=='/signup')) next({path:"/dashboard"}) 
//     if (login) next();
//   } else if (
//     store.state.Auth.authToken &&
//     (to.path === "/login" || to.path === "/signup")
//   ) {
//     next({ path: "/dashboard" });
//   } else next();
// });

export default router;