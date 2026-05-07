<template>
    <div>
      <v-card class="mb-4" style="background-color:#FFF9C4" elevation="2">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" sm="3"><span style="color:#0D47A1;"><v-icon color="#0D47A1">mdi-filter</v-icon> Filtrar por JC:</span></v-col>
            <v-col cols="12" sm="5"><v-select v-model="jcSeleccionado" :items="listaJCs" item-text="nombre" item-value="id" label="Todos" outlined dense clearable @change="cargarTrazas"></v-select></v-col>
            <v-col cols="12" sm="2"><v-btn color="#0D47A1" dark @click="cargarTrazas" block><v-icon left>mdi-refresh</v-icon>Actualizar</v-btn></v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <v-data-table style="background-color:#FFF9C4" :headers="headers" :items="trazas" :items-per-page="20" class="elevation-1" :loading="cargando" sort-by="fecha" sort-desc>
        <template v-slot:top><v-toolbar color="#0D47A1" dark flat><v-toolbar-title><v-icon left>mdi-history</v-icon>Trazas</v-toolbar-title></v-toolbar></template>
        <template v-slot:item.fecha="{ item }">{{ formatearFecha(item.fecha) }}</template>
        <template v-slot:item.accion="{ item }"><v-chip :color="getColorAccion(item.accion)" dark small>{{ item.accion }}</v-chip></template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({
      cargando: false, trazas: [], listaJCs: [], jcSeleccionado: null,
      headers: [
        { text: 'Fecha', value: 'fecha', width: '15%' },
        { text: 'Usuario', value: 'usuarioEmail', width: '18%' },
        { text: 'Rol', value: 'usuarioRol', width: '12%' },
        { text: 'Acción', value: 'accion', width: '10%' },
        { text: 'Entidad', value: 'entidad', width: '12%' },
        { text: 'Nombre', value: 'entidadNombre', width: '25%' }
      ]
    }),
    async created() { await this.cargarJCs(); await this.cargarTrazas(); },
    methods: {
      formatearFecha(f) { if (!f) return '-'; const d = new Date(f); return d.toLocaleString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); },
      getColorAccion(a) { const c = { 'CREATE':'success','UPDATE':'warning','DELETE':'error','LOGIN':'info' }; return c[a] || 'grey'; },
      async cargarJCs() { try { const { data } = await this.$axios.get('api/jcs'); this.listaJCs = data; } catch (e) { console.error(e); } },
      async cargarTrazas() { this.cargando = true; try { let url = 'api/trazas?limit=100'; if (this.jcSeleccionado) url += `&jcId=${this.jcSeleccionado}`; const { data } = await this.$axios.get(url); console.log('Trazas:', data); this.trazas = data; } catch (e) { console.error(e); } finally { this.cargando = false } }
    }
  }
  </script>