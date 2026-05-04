export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Server configuration
  server: {
    port: 8080,
    host: 'localhost'
  },

  // Global page headers
  head: {
    title: 'cc-fron',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS
  css: [],

  // Plugins
  plugins: [
    '~/plugins/axios.js'
  ],

  // Auto import components
  components: true,

  // Modules
  buildModules: [
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios configuration
  axios: {
    baseURL: 'http://localhost:3000',
    credentials: false
  },

  // Auth configuration
  auth: {
    strategies: {
      local: {
        token: {
          property: 'access_token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/profile', method: 'get' }
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    },
    // IMPORTANTE: Deshabilitar el store automático para evitar duplicación
    store: false,
    useLocalStorage: true
  },

  // Vuetify configuration
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: '#1976D2',
          accent: '#FFC107',
          secondary: '#424242',
          info: '#2196F3',
          warning: '#FFC107',
          error: '#FF5252',
          success: '#4CAF50'
        }
      }
    }
  },

  // Build configuration
  build: {}
}