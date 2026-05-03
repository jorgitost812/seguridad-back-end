<template>
    <v-data-table style="background-color: #fff9c4" :headers="headers" :items="filteredAccesos" sort-by="id" class="elevation-5" :loading="loading">
      <template v-slot:top>
        <v-toolbar color="primary" dark flat><v-toolbar-title>Accesos a las contraseñas</v-toolbar-title></v-toolbar>
      </template>
    </v-data-table>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
    data: () => ({ filteredAccesos: [], allAccesos: [], loading: false, headers: [{ text: 'JC', value: 'nombrejc' }, { text: 'PC', value: 'nombrepc' }, { text: 'Técnico', value: 'tecnico' }, { text: 'Supervisor', value: 'supervisor' }, { text: 'Causa', value: 'causa' }, { text: 'Fecha', value: 'displayDate' }] }),
    computed: { user() { return this.$store.state.auth.user; }, jc() { return this.user?.jc; } },
    async created() { await this.initialize(); },
    methods: {
      lee_fecha(val) { if (!val) return ''; const d = new Date(val); return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`; },
      async initialize() { this.loading = true; const { data } = await this.$axios.get('api/accesos'); this.allAccesos = data; if (this.jc) this.filteredAccesos = data.filter(a => a.nombrejc === this.jc.nombre).map(a => ({ ...a, displayDate: this.lee_fecha(a.createdAt) })); else this.filteredAccesos = data.map(a => ({ ...a, displayDate: this.lee_fecha(a.createdAt) })); this.loading = false; }
    }
  };
  </script>