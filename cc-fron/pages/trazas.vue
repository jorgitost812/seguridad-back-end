<template>
  <div>
    <v-data-table style="background-color:#FFF9C4" :headers="headers" :items="trazas" :items-per-page="20" class="elevation-1" :loading="cargando" sort-by="fecha" sort-desc>
      <template v-slot:top>
        <v-toolbar color="#0D47A1" dark flat>
          <v-toolbar-title><v-icon left>mdi-history</v-icon>Trazas - {{ jcNombre }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="#FFC107" @click="cargarTrazas">
            <v-icon left>mdi-refresh</v-icon>Actualizar
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.fecha="{ item }">{{ formatearFecha(item.fecha) }}</template>
      <template v-slot:item.accion="{ item }"><v-chip :color="getColorAccion(item.accion)" dark small>{{ item.accion }}</v-chip></template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  layout: 'default',
  data: () => ({
    cargando: false, trazas: [],
    headers: [
      { text: 'Fecha', value: 'fecha', width: '15%' },
      { text: 'Usuario', value: 'usuarioEmail', width: '18%' },
      { text: 'Rol', value: 'usuarioRol', width: '12%' },
      { text: 'Acción', value: 'accion', width: '10%' },
      { text: 'Entidad', value: 'entidad', width: '12%' },
      { text: 'Nombre', value: 'entidadNombre', width: '25%' }
    ]
  }),
  computed: {
    user() { if (process.client) return JSON.parse(localStorage.getItem('user') || 'null'); return null },
    jcNombre() { return this.user?.jc?.nombre || '' }
  },
  async created() { await this.cargarTrazas(); },
  methods: {
    formatearFecha(f) { if (!f) return '-'; const d = new Date(f); return d.toLocaleString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); },
    getColorAccion(a) { const c = { 'CREATE':'success','UPDATE':'warning','DELETE':'error','LOGIN':'info' }; return c[a] || 'grey'; },
    async cargarTrazas() { this.cargando = true; try { const { data } = await this.$axios.get('api/trazas?limit=100'); this.trazas = data; } catch (e) { console.error(e); } finally { this.cargando = false } }
  }
}
</script>