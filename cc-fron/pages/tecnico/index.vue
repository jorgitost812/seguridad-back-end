<template>
    <div>
      <v-card class="text-center pa-4 mb-4" style="background-color: #009B3A; color: white;"><h2>Panel Técnico - {{ user?.jc?.nombre }}</h2><p>Bienvenido {{ user?.nombre }} {{ user?.apellidos }}</p></v-card>
      <v-row><v-col cols="12"><v-card @click="$router.push('/tecnico/pc')" class="text-center pa-4" color="#FFF9C4" elevation="6"><v-icon x-large>mdi-laptop</v-icon><h3>Gestionar Computadoras</h3><p>Agregar, editar, eliminar PCs de {{ user?.jc?.nombre }}</p></v-card></v-col></v-row>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
    computed: { user() { return this.$store.state.auth.user; } }
  };
  </script>