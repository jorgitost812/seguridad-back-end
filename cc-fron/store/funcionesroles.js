export const state = () => ({
    list: []
  })
  
  export const mutations = {
    setfuncionesRoles(state, data) {
      state.list = data
    },
  }
  
  export const actions = {
    async getfuncionesRoles({commit}) {
      try {
        const data = await this.$axios.$get('api/funcionesroles');
        console.log( data);
        commit('setfuncionesRoles', data);
      } catch (error) {
        console.log(error);
      }
    }
  }