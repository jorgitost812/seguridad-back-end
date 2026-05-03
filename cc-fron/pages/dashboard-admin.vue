<template>
    <v-container>
      <h1>Dashboard Administrador</h1>
      <p>Bienvenido {{ user?.nombre }} {{ user?.apellidos }}</p>
      <p>Rol: {{ user?.rol?.nombre }}</p>
    </v-container>
  </template>
  
  <script>
  export default {
    layout: 'default',
    computed: {
      user() {
        return this.$store.state.auth.user;
      }
    }
  };
  </script>