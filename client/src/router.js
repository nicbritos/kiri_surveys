import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Recovery from "./views/Recovery.vue";
import store from "./store/index";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      meta: {
        requiresAuth: true
      },
      component: About
    },
    {
      path: "/register",
      name: "register",
      meta: {
        requiresUnAuth: true
      },
      component: Register
    },
    {
      path: "/login",
      name: "login",
      meta: {
        requiresUnAuth: true
      },
      component: Login
    },
    {
      path: "/recovery",
      name: "recovery",
      meta: {
        requiresUnAuth: true
      },
      component: Recovery
    }
  ]
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
