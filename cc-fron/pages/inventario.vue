<template>
    <div>
      <v-data-table style="background-color:#FFF9C4" :headers="headers" :items="items" :items-per-page="10" class="elevation-1" :loading="loading">
        <template v-slot:top>
          <v-toolbar color="#0D47A1" dark flat>
            <v-toolbar-title><v-icon left>mdi-package-variant</v-icon>Inventario</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn small color="#FFC107" fab @click="abrirDialogNuevo"><v-icon>mdi-plus</v-icon></v-btn>
            <v-col cols="12" sm="6" md="4">
              <v-select v-model="jcFiltro" :items="listaJCs" item-text="nombre" item-value="id" label="Filtrar por JC" outlined dense clearable dark @change="cargarInventario" style="margin-top:20px;"></v-select>
            </v-col>
            <v-spacer></v-spacer>
          </v-toolbar>
  
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title style="background-color:#0D47A1;color:white;"><span class="text-h5">{{ dialogTitulo }}</span></v-card-title>
              <v-card-text style="background-color:#FFF9C4;">
                <v-container>
                  <v-row>
                    <v-col cols="12"><v-text-field v-model="formItem.nombre" label="Nombre *" required outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-select v-model="formItem.estado" :items="estados" label="Estado *" required outlined dense></v-select></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model.number="formItem.precio" label="Precio *" type="number" prefix="$" required outlined dense></v-text-field></v-col>
                    <v-col cols="12"><v-select v-model="formItem.jcId" :items="listaJCs" item-text="nombre" item-value="id" label="Ubicación *" required outlined dense></v-select></v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions style="background-color:#0D47A1;"><v-spacer></v-spacer><v-btn color="#FFC107" text @click="cerrarDialog">Cancelar</v-btn><v-btn color="#FFC107" text @click="guardarItem">Guardar</v-btn></v-card-actions>
            </v-card>
          </v-dialog>
  
          <v-dialog v-model="dialogEliminar" max-width="400px">
            <v-card>
              <v-card-title style="background-color:#0D47A1;color:white;">¿Estás seguro?</v-card-title>
              <v-card-text style="background-color:#FFF9C4;">¿Eliminar <strong>{{ itemAEliminar?.nombre }}</strong>?</v-card-text>
              <v-card-actions style="background-color:#0D47A1;"><v-spacer></v-spacer><v-btn color="#FFC107" text @click="dialogEliminar=false">Cancelar</v-btn><v-btn color="red" text @click="confirmarEliminar">Eliminar</v-btn></v-card-actions>
            </v-card>
          </v-dialog>
        </template>
  
        <template v-slot:item.estado="{ item }"><v-chip :color="getColorEstado(item.estado)" dark small>{{ item.estado }}</v-chip></template>
        <template v-slot:item.precio="{ item }">$ {{ Number(item.precio).toFixed(2) }}</template>
        <template v-slot:item.ubicacion="{ item }">{{ item.ubicacion?.nombre || '-' }}</template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editarItem(item)" color="#0D47A1">mdi-pencil</v-icon>
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
      itemAEliminar: null, jcFiltro: null, listaJCs: [], items: [],
      estados: ['Excelente','Bueno','Regular','Malo','Descompuesto'],
      formItem: { nombre: '', estado: 'Bueno', precio: 0, jcId: null },
      headers: [
        { text: 'ID', value: 'id', width: '8%' },
        { text: 'Nombre', value: 'nombre', width: '25%' },
        { text: 'Estado', value: 'estado', width: '15%' },
        { text: 'Precio', value: 'precio', width: '12%' },
        { text: 'Ubicación', value: 'ubicacion', width: '20%' },
        { text: 'Acciones', value: 'actions', sortable: false, width: '15%' }
      ]
    }),
    async created() { await this.cargarJCs(); await this.cargarInventario(); },
    methods: {
      async cargarJCs() { try { const { data } = await this.$axios.get('api/jcs'); this.listaJCs = data; } catch (e) { console.error(e); } },
      async cargarInventario() {
        this.loading = true
        try { let url = 'api/inventario'; if (this.jcFiltro) url = `api/inventario/jc/${this.jcFiltro}`; const { data } = await this.$axios.get(url); this.items = data; }
        catch (e) { this.$store.commit('alert/setAlert', { status: true, message: 'Error', color: 'error' }); }
        finally { this.loading = false }
      },
      abrirDialogNuevo() { this.dialogTitulo = 'Agregar'; this.editandoId = null; this.formItem = { nombre: '', estado: 'Bueno', precio: 0, jcId: null }; this.dialog = true },
      editarItem(item) { this.dialogTitulo = 'Editar'; this.editandoId = item.id; this.formItem = { nombre: item.nombre, estado: item.estado, precio: item.precio, jcId: item.ubicacion?.id }; this.dialog = true },
      cerrarDialog() { this.dialog = false },
      async guardarItem() {
        if (!this.formItem.nombre || !this.formItem.jcId) { this.$store.commit('alert/setAlert', { status: true, message: 'Nombre y ubicación obligatorios', color: 'error' }); return }
        try {
          const p = { nombre: this.formItem.nombre, estado: this.formItem.estado, precio: parseFloat(this.formItem.precio) || 0, jcId: this.formItem.jcId }
          if (this.editandoId) { await this.$axios.put(`api/inventario/${this.editandoId}`, p) } else { await this.$axios.post('api/inventario', p) }
          this.$store.commit('alert/setAlert', { status: true, message: 'Guardado', color: 'success' })
          this.cerrarDialog(); await this.cargarInventario()
        } catch (e) { this.$store.commit('alert/setAlert', { status: true, message: 'Error', color: 'error' }) }
      },
      abrirDialogEliminar(item) { this.itemAEliminar = item; this.dialogEliminar = true },
      async confirmarEliminar() { try { await this.$axios.delete(`api/inventario/${this.itemAEliminar.id}`); this.dialogEliminar = false; await this.cargarInventario(); } catch (e) {} },
      getColorEstado(e) { const c = { 'Excelente': 'success', 'Bueno': 'info', 'Regular': 'warning', 'Malo': 'orange', 'Descompuesto': 'error' }; return c[e] || 'grey'; }
    }
  }
  </script>