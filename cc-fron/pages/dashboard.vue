<template>
    <div>
      <v-card class="mb-4 text-center" style="background-color: #FFF9C4" elevation="3">
        <v-card-text>
          <h2 class="text-h4 font-weight-bold mb-2" style="color: #0D47A1;">Sistema de Gestión de Inventarios</h2>
          <p class="text-h6" style="color: #0D47A1;">Bienvenido, <strong>{{ user?.nombre }} {{ user?.apellidos }}</strong></p>
          <p style="color: #0D47A1;">Joven Club Las Tunas</p>
        </v-card-text>
      </v-card>
  
      <v-row>
        <v-col cols="12" md="4">
          <v-card style="background-color: #FFF9C4; cursor: pointer;" elevation="6" @click="$router.push('/computadoras')" class="dashboard-card">
            <v-card-text class="text-center">
              <v-icon x-large color="#0D47A1">mdi-laptop</v-icon>
              <h3 class="mt-2" style="color: #0D47A1;">Computadoras</h3>
              <p class="text-h3 font-weight-bold" style="color: #0D47A1;">{{ totalComputadoras }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card style="background-color: #FFF9C4; cursor: pointer;" elevation="6" @click="$router.push('/inventario')" class="dashboard-card">
            <v-card-text class="text-center">
              <v-icon x-large color="#0D47A1">mdi-package-variant</v-icon>
              <h3 class="mt-2" style="color: #0D47A1;">Inventario General</h3>
              <p class="text-h3 font-weight-bold" style="color: #0D47A1;">{{ totalInventario }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card style="background-color: #FFF9C4; cursor: pointer;" elevation="6" @click="$router.push('/trazas')" class="dashboard-card">
            <v-card-text class="text-center">
              <v-icon x-large color="#0D47A1">mdi-history</v-icon>
              <h3 class="mt-2" style="color: #0D47A1;">Trazas</h3>
              <p class="text-h3 font-weight-bold" style="color: #0D47A1;">{{ totalTrazas }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({ totalComputadoras: 0, totalInventario: 0, totalTrazas: 0 }),
    computed: {
      user() {
        if (process.client) {
          const u = localStorage.getItem('user')
          return u ? JSON.parse(u) : null
        }
        return null
      }
    },
    async created() {
      try {
        const { data: pcs } = await this.$axios.get('api/pcs')
        this.totalComputadoras = pcs?.length || 0
        const { data: inv } = await this.$axios.get('api/inventario')
        this.totalInventario = inv?.length || 0
        const { data: trazas } = await this.$axios.get('api/trazas?limit=100')
        this.totalTrazas = trazas?.length || 0
      } catch (error) { console.error('Error cargando totales:', error) }
    }
  }
  </script>
  
  <style scoped>
  .dashboard-card { transition: transform 0.3s ease; }
  .dashboard-card:hover { transform: translateY(-8px); }
  </style>