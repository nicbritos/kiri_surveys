<template>
  <v-app :dark="theme == 'dark' ? true : false">
    <Loader :loading="loading" />
    <Rating @rate="rate" :visible="ratingVisibility" />
    <v-bottom-nav
      app
      :active.sync="bottomNav"
      :value="true"
      fixed
      v-if="minWidth(991)"
    >
      <v-btn
        v-for="(item, i) in items"
        :key="i"
        exact
        color="primary"
        flat
        :to="item.to"
        replace
      >
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-nav>
    <v-navigation-drawer :value="drawer" fixed app touchless>
      <v-list class="list-title">
        <v-list-tile>
          APLICACIÓN
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          router
          :to="item.to"
          exact
          ripple
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
          <v-spacer />
          <v-chip
            disabled
            color="warning"
            class="x-small white--text"
            v-if="item.chip"
            >{{ item.chip }}</v-chip
          >
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app dark class="grey darken-3">
      <v-toolbar-side-icon @click="drawer = !drawer" v-if="maxWidth(991)" />
      <img id="logo" src="@/assets/logo.png" alt="logo castelar bus" />
      <v-spacer />
      <v-toolbar-items>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              @click="
                theme == 'light'
                  ? $store.dispatch('setTheme', 'dark')
                  : $store.dispatch('setTheme', 'light')
              "
              v-on="on"
            >
              <v-icon>{{
                theme == "light" ? "brightness_3" : "brightness_5"
              }}</v-icon>
            </v-btn>
          </template>
          <span>{{
            theme == "light"
              ? "Cambiar al modo oscuro"
              : "Cambiar al modo claro"
          }}</span>
        </v-tooltip>

        <v-btn to="/login" light class="nav-btn" v-if="!loggedIn"
          ><v-icon left>exit_to_app</v-icon> CONECTARME</v-btn
        >
        <v-btn to="/register" class="nav-btn" color="primary" v-if="!loggedIn"
          ><v-icon left>person_add</v-icon> REGISTRARME</v-btn
        >
        <v-menu absolute v-if="loggedIn">
          <template v-slot:activator="{ on }">
            <v-btn id="profile-btn" :icon="mobile" flat v-on="on">
              <v-icon large :left="!mobile">
                account_circle
              </v-icon>
              <span v-if="!mobile">{{ displayName }} {{ stringID }}</span>
            </v-btn>
          </template>

          <v-list>
            <v-list-tile ripple @click="">
              <v-icon v-html="'settings'" />
              <v-list-tile-title v-text="'Configuración'" />
            </v-list-tile>
            <v-list-tile ripple @click="logOut">
              <v-icon v-html="'power_settings_new'" />
              <v-list-tile-title v-text="'Cerrar sesión'" />
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>

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
    items: [
      { icon: "home", title: "Inicio", to: "/", chip: "nuevo" },
      { icon: "help", title: "About", to: "/about" },
      { icon: "exit_to_app", title: "Ingresar", to: "/login" },
      { icon: "person_add", title: "Registrarme", to: "/register" }
    ],
    title: "Castelar Bus",
    rating: {},
    drawer: false
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
