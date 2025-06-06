export const state = () => ({
    list: [],
    admin: []
  })
  
  export const mutations = {
    setUsuarios(state, data) {
      state.list = data
    },
    setAdmin(state, data) {
      state.admin = data
    },
  }
  
  export const actions = {
    async getUsuarios({commit}) {
      try {
        const data = await this.$axios.$get('api/usuarios');
        // console.log(data)
        commit('setUsuarios', data);
      } catch (error) {
        console.log(error);
      }
    },
    async getByRol({commit}, id) {
      
      try {
        const data = await this.$axios.$get(`api/usuarios/by_rol/${id}`);
        commit('setUsuarios', data);
      } catch (error) {
        console.log(error);
      }
    },
    async getByIdJovenClubAndNombreRol({commit}, id) { //data
      //const {id, rol} = data;
      const nombrerol ="AdministradorJC";
      //console.log(id+" - "+nombrerol);
      try {
        const data = await this.$axios.$get(`api/usuarios/by_joven_club_and_rol/${id}`);
        commit('setAdmin', data);
      } catch (error) {
        console.log(error);
      }
    }
  }