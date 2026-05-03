<template>
    <v-container>
      <v-card class="text-center pa-4 mb-4" color="primary" dark>
        <h2>Panel de Administración</h2>
        <p>Bienvenido {{ user?.nombre }} {{ user?.apellidos }} ({{ user?.rol?.nombre }})</p>
      </v-card>
  
      <v-row>
        <v-col cols="12" md="4">
          <v-card @click="$router.push('/admin/pc')" class="text-center pa-4" color="#FFF9C4" elevation="6">
            <v-icon x-large>mdi-laptop</v-icon>
            <h3>Computadoras</h3>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card @click="$router.push('/admin/user')" class="text-center pa-4" color="#FFF9C4" elevation="6">
            <v-icon x-large>mdi-account-group</v-icon>
            <h3>Instructores</h3>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card @click="$router.push('/admin/jc')" class="text-center pa-4" color="#FFF9C4" elevation="6">
            <v-icon x-large>mdi-office-building</v-icon>
            <h3>Joven Clubs</h3>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card @click="$router.push('/admin/municipios')" class="text-center pa-4" color="#FFF9C4" elevation="6">
            <v-icon x-large>mdi-map</v-icon>
            <h3>Municipios</h3>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card @click="$router.push('/admin/roles')" class="text-center pa-4" color="#FFF9C4" elevation="6">
            <v-icon x-large>mdi-account-badge</v-icon>
            <h3>Roles</h3>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card @click="$router.push('/admin/reportepc')" class="text-center pa-4" color="#FFF9C4" elevation="6">
            <v-icon x-large>mdi-clipboard-list</v-icon>
            <h3>Reportes</h3>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    layout: 'default',
    computed: { user() { return this.$store.state.auth.user; } }
  };
  </script>