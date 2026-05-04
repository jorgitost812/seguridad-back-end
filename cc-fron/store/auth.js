export const state = () => ({
  user: null,
  token: null,
  loggedIn: false
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.loggedIn = !!user
    if (process.client && user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else if (process.client && !user) {
      localStorage.removeItem('user')
    }
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (process.client && token) {
      localStorage.setItem('token', token)
    } else if (process.client && !token) {
      localStorage.removeItem('token')
    }
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    state.loggedIn = false
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
}

export const actions = {
  async login({ commit }, { email, password }) {
    try {
      const { data } = await this.$axios.post('/api/auth/login', { email, password })
      if (data.access_token) {
        commit('SET_TOKEN', data.access_token)
      }
      commit('SET_USER', data.user)
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' }
    }
  },
  logout({ commit }) {
    commit('CLEAR_AUTH')
  }
}

export const getters = {
  user: state => state.user,
  isLoggedIn: state => state.loggedIn,
  token: state => state.token,
  rol: state => state.user?.rol?.nombre,
  rolId: state => state.user?.rol?.id
}