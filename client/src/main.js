import Vue from "vue";
import Vuelidate from "vuelidate";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "./registerServiceWorker";
import database from "@/database";

Vue.use(Vuelidate);
database.init();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
