<template>
    <div>
      <!-- Título de bienvenida -->
      <v-card class="mb-4 text-center" style="background-color: #FFF9C4" elevation="2">
        <v-card-text>
          <h2 class="text-h5 font-weight-bold">Bienvenido {{ user?.nombre || '' }} ({{ user?.rol?.nombre || '' }})</h2>
        </v-card-text>
      </v-card>
  
      <!-- Tabla de Administradores de JC -->
      <v-data-table
        style="background-color: #FFF9C4"
        :headers="headers"
        :items="administradores"
        :items-per-page="20"
        sort-by="nombre"
        class="elevation-1"
        :loading="cargando"
      >
        <template v-slot:top>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Administradores de Joven Club</v-toolbar-title>
          </v-toolbar>
        </template>
  
        <template v-slot:item.activo="{ item }">
          {{ item.activo ? 'Sí' : 'No' }}
        </template>
  
        <template v-slot:item.actions>
          <v-icon small color="grey">mdi-eye</v-icon>
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
  
    data: () => ({
      cargando: false,
      administradores: [],
      headers: [
        { text: "Nombre", align: "start", sortable: true, value: "nombre", width: '15%' },
        { text: "Apellidos", value: "apellidos", width: '20%' },
        { text: "Correo", value: "email", width: '25%' },
        { text: "Joven Club", value: "jc.nombre", width: '20%' },
        { text: "Activo", value: "activo", width: '10%' },
        { text: "Acciones", value: "actions", sortable: false, width: '10%' }
      ]
    }),
  
    computed: {
      user() {
        return this.$store.state.auth.user;
      }
    },
  
    async created() {
      await this.cargarAdministradores();
    },
  
    methods: {
      async cargarAdministradores() {
        this.cargando = true;
        try {
          // Obtener todos los usuarios
          const { data } = await this.$axios.get('api/usuarios');
          // Filtrar solo los que tienen rol "AdministradorJC"
          this.administradores = data.filter(user => user.rol?.nombre === 'AdministradorJC');
          console.log('Administradores cargados:', this.administradores.length);
        } catch (error) {
          console.error('Error cargando administradores:', error);
        } finally {
          this.cargando = false;
        }
      }
    }
  };
  </script>