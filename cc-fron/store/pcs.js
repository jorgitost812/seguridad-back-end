export const state = () => ({
    list: []
  })
  
  export const mutations = {
    setPcs(state, data) {
      state.list = data
    },
  }
  
  export const actions = {
    async getPcs({commit}) {
      try {
        const data = await this.$axios.$get('api/pcs');
        commit('setPcs', data);
      } catch (error) {
        console.log(error);
      }
    }
  }