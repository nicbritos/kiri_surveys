const state = {
  userData: {},
  loggedIn: false
};

const mutations = {
  SET_USER_DATA(state, data) {
    state.loggedIn = true;
    state.userData = data;
  },
  RESET_USER_DATA(state) {
    state.loggedIn = false;
    state.userData = {};
  }
};

const actions = {
  setUserData({ commit }, data) {
    commit("SET_USER_DATA", data);
  },
  resetUserData({ commit }) {
    commit("RESET_USER_DATA");
  }
};

const getters = {
  loggedIn(state) {
    return localStorage.loggedIn === "true" ? true : state.loggedIn;
  },
  // Param state gets destructured
  displayName({ userData }) {
    return userData.userModifiable ? userData.userModifiable.displayName : "";
  },
  userID({ userData }) {
    return userData.adminModifiable ? userData.adminModifiable.customerId : "";
  },
  //Second param is getters. Gets destructured.
  stringID(state, { userID }) {
    return userID ? `(${userID})` : "";
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
