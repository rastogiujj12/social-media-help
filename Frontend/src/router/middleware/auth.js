import store from "../../store";

export default function auth({ next, store }) {
  if (!store.getters.auth.loggedIn) {
    return next("/login");
  }
  // console.log("logged in");
  return next();
}
