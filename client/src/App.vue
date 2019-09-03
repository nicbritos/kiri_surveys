<template>
  <v-app :dark="theme == 'dark' ? true : false">
    <Loader :loading="loading" />
    <Rating @rate="rate" :visible="ratingVisibility" />
    <v-navigation-drawer
      :expand-on-hover="expandOnHover"
      value="true"
      permanent
      fixed
      app
      touchless
      dark
    >
      <v-list class="list-title">
        <v-list-item>
          Icon
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          router
          :to="item.to"
          exact
          ripple
        >
          <v-list-item-action>
            <v-icon v-html="item.icon" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
          <v-spacer />
          <v-chip
            disabled
            color="warning"
            class="x-small white--text"
            v-if="item.chip"
            >{{ item.chip }}</v-chip
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevate-on-scroll app dark class="grey darken-3" dense>
      <v-app-bar-nav-icon
        v-blur
        v-if="!this.noBackButtonRoutes.includes(this.$router.currentRoute.name)"
        @click="this.upOneLevel"
      >
        <v-icon>arrow_back</v-icon>
      </v-app-bar-nav-icon>
      <img id="logo" src="@/assets/logo.png" alt="logo castelar bus" />
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            @click="
              theme == 'light'
                ? $store.dispatch('setTheme', 'dark')
                : $store.dispatch('setTheme', 'light')
            "
            v-blur
            v-on="on"
          >
            <v-icon>{{
              theme == "light" ? "brightness_3" : "brightness_5"
            }}</v-icon>
          </v-btn>
        </template>
        <span>{{
          theme == "light" ? "Cambiar al modo oscuro" : "Cambiar al modo claro"
        }}</span>
      </v-tooltip>

      <v-btn to="/login" light class="nav-btn" v-if="!loggedIn" v-blur>
        <v-icon left>exit_to_app</v-icon>
        CONECTARME
      </v-btn>
      <v-btn
        to="/register"
        class="nav-btn"
        color="primary"
        v-if="!loggedIn"
        v-blur
        ><v-icon left>person_add</v-icon> REGISTRARME</v-btn
      >
      <v-menu absolute v-if="loggedIn">
        <template v-slot:activator="{ on }">
          <v-btn id="profile-btn" :icon="mobile" text v-on="on" v-blur>
            <v-icon large :left="!mobile">
              account_circle
            </v-icon>
            <span v-if="!mobile">{{ displayName }} {{ stringID }}</span>
          </v-btn>
        </template>

        <v-list>
          <v-list-item ripple @click="">
            <v-icon v-html="'settings'" />
            <v-list-item-title v-text="'Configuración'" />
          </v-list-item>
          <v-list-item ripple @click="logOut">
            <v-icon v-html="'power_settings_new'" />
            <v-list-item-title v-text="'Cerrar sesión'" />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      {{ rating.rate }}
      {{ rating.comment }}
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import database from "@/database";
import Loader from "@/components/Loader";
import Rating from "@/components/Rating";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    Loader,
    Rating
  },
  data: () => ({
    fixed: false,
    noBackButtonRoutes: [
      "endpoints",
      "questions",
      "forms",
      "users",
      "login",
      "register",
      "about"
    ],
    items: [
      { icon: "school", title: "Data", to: "/endpoints" },
      { icon: "question_answer", title: "Questions", to: "/questions" },
      { icon: "view_list", title: "Forms", to: "/forms" },
      { icon: "group", title: "Users", to: "/users" },
      { icon: "exit_to_app", title: "Ingresar", to: "/login" },
      { icon: "person_add", title: "Registrarme", to: "/register" },
      { icon: "help", title: "About", to: "/about" }
    ],
    title: "KIRI Surveys",
    rating: {}
  }),
  computed: {
    ...mapGetters([
      "loading",
      "loggedIn",
      "displayName",
      "stringID",
      "minWidth",
      "maxWidth",
      "ratingVisibility",
      "theme"
    ]),
    expandOnHover() {
      return this.minWidth(991);
    },
    mobile() {
      return this.minWidth(575);
    }
  },
  created() {
    localStorage.loggedIn = false; // Always set to false to prevent protected routes from being leaked.

    if (!localStorage.userPreferences) {
      localStorage.userPreferences = JSON.stringify({
        theme: "light"
      });
    }

    const { theme } = JSON.parse(localStorage.userPreferences);
    this.$store.dispatch("setTheme", theme);
    this.$store.dispatch("setWindowWidth");
    this.$store.state.loading = false;

    database.onAuthStateChanged(async user => {
      if (user) {
        localStorage.loggedIn = true;
        const userData = await database.getUserInformation();
        this.$store.dispatch("setUserData", userData);
        this.$store.state.loading = false;
      } else {
        localStorage.loggedIn = false;
        this.$store.dispatch("resetUserData");
        this.$store.state.loading = false;
      }
    });

    // database
    //   .getStops()
    //   .then(stops => this.$store.dispatch("setStops", stops))
    //   .catch(err => console.error(err));

    // database
    //   .getDefaultTrips()
    //   .then(trips => this.$store.dispatch("setDefaultTrips", trips))
    //   .catch(err => alert("No tenés suficiente permisos"));
  },
  mounted() {
    this.$store.watch(
      state => state.user.loggedIn,
      newValue => {
        localStorage.loggedIn = newValue;
      }
    );
  },
  methods: {
    logOut() {
      database.signOut().then(() => {
        this.$router.push("/");
        location.reload();
      });
    },
    showLoader() {
      this.$store.state.loading = true;
    },
    rate(payload) {
      this.rating = payload;
    },
    upOneLevel() {
      let path = this.$router.currentRoute.path.substring(
        0,
        this.$router.currentRoute.path.lastIndexOf(
          "/",
          this.$router.currentRoute.path.length - 2
        )
      );
      if (path.length > 0) this.$router.push(path);
      else this.$router.push("/");
    }
  }
};
</script>

<style lang="scss">
body {
  position: relative;
  background-color: #fafafa;
}

// a:not(.v-list__tile) {
//   text-decoration: none;

//   &:hover {
//     text-decoration: underline;
//   }
// }

.nav-btn {
  height: 36px !important;
  margin-right: 1em !important;
}

#logo {
  width: 175px;
}

.v-menu__content {
  i {
    margin-right: 10px;
  }
}

.list-title {
  margin-bottom: -25px;
}

.v-chip.x-small {
  height: 18px;
  font-size: 11px;

  &.__content {
    padding: 0 8px;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  bottom: 0px;
  opacity: 0;
}
</style>
