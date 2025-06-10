
import colors from 'vuetify/es5/util/colors'
import es from 'vuetify/src/locale/es.ts'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - GILT',
    title: 'Seguridad PC',
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
  server: {
    port: 8080,
	host: 'localhost'
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@mdi/font/css/materialdesignicons.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:3000'
  },

 // ...existing code...
 auth: {
  strategies: {
    local: {
      scheme: 'local',
      token: {
        property: 'access_token',
        required: true,
        type: 'Bearer'
      },
      user: {
        property: 'user'
      },
      endpoints: {
        login: { 
          url: '/api/auth/login', 
          method: 'post'
        },
        logout: false,
        user: false
      }
    }
  },
  redirect: {
    login: '/login',
    logout: '/login',
    home: '/'  // Cambia esto a la ruta donde quieres redirigir después del login
  }
}
,// ...existing code...

  router: {
    middleware: ['auth']
  },


  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAccess: false,
    lang: {
      locales: { es },
      current: 'es',
    },
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          backgroundcolor: colors.yellow.darken2,
          menucolor: colors.blue.accent1,
          fondoeditor: colors.yellow.lighten4
        },
        ligth: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          backgroundcolor: '#fdd835',
          menucolor: '#ff9900',
          fondoeditor: '#FFF9C4' 
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build:{
	//babel:{
		//plugins:[
			//["@babel/plugin-proposal-class-properties", { "loose": true }],
			//["@babel/plugin-proposal-private-methods", { "loose": true }],
			//["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
				//]
			//}
		}
}
