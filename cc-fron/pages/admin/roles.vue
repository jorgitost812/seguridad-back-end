<template>
    <v-data-table
      style="background-color: #FFF9C4"
      :headers="headers"
      :items="roles"
      :items-per-page="20"
      sort-by="nombre"
      class="elevation-1"
      :loading="cargando"
    >
      <template v-slot:top>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Roles</v-toolbar-title>
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
      roles: [],
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Descripción", value: "descripcion" },
        { text: "Acciones", value: "actions", sortable: false }
      ]
    }),
    async created() {
      await this.cargarRoles();
    },
    methods: {
      async cargarRoles() {
        this.cargando = true;
        try {
          const { data } = await this.$axios.get('api/roles');
          this.roles = data;
        } catch (error) {
          console.error('Error cargando roles:', error);
        } finally {
          this.cargando = false;
        }
      }
    }
  };
  </script>