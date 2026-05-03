<template>
    <div>
      <!-- Filtro por Joven Club -->
      <v-card class="mb-4" color="#FFF9C4" elevation="2">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" sm="3" class="text-center">
              <span class="font-weight-bold">Filtrar por Joven Club:</span>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="jcSeleccionado"
                :items="listaJCs"
                item-text="nombre"
                item-value="id"
                label="Joven Club (Todos)"
                outlined
                dense
                clearable
                @change="cargarInstructores"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <v-data-table
        style="background-color: #FFF9C4"
        :headers="headers"
        :items="instructores"
        :items-per-page="20"
        sort-by="nombre"
        class="elevation-1"
        :loading="cargando"
      >
        <template v-slot:top>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Instructores (Todos los JC)</v-toolbar-title>
          </v-toolbar>
        </template>
  
        <template v-slot:item.grupo_municipal="{ item }">
          {{ item.grupo_municipal ? 'Sí' : 'No' }}
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({
      cargando: false,
      instructores: [],
      listaJCs: [],
      jcSeleccionado: null,
      headers: [
        { text: "Nombre", value: "nombre", width: '12%' },
        { text: "Apellidos", value: "apellidos", width: '15%' },
        { text: "Correo", value: "email", width: '20%' },
        { text: "Joven Club", value: "jc.nombre", width: '15%' },
        { text: "G. Municipal", value: "grupo_municipal", width: '10%' },
        { text: "Rol", value: "rol.nombre", width: '15%' }
      ]
    }),
    async created() {
      await this.cargarJCs();
      await this.cargarInstructores();
    },
    methods: {
      async cargarJCs() {
        try {
          const { data } = await this.$axios.get('api/jcs');
          this.listaJCs = data;
        } catch (error) {
          console.error('Error cargando JCs:', error);
        }
      },
      async cargarInstructores() {
        this.cargando = true;
        try {
          let url = 'api/usuarios';
          if (this.jcSeleccionado) {
            url = `api/usuarios/by_joven_club/${this.jcSeleccionado}`;
          }
          const { data } = await this.$axios.get(url);
          this.instructores = data;
        } catch (error) {
          console.error('Error cargando instructores:', error);
        } finally {
          this.cargando = false;
        }
      }
    }
  };
  </script>