<template>
    <div>
      <v-data-table style="background-color: #FFF9C4" :headers="headers" :items="items" :items-per-page="10" class="elevation-1" :loading="loading">
        <template v-slot:top>
          <v-toolbar color="#0D47A1" dark flat>
            <v-toolbar-title><v-icon left>mdi-laptop</v-icon>Computadoras</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn small color="#FFC107" fab @click="abrirDialogNuevo"><v-icon>mdi-plus</v-icon></v-btn>
            <v-col cols="12" sm="6" md="4">
              <v-select v-model="jcFiltro" :items="listaJCs" item-text="nombre" item-value="id" label="Filtrar por Joven Club" outlined dense clearable dark @change="cargarComputadoras" style="margin-top:20px;"></v-select>
            </v-col>
            <v-spacer></v-spacer>
          </v-toolbar>
  
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title style="background-color:#0D47A1;color:white;"><span class="text-h5">{{ dialogTitulo }}</span></v-card-title>
              <v-card-text style="background-color:#FFF9C4;">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6"><v-text-field v-model="formPC.nombre" label="Nombre *" required outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="formPC.numero" label="N. Inventario *" required outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="formPC.ip" label="IP *" required outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-select v-model="formPC.jcId" :items="listaJCs" item-text="nombre" item-value="id" label="Joven Club *" required outlined dense></v-select></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="formPC.admin" type="password" label="Contraseña Admin" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="formPC.setup" type="password" label="Contraseña Setup" outlined dense></v-text-field></v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions style="background-color:#0D47A1;"><v-spacer></v-spacer><v-btn color="#FFC107" text @click="cerrarDialog">Cancelar</v-btn><v-btn color="#FFC107" text @click="guardarPC">Guardar</v-btn></v-card-actions>
            </v-card>
          </v-dialog>
  
          <v-dialog v-model="dialogEliminar" max-width="400px">
            <v-card>
              <v-card-title style="background-color:#0D47A1;color:white;">¿Estás seguro?</v-card-title>
              <v-card-text style="background-color:#FFF9C4;">¿Eliminar <strong>{{ pcAEliminar?.nombre }}</strong>?</v-card-text>
              <v-card-actions style="background-color:#0D47A1;"><v-spacer></v-spacer><v-btn color="#FFC107" text @click="dialogEliminar=false">Cancelar</v-btn><v-btn color="red" text @click="confirmarEliminar">Eliminar</v-btn></v-card-actions>
            </v-card>
          </v-dialog>
        </template>
  
        <template v-slot:item.ubicacion="{ item }">{{ item.jc?.nombre || '-' }}</template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editarPC(item)" color="#0D47A1">mdi-pencil</v-icon>
          <v-icon small @click="abrirDialogEliminar(item)" color="red">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({
      loading: false, dialog: false, dialogEliminar: false, dialogTitulo: '', editandoId: null,
      pcAEliminar: null, jcFiltro: null, listaJCs: [], items: [],
      formPC: { nombre: '', numero: '', ip: '', jcId: null, admin: '', setup: '' },
      headers: [
        { text: 'Inventario', value: 'numero', width: '15%' },
        { text: 'Nombre', value: 'nombre', width: '20%' },
        { text: 'IP', value: 'ip', width: '18%' },
        { text: 'Ubicación', value: 'ubicacion', width: '25%' },
        { text: 'Acciones', value: 'actions', sortable: false, width: '15%' }
      ]
    }),
    async created() { await this.cargarJCs(); await this.cargarComputadoras(); },
    methods: {
      async cargarJCs() { try { const { data } = await this.$axios.get('api/jcs'); this.listaJCs = data; } catch (e) { console.error(e); } },
      async cargarComputadoras() {
        this.loading = true
        try { let url = 'api/pcs'; if (this.jcFiltro) url = `api/pcs/by_joven_club/${this.jcFiltro}`; const { data } = await this.$axios.get(url); this.items = data; }
        catch (e) { this.$store.commit('alert/setAlert', { status: true, message: 'Error al cargar', color: 'error' }); }
        finally { this.loading = false }
      },
      abrirDialogNuevo() { this.dialogTitulo = 'Agregar'; this.editandoId = null; this.formPC = { nombre: '', numero: '', ip: '', jcId: null, admin: '', setup: '' }; this.dialog = true },
      editarPC(item) { this.dialogTitulo = 'Editar'; this.editandoId = item.id; this.formPC = { nombre: item.nombre, numero: item.numero, ip: item.ip, jcId: item.jc?.id, admin: '', setup: '' }; this.dialog = true },
      cerrarDialog() { this.dialog = false },
      async guardarPC() {
        if (!this.formPC.nombre || !this.formPC.numero || !this.formPC.ip || !this.formPC.jcId) { this.$store.commit('alert/setAlert', { status: true, message: 'Campos * obligatorios', color: 'error' }); return }
        try {
          const p = { nombre: this.formPC.nombre, numero: this.formPC.numero, ip: this.formPC.ip, jcId: this.formPC.jcId, admin: this.formPC.admin || '', setup: this.formPC.setup || '' }
          if (this.editandoId) { await this.$axios.put(`api/pcs/${this.editandoId}`, p) } else { await this.$axios.post('api/pcs', p) }
          this.$store.commit('alert/setAlert', { status: true, message: 'Guardado', color: 'success' })
          this.cerrarDialog(); await this.cargarComputadoras()
        } catch (e) { this.$store.commit('alert/setAlert', { status: true, message: 'Error', color: 'error' }) }
      },
      abrirDialogEliminar(item) { this.pcAEliminar = item; this.dialogEliminar = true },
      async confirmarEliminar() { try { await this.$axios.delete(`api/pcs/${this.pcAEliminar.id}`); this.dialogEliminar = false; await this.cargarComputadoras(); } catch (e) {} }
    }
  }
  </script>