<template>
    <div>
      <!-- Título de bienvenida -->
      <v-card class="mb-4 text-center" style="background-color: #FFF9C4" elevation="2">
        <v-card-text>
          <h2 class="text-h5 font-weight-bold">Bienvenido {{ user?.nombre || '' }} ({{ user?.rol?.nombre || '' }})</h2>
        </v-card-text>
      </v-card>
  
      <!-- Selector de Joven Club -->
      <v-card class="mb-4" style="background-color: #FFF9C4" elevation="2">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" sm="3" class="text-center">
              <span class="font-weight-bold">Seleccionar Joven Club:</span>
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
                @change="cargarComputadoras"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Tabla de Computadoras -->
      <v-data-table
        style="background-color: #FFF9C4"
        :headers="headers"
        :items="computadoras"
        :items-per-page="20"
        sort-by="nombre"
        class="elevation-1"
        :loading="cargando"
      >
        <template v-slot:top>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Computadoras</v-toolbar-title>
          </v-toolbar>
        </template>
  
        <template v-slot:item.actions="{ item }">
          <v-icon small fab @click="verDetalles(item)">mdi-eye</v-icon>
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
  
    data: () => ({
      cargando: false,
      computadoras: [],
      listaJCs: [],
      jcSeleccionado: null,
      headers: [
        { text: "Nombre", align: "start", sortable: true, value: "nombre", width: '25%' },
        { text: "Inventario", value: "numero", width: '15%' },
        { text: "IP", value: "ip", width: '15%' },
        { text: "Joven Club", value: "jc.nombre", width: '20%' },
        { text: "Acciones", value: "actions", sortable: false, width: '10%' }
      ]
    }),
  
    computed: {
      user() {
        return this.$store.state.auth.user;
      }
    },
  
    async created() {
      console.log('=== DASHBOARD SUPERVISOR CREADO ===');
      await this.cargarListaJCs();
      await this.cargarComputadoras();
    },
  
    methods: {
      async cargarListaJCs() {
        try {
          const { data } = await this.$axios.get('api/jcs');
          this.listaJCs = data;
          console.log('JCs cargados:', this.listaJCs.length);
        } catch (error) {
          console.error('Error cargando JCs:', error);
        }
      },
  
      async cargarComputadoras() {
        this.cargando = true;
        try {
          let url = 'api/pcs';
          if (this.jcSeleccionado) {
            url = `api/pcs/by_joven_club/${this.jcSeleccionado}`;
          }
          console.log('Cargando computadoras desde:', url);
          const { data } = await this.$axios.get(url);
          this.computadoras = data;
          console.log('Computadoras cargadas:', this.computadoras.length);
        } catch (error) {
          console.error('Error cargando computadoras:', error);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: 'Error al cargar las computadoras',
            color: 'error'
          });
        } finally {
          this.cargando = false;
        }
      },
  
      verDetalles(item) {
        this.$router.push(`/pc/${item.id}`);
      }
    }
  };
  </script>