import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

// import auth from "./middleware/auth";

// lazy load these in group "dashboard";
// import Dashboard from '../components/Dashboard/Dashboard';
// import Video from '../components/Dashboard/video.vue';

// import Header from '../components/Header/Header';
// import Navbar from '../components/Navbar/Navbar';
// import LogIn from '../components/Auth/LogIn';
// import LogOut from '../components/Auth/LogOut'
import SignUp from '../components/Auth/SignUp';
import Login from "../components/Auth/LoginPage.vue"
// import Profile from '../components/Profile/Profile'

// import MainVideo from '../components/MainVideo/MainVideo'

// import Pages from '../components/Pages/Pages'
import AddCode from "../components/Main/AddCode"
import PageList from "../components/PageList/PageList.vue"
// import FacebookRedirect from "../components/Facebook/FacebookRedirect"
// import InstagramRedirect from "../components/Instagram/InstagramRedirect"

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    components: {
      default: PageList,
    }
  },
  {
    path: '/episode',
    name: 'Main',
    components: {
      default: AddCode,
    }
  },
  {
    name: 'Sign up',
    path: '/signup',
    components: {
      default: SignUp
    }
  },
  {
    name: 'Login',
    path: '/login',
    components: {
      default: Login
    }
  }
];


const router = new VueRouter({
  mode: 'history',
  routes,
});



router.beforeEach(async (to, from, next) => {
  let auth = localStorage.getItem("userData");
  // console.log("auth token", auth);

  // if (to.path == "/") next({ path: "/dashboard" });
  if (
    to.path !== "/login" &&
    to.path !== "/signup" &&
    !auth
  ) {
    // console.log("to path", to.path);
    let { login, error } = await store.dispatch("autoLogin");
    if (login && (to.path == '/login' || to.path == '/signup')) next({ path: "/" })
    else if (login) next();
    else next({path:"/login"}) 
  } else if (
    auth &&
    (to.path == "/login" || to.path == "/signup")
  ) {
    next({ path: "/" });
  } else next();
});

export default router;