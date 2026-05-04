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
                @change="cargarTrazas"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-btn color="primary" @click="cargarTrazas" block>
                <v-icon left>mdi-refresh</v-icon>
                Actualizar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Tabla de Trazas -->
      <v-data-table
        style="background-color: #FFF9C4"
        :headers="headers"
        :items="trazas"
        :items-per-page="20"
        class="elevation-1"
        :loading="cargando"
      >
        <template v-slot:top>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Últimas operaciones del sistema</v-toolbar-title>
          </v-toolbar>
        </template>
  
        <template v-slot:item.fecha="{ item }">
          {{ formatearFecha(item.fecha) }}
        </template>
  
        <template v-slot:item.usuario_email="{ item }">
          {{ item.usuarioEmail || item.usuario_email || '-' }}
        </template>
  
        <template v-slot:item.usuario_rol="{ item }">
          {{ item.usuarioRol || item.usuario_rol || '-' }}
        </template>
  
        <template v-slot:item.accion="{ item }">
          <v-chip :color="getColorAccion(item.accion)" dark small>
            {{ item.accion }}
          </v-chip>
        </template>
  
        <template v-slot:item.entidad_nombre="{ item }">
          {{ item.entidadNombre || item.entidad_nombre || '-' }}
        </template>
  
        <template v-slot:item.jc_id="{ item }">
          {{ item.jcId || item.jc_id || '-' }}
        </template>
  
        <template v-slot:item.detalles="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on" color="info">mdi-information</v-icon>
            </template>
            <pre style="font-size: 10px;">{{ JSON.stringify(item.detalles || {}, null, 2) }}</pre>
          </v-tooltip>
        </template>
  
        <template v-slot:no-data>
          <div class="text-center pa-4">
            No hay trazas registradas
          </div>
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({
      cargando: false,
      trazas: [],
      listaJCs: [],
      jcSeleccionado: null,
      headers: [
        { text: "Fecha", value: "fecha", width: "15%" },
        { text: "Usuario", value: "usuario_email", width: "12%" },
        { text: "Rol", value: "usuario_rol", width: "10%" },
        { text: "Acción", value: "accion", width: "8%" },
        { text: "Entidad", value: "entidad", width: "10%" },
        { text: "Nombre", value: "entidad_nombre", width: "20%" },
        { text: "JC ID", value: "jc_id", width: "8%" },
        { text: "Detalles", value: "detalles", width: "10%", sortable: false }
      ]
    }),
    computed: {
      user() {
        return this.$store.state.auth.user
      }
    },
    async created() {
      console.log('=== TRAZAS PAGE CREATED ===')
      await this.cargarJCs()
      await this.cargarTrazas()
    },
    methods: {
      formatearFecha(fecha) {
        if (!fecha) return '-'
        const d = new Date(fecha)
        return d.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      },
      getColorAccion(accion) {
        const colores = {
          'CREATE': 'success',
          'UPDATE': 'warning',
          'DELETE': 'error',
          'LOGIN': 'info',
          'AUTORIZAR': 'primary'
        }
        return colores[accion] || 'grey'
      },
      async cargarJCs() {
        try {
          const { data } = await this.$axios.get('api/jcs')
          this.listaJCs = data
          console.log('JCs cargados:', this.listaJCs.length)
        } catch (error) {
          console.error('Error cargando JCs:', error)
        }
      },
      async cargarTrazas() {
        this.cargando = true
        try {
          let url = 'api/trazas?limit=50'
          if (this.jcSeleccionado) {
            url += `&jcId=${this.jcSeleccionado}`
          }
          console.log('Cargando trazas desde:', url)
          const { data } = await this.$axios.get(url)
          console.log('Datos recibidos del backend:', data)
          this.trazas = data
          console.log('Trazas cargadas:', this.trazas.length)
          if (this.trazas.length > 0) {
            console.log('Primera traza:', this.trazas[0])
          }
        } catch (error) {
          console.error('Error cargando trazas:', error)
          this.$store.commit('alert/setAlert', {
            status: true,
            message: 'Error al cargar las trazas',
            color: 'error'
          })
        } finally {
          this.cargando = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .v-chip {
    font-size: 10px;
  }
  </style>