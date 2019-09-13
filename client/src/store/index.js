import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import DataStore from "@/data/dataStore";
import database from "@/data/database";

Vue.use(Vuex);

let workshops = {
  def: [
    {
      id: "w1",
      quantity: 400,
      name: "ITBA1",
      date: undefined,
      responses: [
        {
          person: "MN2",
          type: "PRE",
          question: "abc",
          value: 1
        },
        {
          person: "MN2",
          type: "PRE",
          question: "abc",
          value: 1
        }
      ]
    }
  ],
  ghi: [],
  jkl: [],
  mno: [],
  abc: []
};
let users = [];
let forms = [];

export default new Vuex.Store({
  modules: {
    user
  },
  // App global-access state for views and components.
  state: {
    loading: true,
    dataStore: new DataStore(database),
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
