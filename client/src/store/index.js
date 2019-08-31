import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";

Vue.use(Vuex);

let questions = [
  {
    id: "abc",
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
    id: "def",
    name: "Aguante Peron",
    measurable: true,
    feedback: true,
    answered: true,
    values: []
  },
  {
    id: "ghi",
    name: "Tu vieja? Si, tu vieja.",
    measurable: false,
    feedback: false,
    answered: false,
    values: []
  }
];
let workshops = {
  def: [
    {
      id: "w1",
      quantity: 400,
      name: "ITBA1",
      date: undefined,
      responses: [
        {
          MN2: {
            PRE: {
              question: "abc",
              value: 1
            },
            POST: {
              question: "abc",
              value: 2
            }
          }
        }
      ]
    }
  ],
  ghi: [],
  jkl: [],
  mno: [],
  abc: []
};
let endpoints = [
  {
    id: "def",
    name: "Instituto Inmaculada",
    description: "Talleres hechos en Instituto Inmaculada de Castelar",
    quantity: 4
  },
  {
    id: "ghi",
    name: "ITBA",
    description: "Talleres hechos en el Instituto Tecnologico de Buenos Aires",
    quantity: 12
  },
  {
    id: "jkl",
    name: "ITBA Postgrado",
    description: "Talleres hechos en ITBA Postgrado",
    quantity: 3
  },
  {
    id: "mno",
    name: "ORT",
    description: "Talleres hechos en la escuela ORT",
    quantity: 2
  },
  {
    id: "abc",
    name: "UBA",
    description: "Talleres hechos en la UBA",
    quantity: 0
  }
];
let users = [];
let forms = [];

export default new Vuex.Store({
  modules: {
    user
  },
  // App global-access state for views and components.
  state: {
    loading: true,
    questions: {
      selected: [],
      items: questions
    },
    questionValues: {
      headers: [
        { text: "Value", align: "left", value: "value", sortable: true },
        { text: "Description", value: "description", sortable: false },
        { text: "Actions", value: "action", sortable: false }
      ]
    },
    workshops: workshops,
    endpoints: endpoints,
    users: users,
    forms: forms,
    __database__: {
      questions: {
        abc: questions[0],
        def: questions[1],
        ghi: questions[2]
      },
      workshops: {
        def: {
          w1: workshops.def[0]
        },
        ghi: {},
        jkl: {},
        mno: {},
        abc: {}
      },
      endpoints: {
        def: endpoints[0],
        ghi: endpoints[1],
        jkl: endpoints[2],
        mno: endpoints[3],
        abc: endpoints[4]
      }
    },
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
