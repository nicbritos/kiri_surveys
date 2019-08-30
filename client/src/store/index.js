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
    questions: {
      headers: [
        { text: "Name", align: "left", value: "name", sortable: true },
        { text: "Measurable", value: "measurable", sortable: false },
        { text: "Feedback", value: "feedback", sortable: false },
        { text: "Answered", value: "answered", sortable: false },
        { text: "Actions", value: "action", sortable: false }
      ],
      selected: [],
      items: [
        {
          name: "Que piensa sobre el CC?",
          measurable: true,
          feedback: true,
          answered: true,
          values: [
            {
              value: 1,
              description: "Poco"
            },
            {
              value: 2,
              description: "Medio"
            },
            {
              value: 3,
              description: "Mucho"
            }
          ]
        },
        {
          name: "Aguante Peron",
          measurable: true,
          feedback: true,
          answered: true,
          values: []
        },
        {
          name: "Tu vieja? Si, tu vieja.",
          measurable: false,
          feedback: false,
          answered: false,
          values: []
        }
      ]
    },
    questionValues: {
      headers: [
        { text: "Value", align: "left", value: "value", sortable: true },
        { text: "Description", value: "description", sortable: false },
        { text: "Actions", value: "action", sortable: false }
      ]
    },
    workshops: {},
    endpoints: {
      items: [
        {
          name: "Instituto Inmaculada",
          description: "Talleres hechos en Instituto Inmaculada de Castelar",
          quantity: 4,
          id: "asdkfhaskld"
        },
        {
          name: "ITBA",
          description:
            "Talleres hechos en el Instituto Tecnologico de Buenos Aires",
          quantity: 12,
          id: "asdkfhaskladsd"
        },
        {
          name: "ITBA Postgrado",
          description: "Talleres hechos en ITBA Postgrado",
          quantity: 3,
          id: "asdkfhaskassadfasdld"
        },
        {
          name: "ORT",
          description: "Talleres hechos en la escuela ORT",
          quantity: 2,
          id: "asdkfhasksddddld"
        },
        {
          name: "UBA",
          description: "Talleres hechos en la UBA",
          quantity: 0,
          id: "1231asdf"
        }
      ]
    },
    users: {},
    forms: {},
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
