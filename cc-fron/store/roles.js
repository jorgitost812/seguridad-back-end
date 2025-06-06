export const state = () => ({
    list: []
  })
  
  export const mutations = {
    setRoles(state, data) {
      state.list = data
    },
  }
  
  export const actions = {
    async getRoles({commit}) {
      try {
        const data = await this.$axios.$get('api/roles');
        // console.log( data);
        commit('setRoles', data);
      } catch (error) {
        console.log(error);
      }
    }
  }