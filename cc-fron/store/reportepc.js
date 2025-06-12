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
      commit('setError', null);

      if (!jcId) {
        throw new Error('ID de Joven Club no válido');
      }

      const { data } = await this.$axios.get(`/api/accesos/by_joven_club/${jcId}`);
      commit('setAccesosPC', data);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      commit('setError', errorMessage);
      console.error('Error obteniendo accesos:', errorMessage);
    } finally {
      commit('setLoading', false);
    }
  }
}