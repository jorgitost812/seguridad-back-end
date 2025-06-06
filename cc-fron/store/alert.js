export const state = () => ({
    status: false,
    message: '',
    color: 'info'
  })
  
  export const mutations = {
    setAlert(state, data) {
      state.status = data.status;
      state.message = data.message;
      state.color = data.color;
    },
    clearAlert(state) {
      state.status = false,
      state.message = ''
    }
  }
  
  export const actions = {

  }