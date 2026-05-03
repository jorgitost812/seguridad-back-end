<template>
    <v-data-table
      style="background-color: #FFF9C4"
      :headers="headers"
      :items="municipios"
      :items-per-page="20"
      sort-by="nombre"
      class="elevation-1"
      :loading="cargando"
    >
      <template v-slot:top>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Municipios</v-toolbar-title>
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
      municipios: [],
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Provincia", value: "provincia.nombre" },
        { text: "Acciones", value: "actions", sortable: false }
      ]
    }),
    async created() {
      await this.cargarMunicipios();
    },
    methods: {
      async cargarMunicipios() {
        this.cargando = true;
        try {
          const { data } = await this.$axios.get('api/municipios');
          this.municipios = data;
        } catch (error) {
          console.error('Error cargando municipios:', error);
        } finally {
          this.cargando = false;
        }
      }
    }
  };
  </script>