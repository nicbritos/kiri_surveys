import Forms from "../views/Forms.vue";
import Users from "../views/Users.vue";
import Login from "../views/Login.vue";
import About from "../views/About.vue";
import Register from "../views/Register.vue";
import Recovery from "../views/Recovery.vue";
import Questions from "../views/Questions.vue";
import Endpoints from "../views/data/Endpoints.vue";
import Workshops from "../views/data/Workshops.vue";
import Responses from "../views/data/Responses.vue";
import PageNotFound from "../views/PageNotFound.vue";

const routes = {
  router: {
    questions: {
      path: "/questions",
      name: "questions",
      meta: {
        requiresAuth: false
      },
      component: Questions
    },
    endpoints: {
      path: "/endpoints",
      name: "endpoints",
      meta: {
        requiresAuth: false
      },
      component: Endpoints
    },
    workshops: {
      path: "/endpoints/:eid",
      name: "workshops",
      meta: {
        requiresAuth: false
      },
      component: Workshops
    },
    responses: {
      path: "/endpoints/:eid/:wid",
      name: "responses",
      meta: {
        requiresAuth: false
      },
      component: Responses
    },
    users: {
      path: "/users",
      name: "users",
      meta: {
        requiresAuth: false
      },
      component: Users
    },
    forms: {
      path: "/forms",
      name: "forms",
      meta: {
        requiresAuth: false
      },
      component: Forms
    },
    register: {
      path: "/register",
      name: "register",
      meta: {
        requiresUnAuth: true
      },
      component: Register
    },
    login: {
      path: "/login",
      name: "login",
      meta: {
        requiresUnAuth: true
      },
      component: Login
    },
    recovery: {
      path: "/recovery",
      name: "recovery",
      meta: {
        requiresUnAuth: true
      },
      component: Recovery
    },
    about: {
      path: "/about",
      name: "about",
      meta: {
        requiresUnAuth: true
      },
      component: About
    },
    "page-not-found": {
      path: "/page-not-found",
      name: "page-not-found",
      component: PageNotFound
    }
  },
  breadcrumbs: {
      questions: {
          href: "/questions",
          text: "Questions",
          disabled: false
      },
      endpoints: {
          href: "/endpoints",
          text: "Endpoints",
          disabled: false
      },

  }
};

export default routes;
