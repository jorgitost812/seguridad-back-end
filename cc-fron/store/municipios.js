export const state = () => ({
  list: [],
  loading: false,
  error: null
})

export const mutations = {
  SET_MUNICIPIOS(state, municipios) {
    state.list = municipios
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async getMunicipios({ commit }) {
    try {
      commit('SET_LOADING', true)
      const { data } = await this.$axios.get('api/municipios')
      commit('SET_MUNICIPIOS', data)
    } catch (error) {
      commit('SET_ERROR', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getMunByProvincia({ commit }, idProvincia) {
    try {
      const { data } = await this.$axios.get(
        `api/municipios/by-provincia/${idProvincia}`
      );
      commit('SET_LIST', data);
    } catch (error) {
      console.error("Error cargando municipios:", error);
      // Manejo de errores
    }
  }
  
}

