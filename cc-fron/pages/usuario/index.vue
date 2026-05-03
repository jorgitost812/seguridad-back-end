<template>
    <div>
      <v-card class="text-center pa-4 mb-4" color="primary" dark><h2>Bienvenido {{ user?.nombre }} {{ user?.apellidos }}</h2></v-card>
      <v-card class="mb-4" color="#FFF9C4" elevation="2"><v-card-text><v-row align="center"><v-col cols="12" sm="3" class="text-center">Seleccionar Joven Club:</v-col><v-col cols="12" sm="6"><v-select v-model="jcSeleccionado" :items="listaJCs" item-text="nombre" item-value="id" label="Joven Club" outlined dense clearable @change="cargarInstructores"></v-select></v-col></v-row></v-card-text></v-card>
      <v-data-table style="background-color: #FFF9C4" :headers="headers" :items="instructores" :loading="cargando" class="elevation-1">
        <template v-slot:item.grupo_municipal="{ item }">{{ item.grupo_municipal ? 'Sí' : 'No' }}</template>
        <template v-slot:item.actions><v-icon small color="grey">mdi-eye</v-icon></template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
    data: () => ({ cargando: false, instructores: [], listaJCs: [], jcSeleccionado: null, headers: [{ text: "Nombre", value: "nombre" }, { text: "Apellidos", value: "apellidos" }, { text: "Correo", value: "email" }, { text: "J. Club", value: "jc.nombre" }, { text: "G. Municipal", value: "grupo_municipal" }, { text: "Rol", value: "rol.nombre" }, { text: "Acciones", value: "actions", sortable: false }] }),
    computed: { user() { return this.$store.state.auth.user; } },
    async created() { await this.cargarJCs(); await this.cargarInstructores(); },
    methods: {
      async cargarJCs() { const { data } = await this.$axios.get('api/jcs'); this.listaJCs = data; if (this.user?.jc?.id) this.jcSeleccionado = this.user.jc.id; else if (data.length) this.jcSeleccionado = data[0].id; },
      async cargarInstructores() { if (!this.jcSeleccionado) return; this.cargando = true; const { data } = await this.$axios.get(`api/usuarios/by_joven_club/${this.jcSeleccionado}`); this.instructores = data; this.cargando = false; }
    }
  };
  </script>