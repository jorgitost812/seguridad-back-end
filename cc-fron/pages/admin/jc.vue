<template>
    <v-data-table
      style="background-color: #FFF9C4"
      :headers="headers"
      :items="jovenClubs"
      :items-per-page="20"
      sort-by="nombre"
      class="elevation-1"
      :loading="cargando"
    >
      <template v-slot:top>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Joven Clubs</v-toolbar-title>
        </v-toolbar>
      </template>
  
      <template v-slot:item.actions>
        <v-icon small color="grey">mdi-eye</v-icon>
      </template>
    </v-data-table>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({
      cargando: false,
      jovenClubs: [],
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Municipio", value: "municipio.nombre" },
        { text: "Acciones", value: "actions", sortable: false }
      ]
    }),
    async created() {
      await this.cargarJCs();
    },
    methods: {
      async cargarJCs() {
        this.cargando = true;
        try {
          const { data } = await this.$axios.get('api/jcs');
          this.jovenClubs = data;
        } catch (error) {
          console.error('Error cargando JCs:', error);
        } finally {
          this.cargando = false;
        }
      }
    }
  };
  </script>