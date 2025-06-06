export const state = () => ({
    list: []
  })

  export const mutations = {
    setFiltro(state, data) {
      state.list = data
    },
  }

  export const actions = {
    async getFiltro({commit}, json) {
      console.log(json);
      try {
        const data = await this.$axios.$get(`api/accesos/by/${json}`);
        commit('setFiltro', data);
      } catch (error) {
        console.log(error);
      }
    }
  }

