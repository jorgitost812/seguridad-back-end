<template>
    <v-data-table style="background-color: #fff9c4" :headers="headers" :items="filteredAccesos" sort-by="id" class="elevation-5" :loading="loading">
      <template v-slot:top>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Accesos a las contraseñas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn small class="ml-2" color="primary" fab v-bind="attrs" v-on="on"><v-icon>mdi-magnify</v-icon></v-btn>
              <v-spacer></v-spacer>
              <v-col cols="12" sm="6" md="4" align="right">
                <v-select class="dark" style="width: 45%" :items="municipios" label="Municipios" item-text="nombre" item-value="id" v-model="municipio"></v-select>
                <v-select class="dark" style="width: 45%" :items="jcs" label="Jclub" item-text="nombre" item-value="id" v-model="jcx"></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4" align="right">
                <v-select class="dark" style="width: 46%" :items="provincias" label="Provincia" item-text="nombre" item-value="id" v-model="provincia"></v-select>
              </v-col>
            </template>
            <v-card>
              <v-card-title>Filtro</v-card-title>
              <v-card-text>
                <v-text-field v-model="editedItem.nombrejc" label="Nombre JC"></v-text-field>
                <v-text-field v-model="editedItem.nombrepc" label="Nombre PC"></v-text-field>
                <v-text-field v-model="editedItem.inventario" label="Inventario"></v-text-field>
                <v-text-field v-model="editedItem.supervisor" label="Supervisor"></v-text-field>
                <v-text-field v-model="editedItem.tecnico" label="Técnico"></v-text-field>
                <v-select v-model="causa" :items="states" label="Causa"></v-select>
              </v-card-text>
              <v-card-actions><v-spacer></v-spacer><v-btn text @click="close">Cancelar</v-btn><v-btn text @click="initialize">Buscar</v-btn></v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
    </v-data-table>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({
      filteredAccesos: [], allAccesos: [], loading: false, dialog: false, jcx: null, municipio: null, provincia: null,
      states: ["Todos", "Mantenimiento", "Supervisión"], causa: "Todos",
      editedItem: { nombrejc: "", nombrepc: "", inventario: "", supervisor: "", tecnico: "" },
      headers: [{ text: 'JC', value: 'nombrejc' }, { text: 'PC', value: 'nombrepc' }, { text: 'Técnico', value: 'tecnico' }, { text: 'Supervisor', value: 'supervisor' }, { text: 'Causa', value: 'causa' }, { text: 'Fecha', value: 'displayDate' }]
    }),
    computed: { user() { return this.$store.state.auth.user; }, jcs() { return this.$store.state.jcs.list; }, municipios() { return this.$store.state.municipios.list; }, provincias() { return this.$store.state.provincias.list; } },
    async created() { await this.initialize(); },
    methods: {
      lee_fecha(val) { if (!val) return ''; const d = new Date(val); return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`; },
      async initialize() { this.loading = true; const { data } = await this.$axios.get('api/accesos'); this.allAccesos = data; this.filteredAccesos = data.map(a => ({ ...a, displayDate: this.lee_fecha(a.createdAt) })); this.loading = false; },
      close() { this.dialog = false; }
    }
  };
  </script>