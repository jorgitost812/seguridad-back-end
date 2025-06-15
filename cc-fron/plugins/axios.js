export default function ({ $axios, store }) {
    $axios.onRequest(config => {
      const token = store.state.auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Solicitud enviada:', config.url, config.headers);
      return config;
    });
  }