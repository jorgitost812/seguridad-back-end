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
      commit('setLoading', true);
      const { data } = await this.$axios.get(`api/accesos/by_joven_club/${jcId}`);
      commit('setAccesosPC', data);
    } catch (error) {
      commit('setError', error.message);
    } finally {
      commit('setLoading', false); 
    }
  }
}