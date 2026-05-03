<template>
    <div>
      <v-card class="text-center pa-4 mb-4" color="#CE1126" dark>
        <h2>Panel de Supervisor</h2>
        <p>Bienvenido {{ user?.nombre }} {{ user?.apellidos }} ({{ user?.rol?.nombre }})</p>
      </v-card>
  
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
                @change="cargarComputadoras"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
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
        { text: "Nombre", value: "nombre", width: '25%' },
        { text: "Inventario", value: "numero", width: '15%' },
        { text: "IP", value: "ip", width: '15%' },
        { text: "Joven Club", value: "jc.nombre", width: '20%' },
        { text: "Acciones", value: "actions", sortable: false, width: '10%' }
      ]
    }),
    computed: {
      user() {
        return this.$store.state.auth.user;
      },
      // Obtener token del store
      token() {
        return this.$store.state.auth.token;
      }
    },
    async created() {
      console.log('Token actual:', this.token);
      await this.cargarJCs();
      await this.cargarComputadoras();
    },
    methods: {
      // Método para obtener headers con token
      getHeaders() {
        const token = this.token;
        if (token) {
          return { headers: { 'Authorization': `Bearer ${token}` } };
        }
        return {};
      },
      async cargarJCs() {
        try {
          const config = this.getHeaders();
          console.log('Headers para JCs:', config);
          const { data } = await this.$axios.get('api/jcs', config);
          this.listaJCs = data;
          console.log('JCs cargados:', this.listaJCs.length);
        } catch (error) {
          console.error('Error cargando JCs - Detalle:', error.response || error);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: `Error: ${error.response?.data?.message || error.message}`,
            color: 'error'
          });
        }
      },
      async cargarComputadoras() {
        this.cargando = true;
        try {
          let url = 'api/pcs';
          if (this.jcSeleccionado) {
            url = `api/pcs/by_joven_club/${this.jcSeleccionado}`;
          }
          const config = this.getHeaders();
          console.log('URL:', url);
          console.log('Headers:', config);
          const { data } = await this.$axios.get(url, config);
          this.computadoras = data;
          console.log('Computadoras cargadas:', this.computadoras.length);
        } catch (error) {
          console.error('Error cargando computadoras - Detalle:', error.response || error);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: `Error: ${error.response?.data?.message || error.message}`,
            color: 'error'
          });
        } finally {
          this.cargando = false;
        }
      },
      verDetalles(item) {
        this.$router.push(`/supervisor/pc/${item.id}`);
      }
    }
  };
  </script>