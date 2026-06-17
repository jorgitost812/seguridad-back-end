<template>
    <v-app dark>
      <v-app-bar color="primary" dark fixed app>
        <v-toolbar-title>Control contraseñas de las PC</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-list-item-title>{{ user.nombre }} {{ user.apellidos }} ({{ user.rol.nombre }})</v-list-item-title>
        <v-btn small class="ml-2" icon @click="Salir">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
      
      <v-main style="background-color: #FFF9C4">
        <v-container>
          <nuxt />
        </v-container>
      </v-main>
      
      <v-footer color="primary" dark app>
        <v-spacer></v-spacer>
        <span>&copy; Grupo Informatico Las Tunas @ Año: {{ new Date().getFullYear() }}</span>
        <v-spacer></v-spacer>
      </v-footer>
    </v-app>
  </template>
  
  <script>
  export default {
    computed: {
      user() {
        return this.$store.state.auth.user || {};
      }
    },
    methods: {
      async Salir() {
        await this.$store.dispatch('auth/logout')
        this.$router.push("/login");
      }
    }
  };
  </script>