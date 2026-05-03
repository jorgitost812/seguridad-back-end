<template>
    <div>
      <v-card class="text-center pa-4 mb-4" style="background-color: #009B3A; color: white;">
        <h2>Panel Administrador JC: {{ user?.jc?.nombre }}</h2>
        <p>Bienvenido {{ user?.nombre }} {{ user?.apellidos }}</p>
      </v-card>
      <v-row>
        <v-col cols="12" md="6"><v-card @click="$router.push('/adminjc/pc')" class="text-center pa-4" color="#FFF9C4" elevation="6"><v-icon x-large>mdi-laptop</v-icon><h3>Computadoras</h3><p>Gestionar PCs de {{ user?.jc?.nombre }}</p></v-card></v-col>
        <v-col cols="12" md="6"><v-card @click="$router.push('/adminjc/user')" class="text-center pa-4" color="#FFF9C4" elevation="6"><v-icon x-large>mdi-account-group</v-icon><h3>Instructores</h3><p>Gestionar personal de {{ user?.jc?.nombre }}</p></v-card></v-col>
        <v-col cols="12" md="6"><v-card @click="$router.push('/adminjc/reportepc')" class="text-center pa-4" color="#FFF9C4" elevation="6"><v-icon x-large>mdi-clipboard-list</v-icon><h3>Reportes</h3><p>Ver accesos</p></v-card></v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
    computed: { user() { return this.$store.state.auth.user; } }
  };
  </script>