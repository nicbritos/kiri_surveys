import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user
  },
  // App global-access state for views and components.
  state: {
    loading: true,
    headers: [
      {
        text: "Dessert (100g serving)",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Carbs (g)", value: "carbs" },
      { text: "Protein (g)", value: "protein" },
      { text: "Actions", value: "action" }
    ],
    desserts: [
      {
        name: "Frozen Yogurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0
      },
      {
        name: "Ice cream sandwich",
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3
      },
      {
        name: "Eclair",
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0
      },
      {
        name: "Cupcake",
        calories: 310,
        fat: 3.7,
        carbs: 67,
        protein: 4.3
      },
      {
        name: "Gingerbread",
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9
      },
      {
        name: "Jelly bean",
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0
      },
      {
        name: "Lollipop",
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0
      },
      {
        name: "Honeycomb",
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5
      },
      {
        name: "Donut",
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9
      },
      {
        name: "KitKat",
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7
      }
    ],
    windowWidth: 0,
    ratingVisibility: false,
    theme: "light"
  },
  // Store mutations in order to not modify the state directly.
  // Mutations cannot be called directly from a component. Instead, call an action.
  // Can't contain asynchronous operations.
  mutations: {
    WINDOW_WIDTH(state, width) {
      state.windowWidth = width;
    },
    TOGGLE_RATING(state) {
      state.ratingVisibility = !state.ratingVisibility;
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    }
  },
  // Actions 'commit' mutations.
  // Can contain asynchronous operations.
  // 'Dispatch' to call an action.
  actions: {
    setWindowWidth({ commit }) {
      function commitWidth() {
        commit("WINDOW_WIDTH", window.innerWidth);
      }

      commitWidth();
      window.addEventListener("resize", commitWidth);
    },
    toggleRating({ commit }) {
      commit("TOGGLE_RATING");
    },
    setTheme({ commit }, theme) {
      let userPreferences = JSON.parse(localStorage.userPreferences);
      userPreferences.theme = theme;
      localStorage.userPreferences = JSON.stringify(userPreferences);

      commit("SET_THEME", theme);
    },
    setStops({ commit }, stops) {
      console.log(stops);
    },
    setDefaultTrips({ commit }, trips) {
      console.log(trips);
    }
  },
  // Getters act as computed properties.
  getters: {
    minWidth: state => size => {
      return state.windowWidth < size;
    },
    maxWidth: state => size => {
      return state.windowWidth > size;
    },
    loading(state) {
      return state.loading;
    },
    ratingVisibility(state) {
      return state.ratingVisibility;
    },
    theme(state) {
      return state.theme;
    }
  }
});
