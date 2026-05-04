export default function ({ $axios, store, redirect }) {
  // Configurar baseURL
  $axios.setBaseURL('http://localhost:3000')

  // Interceptor para agregar el token a cada petición
  $axios.onRequest(config => {
    // Obtener token del store o localStorage
    let token = null
    if (process.client) {
      token = store.state.auth?.token || localStorage.getItem('token')
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Token agregado a la petición:', config.url)
    } else {
      console.log('❌ No hay token para la petición:', config.url)
    }
    return config
  })

  // Interceptor para manejar errores
  $axios.onError(error => {
    console.error('❌ Error en petición:', error.response?.status, error.response?.data)
    if (process.client && error.response && error.response.status === 401) {
      store.commit('auth/CLEAR_AUTH')
      redirect('/login')
    }
    return Promise.reject(error)
  })
}