import Vue from "vue";
import Router from "vue-router";
import store from "../store";
import routes from "./routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/endpoints"
    },
    {
      path: "*",
      redirect: "/page-not-found"
    }
  ].concat(Object.values(routes.router))
});

router.beforeEach((to, from, next) => {
  if (store.getters.loggedIn != null) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.getters.loggedIn) {
        next("/login");
      } else {
        next();
      }
    } else if (to.matched.some(record => record.meta.requiresUnAuth)) {
      if (store.getters.loggedIn) {
        next("/");
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

export default router;
