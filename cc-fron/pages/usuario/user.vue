<template>
    <div>
      <v-card class="text-center pa-4 mb-4" color="primary" dark><h2>Bienvenido {{ user?.nombre }} {{ user?.apellidos }}</h2></v-card>
      <v-data-table style="background-color: #FFF9C4" :headers="headers" :items="instructores" :loading="cargando" class="elevation-1">
        <template v-slot:item.grupo_municipal="{ item }">{{ item.grupo_municipal ? 'Sí' : 'No' }}</template>
        <template v-slot:item.actions><v-icon small color="grey">mdi-eye</v-icon></template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
    data: () => ({ cargando: false, instructores: [], headers: [{ text: "Nombre", value: "nombre" }, { text: "Apellidos", value: "apellidos" }, { text: "Correo", value: "email" }, { text: "J. Club", value: "jc.nombre" }, { text: "G. Municipal", value: "grupo_municipal" }, { text: "Rol", value: "rol.nombre" }, { text: "Acciones", value: "actions", sortable: false }] }),
    computed: { user() { return this.$store.state.auth.user; }, jcId() { return this.user?.jc?.id; } },
    async created() { await this.cargarInstructores(); },
    methods: {
      async cargarInstructores() { if (!this.jcId) return; this.cargando = true; const { data } = await this.$axios.get(`api/usuarios/by_joven_club/${this.jcId}`); this.instructores = data; this.cargando = false; }
    }
  };
  </script>