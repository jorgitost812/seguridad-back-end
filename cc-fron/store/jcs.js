export const state = () => ({
    list: []
  })

  export const mutations = {
    setJcs(state, data) {
      state.list = data
    },
  }

  export const actions = {

    async getJcs({commit}) {
      try {
        const data = await this.$axios.$get('api/jcs');
        commit('setJcs', data);
      } catch (error) {
        console.log(error);
      }
    },

    async getJcsByMunicipio({commit}, id) {
      try {
        const data = await this.$axios.$get(`api/jcs/by_municipio/${id}`);
        commit('setJcs', data);
      } catch (error) {
        console.log(error);
      }
    }
  }
