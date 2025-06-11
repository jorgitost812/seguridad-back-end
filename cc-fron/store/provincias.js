export const state = () => ({
  list: []
})

export const mutations = {
  setMunicipios(state, municipios) {
    state.list = municipios
  }
}

export const actions = {
  async getMunicipiosByProvincia({ commit }, provinciaId) {
    const { data } = await this.$axios.get(`api/municipios/by_provincia/${provinciaId}`)
    commit('setMunicipios', data)
  }
}