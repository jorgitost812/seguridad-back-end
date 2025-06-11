export const state = () => ({
  list: [],
  loading: false,
  error: null
})
  
export const mutations = {
  setUsuarios(state, usuarios) {
    state.list = usuarios
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  }
}
  
  export const actions = {
    async getUsuarios({ commit }) {
      try {
        commit('setLoading', true)
        const { data } = await this.$axios.get('api/usuarios')
        commit('setUsuarios', data)
      } catch (error) {
        commit('setError', error)
        console.error('Error loading usuarios:', error)
      } finally {
        commit('setLoading', false)
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