import { createStore } from 'vuex'

export default createStore({
  state: {
    loginPrompt: "",
    authenticated: false,
  },
  getters: {
    isAuthenticated: (state) => {
      return state.authenticated
    }    
  },
  mutations: {
    changeLoginPrompt: (state, prompt) => state.loginPrompt = prompt,
    SET_AUTH: (state, auth) => state.authenticated = auth
  },
  actions: {
    checkLogin: ( {commit}, prompt ) => commit('changeLoginPrompt', prompt),
    setAuth: ({commit}, auth) => commit('SET_AUTH', auth)
  },
  modules: {
  }
})
