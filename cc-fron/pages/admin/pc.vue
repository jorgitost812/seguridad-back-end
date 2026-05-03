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
            <v-toolbar-title>Computadoras (Todos los JC)</v-toolbar-title>
          </v-toolbar>
        </template>
  
        <!-- SIN acciones - Solo lectura -->
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({
      cargando: false,
      computadoras: [],
      listaJCs: [],
      jcSeleccionado: null,
      headers: [
        { text: "Nombre", value: "nombre", width: '20%' },
        { text: "Inventario", value: "numero", width: '15%' },
        { text: "IP", value: "ip", width: '15%' },
        { text: "Joven Club", value: "jc.nombre", width: '20%' }
        // ❌ Sin columna de acciones
      ]
    }),
    computed: {
      user() { return this.$store.state.auth.user; }
    },
    async created() {
      await this.cargarJCs();
      await this.cargarComputadoras();
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
      async cargarComputadoras() {
        this.cargando = true;
        try {
          let url = 'api/pcs';
          if (this.jcSeleccionado) {
            url = `api/pcs/by_joven_club/${this.jcSeleccionado}`;
          }
          const { data } = await this.$axios.get(url);
          this.computadoras = data;
        } catch (error) {
          console.error('Error cargando computadoras:', error);
        } finally {
          this.cargando = false;
        }
      }
    }
  };
  </script>