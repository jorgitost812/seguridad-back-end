export default {
  target: 'static',
  server: { port: 8080, host: 'localhost' },
  head: { title: 'Sistema de Gestión de Inventarios - JC Las Tunas', htmlAttrs: { lang: 'es' }, meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }], link: [{ rel: 'icon', type: 'image/x-icon', href: '/logojc.jpg' }] },
  css: [],
  plugins: ['~/plugins/axios.js'],
  components: true,
  buildModules: ['@nuxtjs/vuetify'],
  modules: ['@nuxtjs/axios'],
  axios: { baseURL: 'http://localhost:3000' },
  vuetify: { theme: { themes: { light: { primary: '#0D47A1', accent: '#FFC107' } } } },
  build: {}
}