export const state = () => ({
  list: []
})

export const mutations = {
  setAccesosPC(state, data) {
    state.list = data
  },
}

export const actions = {
  async getAccesosPC({commit}) {
    try {
      const data = await this.$axios.$get('api/accesos');
      commit('setAccesosPC', data);
    } catch (error) {
      console.log(error);
    }
  },
  
}

