export const state = () => ({
  list: []
})

export const mutations = {
  setMunicipios(state, data) {
    state.list = data
  },
}

export const actions = {
  async getMunicipios({commit}) {
    try {
      const data = await this.$axios.$get('api/municipios');
      commit('setMunicipios', data);
    } catch (error) {
      console.log(error);
    }
  },
  async getMunByProvincia({commit}, id) {
      
    try {
      const data = await this.$axios.$get(`api/municipios/by_provincia/${id}`);
      commit('setMunicipios', data);
    } catch (error) {
      console.log(error);
    }
  }
}

