import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";
import Home from "./views/Home.vue";
import Forms from "./views/Forms.vue";
import Users from "./views/Users.vue";
import Login from "./views/Login.vue";
import About from "./views/About.vue";
import Register from "./views/Register.vue";
import Recovery from "./views/Recovery.vue";
import Questions from "./views/Questions.vue";
import Endpoints from "./views/data/Endpoints.vue";
import Workshops from "./views/data/Workshops.vue";

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
      path: "/questions",
      name: "questions",
      meta: {
        requiresAuth: false
      },
      component: Questions
    },
    {
      path: "/endpoints",
      name: "endpoints",
      meta: {
        requiresAuth: false
      },
      component: Endpoints
    },
    {
      path: "/endpoints/:id",
      name: "endpoint",
      meta: {
        requiresAuth: false
      },
      component: Workshops
    },
    {
      path: "/users",
      name: "users",
      meta: {
        requiresAuth: false
      },
      component: Users
    },
    {
      path: "/forms",
      name: "forms",
      meta: {
        requiresAuth: false
      },
      component: Forms
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
    },
    {
      path: "/about",
      name: "about",
      meta: {
        requiresUnAuth: true
      },
      component: About
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
