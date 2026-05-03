export const state = () => ({
    user: null,
    loggedIn: false,
    token: null
  })
  
  export const mutations = {
    SET_USER(state, user) {
      state.user = user
      state.loggedIn = !!user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.loggedIn = false
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
  
  export const actions = {
    async login({ commit }, { email, password }) {
      try {
        const { data } = await this.$axios.post('/api/auth/login', { email, password })
        if (data.access_token) {
          commit('SET_TOKEN', data.access_token)
          this.$axios.setToken(data.access_token, 'Bearer')
        }
        commit('SET_USER', data.user)
        return { success: true, user: data.user }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' }
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
      this.$axios.setToken(false)
    }
  }
  
  export const getters = {
    user: state => state.user,
    isLoggedIn: state => state.loggedIn,
    rol: state => state.user?.rol?.nombre,
    rolId: state => state.user?.rol?.id
  }