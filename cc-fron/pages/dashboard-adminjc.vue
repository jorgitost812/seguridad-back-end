<template>
    <div>
      <!-- Título de bienvenida -->
      <v-card class="mb-4 text-center" style="background-color: #FFF9C4" elevation="2">
        <v-card-text>
          <h2 class="text-h5 font-weight-bold">Bienvenido {{ user?.nombre || '?' }} ({{ user?.rol?.nombre || '?' }})</h2>
          <p class="mt-2">Joven Club: <strong>{{ user?.jc?.nombre || 'No asignado' }}</strong></p>
          <p class="mt-2" style="color: red;" v-if="!user?.jc?.id">
            ⚠️ ATENCIÓN: Este usuario no tiene un Joven Club asignado. Contacte al administrador.
          </p>
        </v-card-text>
      </v-card>
  
      <!-- Tarjetas de totales (solo si tiene JC) -->
      <template v-if="user?.jc?.id">
        <v-row>
          <v-col cols="12" md="4">
            <v-card style="background-color: #FFF9C4" elevation="6" @click="irAComputadoras">
              <v-card-text class="text-center">
                <v-icon x-large color="primary">mdi-laptop</v-icon>
                <h3 class="mt-2">Computadoras</h3>
                <p class="text-h4 font-weight-bold">{{ totalComputadoras }}</p>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-card style="background-color: #FFF9C4" elevation="6" @click="irAInstructores">
              <v-card-text class="text-center">
                <v-icon x-large color="primary">mdi-account-group</v-icon>
                <h3 class="mt-2">Instructores</h3>
                <p class="text-h4 font-weight-bold">{{ totalInstructores }}</p>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-card style="background-color: #FFF9C4" elevation="6" @click="irASupervisiones">
              <v-card-text class="text-center">
                <v-icon x-large color="primary">mdi-clipboard-list</v-icon>
                <h3 class="mt-2">Supervisiones</h3>
                <p class="text-h4 font-weight-bold">{{ totalSupervisiones }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Botones de acción rápida -->
        <v-row class="mt-4">
          <v-col cols="12" md="4">
            <v-btn block color="primary" dark @click="irAComputadoras">
              <v-icon left>mdi-laptop</v-icon>
              Gestionar Computadoras
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn block color="primary" dark @click="irAInstructores">
              <v-icon left>mdi-account-group</v-icon>
              Gestionar Instructores
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn block color="info" dark @click="irASupervisiones">
              <v-icon left>mdi-clipboard-list</v-icon>
              Ver Supervisiones
            </v-btn>
          </v-col>
        </v-row>
      </template>
  
      <!-- Mensaje si no tiene JC -->
      <v-card v-else class="mt-4" style="background-color: #FFEBEE" elevation="2">
        <v-card-text class="text-center">
          <v-icon x-large color="error">mdi-alert</v-icon>
          <h3 class="mt-2">No tiene Joven Club asignado</h3>
          <p>Por favor, contacte al administrador para que le asigne un Joven Club.</p>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
  
    data: () => ({
      totalComputadoras: 0,
      totalInstructores: 0,
      totalSupervisiones: 0
    }),
  
    computed: {
      user() {
        return this.$store.state.auth.user;
      },
      jcId() {
        return this.user?.jc?.id;
      }
    },
  
    async created() {
      console.log('=== DASHBOARD ADMINJC ===');
      console.log('Usuario:', this.user);
      console.log('JC ID:', this.jcId);
      
      if (this.jcId) {
        await this.cargarTotales();
      } else {
        console.error('ERROR: El usuario no tiene JC asignado');
      }
    },
  
    methods: {
      async cargarTotales() {
        try {
          // Cargar computadoras
          const urlPcs = `api/pcs/by_joven_club/${this.jcId}`;
          console.log('Cargando PCs desde:', urlPcs);
          const { data: pcs } = await this.$axios.get(urlPcs);
          this.totalComputadoras = pcs?.length || 0;
  
          // Cargar instructores
          const urlUsuarios = `api/usuarios/by_joven_club/${this.jcId}`;
          console.log('Cargando instructores desde:', urlUsuarios);
          const { data: usuarios } = await this.$axios.get(urlUsuarios);
          this.totalInstructores = usuarios?.length || 0;
  
          // Cargar supervisiones
          const urlAccesos = `api/accesos/by_joven_club/${this.jcId}`;
          console.log('Cargando supervisiones desde:', urlAccesos);
          const { data: accesos } = await this.$axios.get(urlAccesos);
          this.totalSupervisiones = accesos?.length || 0;
          
        } catch (error) {
          console.error('Error cargando totales:', error);
        }
      },
  
      irAComputadoras() {
        this.$router.push('/pc');
      },
  
      irAInstructores() {
        this.$router.push('/user');
      },
  
      irASupervisiones() {
        this.$router.push('/reportepc');
      }
    }
  };
  </script>
  
  <style scoped>
  .v-card {
    cursor: pointer;
    transition: transform 0.2s;
  }
  .v-card:hover {
    transform: translateY(-5px);
  }
  </style>