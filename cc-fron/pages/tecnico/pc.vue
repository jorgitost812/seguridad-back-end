<template>
    <div>
      <v-card class="mb-4 text-right" color="#FFF9C4" elevation="2"><v-card-text><v-btn color="primary" dark @click="abrirDialogNuevo"><v-icon left>mdi-plus</v-icon>Agregar Computadora</v-btn></v-card-text></v-card>
      <v-data-table style="background-color: #FFF9C4" :headers="headers" :items="computadoras" :loading="cargando" class="elevation-1">
        <template v-slot:item.actions="{ item }"><v-icon small class="mr-2" @click="editarComputadora(item)">mdi-pencil</v-icon><v-icon small @click="eliminarComputadora(item)">mdi-delete</v-icon></template>
      </v-data-table>
      <v-dialog v-model="dialog" max-width="600px">
        <v-card><v-card-title>{{ dialogTitulo }}</v-card-title><v-card-text><v-text-field v-model="form.numero" label="N. Inventario"></v-text-field><v-text-field v-model="form.nombre" label="Nombre"></v-text-field><v-text-field v-model="form.ip" label="IP"></v-text-field><v-text-field v-model="form.setup" label="Pass Setup" type="password"></v-text-field><v-text-field v-model="form.admin" label="Pass Admin" type="password"></v-text-field></v-card-text><v-card-actions><v-spacer></v-spacer><v-btn text @click="dialog=false">Cancelar</v-btn><v-btn text @click="guardar">Guardar</v-btn></v-card-actions></v-card>
      </v-dialog>
      <v-dialog v-model="dialogEliminar" max-width="400px"><v-card><v-card-title>¿Eliminar {{ pcAEliminar?.nombre }}?</v-card-title><v-card-actions><v-spacer></v-spacer><v-btn text @click="dialogEliminar=false">Cancelar</v-btn><v-btn text @click="confirmarEliminar">Eliminar</v-btn></v-card-actions></v-card></v-dialog>
    </div>
  </template>
  
  <script>
  import { encrypt } from '@/helpers/crypto.helper';
  export default {
    layout: 'usuario',
    data: () => ({ cargando: false, computadoras: [], dialog: false, dialogEliminar: false, dialogTitulo: '', editandoId: null, pcAEliminar: null, form: { numero: '', nombre: '', ip: '', setup: '', admin: '' }, headers: [{ text: "Nombre", value: "nombre" }, { text: "Inventario", value: "numero" }, { text: "IP", value: "ip" }, { text: "Acciones", value: "actions", sortable: false }] }),
    computed: { user() { return this.$store.state.auth.user; }, jcId() { return this.user?.jc?.id; } },
    async created() { await this.cargarComputadoras(); },
    methods: {
      async cargarComputadoras() { if (!this.jcId) return; this.cargando = true; const { data } = await this.$axios.get(`api/pcs/by_joven_club/${this.jcId}`); this.computadoras = data; this.cargando = false; },
      abrirDialogNuevo() { this.dialogTitulo = 'Agregar Computadora'; this.editandoId = null; this.form = { numero: '', nombre: '', ip: '', setup: '', admin: '' }; this.dialog = true; },
      editarComputadora(item) { this.dialogTitulo = 'Editar Computadora'; this.editandoId = item.id; this.form = { numero: item.numero, nombre: item.nombre, ip: item.ip, setup: '', admin: '' }; this.dialog = true; },
      eliminarComputadora(item) { this.pcAEliminar = item; this.dialogEliminar = true; },
      async guardar() { const datos = { nombre: this.form.nombre, numero: this.form.numero, ip: this.form.ip || '', jc: this.jcId }; if (this.form.admin) datos.pwd = encrypt(this.form.admin); if (this.form.setup) datos.setupPwd = encrypt(this.form.setup); if (this.editandoId) await this.$axios.put(`api/pcs/${this.editandoId}`, datos); else await this.$axios.post('api/pcs', datos); await this.cargarComputadoras(); this.dialog = false; },
      async confirmarEliminar() { await this.$axios.delete(`api/pcs/${this.pcAEliminar.id}`); await this.cargarComputadoras(); this.dialogEliminar = false; }
    }
  };
  </script>