import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/index";
import "./registerServiceWorker";
import database from "@/database";
import vuetify from "@/plugins/vuetify";

Vue.use(Vuelidate);
database.init();

Vue.config.productionTip = false;

// Register a global custom directive called `v-blur` that prevents focus
// Automatically unfocus (as in Vuetify 1.5)
Vue.directive("blur", {
  inserted: function(el) {
    el.onfocus = ev => ev.target.blur();
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
