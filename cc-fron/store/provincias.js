export const state = () => ({
  list: []
})

export const mutations = {
  setProvincias(state, data) {
    state.list = data
  },
}

export const actions = {
  async getProvincias({commit}) {
    try {
      const data = await this.$axios.$get('api/provincias');
      // console.log( data);
      commit('setProvincias', data);
    } catch (error) {
      console.log(error);
    }
  }
}

