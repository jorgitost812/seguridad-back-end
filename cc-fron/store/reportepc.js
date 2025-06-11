export const state = () => ({
  list: [],
  loading: false,
  error: null
})

export const mutations = {
  setAccesosPC(state, data) {
    state.list = data
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async getAccesosPC({ commit }, jcId) {
    try {
      commit('setLoading', true)
      const { data } = await this.$axios.get(`api/reportes/pc/${jcId}`)
      commit('setAccesosPC', data)
    } catch (error) {
      commit('setError', error)
      console.error('Error fetching accesos:', error)
    } finally {
      commit('setLoading', false)
    }
  }
}