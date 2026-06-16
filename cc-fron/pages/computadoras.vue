<template>
  <div>
    <v-data-table style="background-color: #FFF9C4" :headers="headers" :items="items" :items-per-page="10" class="elevation-1" :loading="loading">
      <template v-slot:top>
        <v-toolbar color="#0D47A1" dark flat>
          <v-toolbar-title><v-icon left>mdi-laptop</v-icon>Computadoras - {{ jcNombre }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="#FFC107" @click="abrirDialogNuevo" class="mr-2">
            <v-icon left>mdi-plus</v-icon>Agregar Computadora
          </v-btn>
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
                  <v-col cols="12" sm="6"><v-text-field v-model="formPC.admin" type="password" label="Pass Admin" outlined dense></v-text-field></v-col>
                  <v-col cols="12" sm="6"><v-text-field v-model="formPC.setup" type="password" label="Pass Setup" outlined dense></v-text-field></v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions style="background-color:#0D47A1;"><v-spacer></v-spacer><v-btn color="#FFC107" text @click="cerrarDialog">Cancelar</v-btn><v-btn color="white" text @click="guardarPC">Guardar</v-btn></v-card-actions>
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

      <template v-slot:item.actions="{ item }">
        <v-btn icon small color="#0D47A1" @click="editarPC(item)" class="mr-1"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon small color="red" @click="abrirDialogEliminar(item)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  layout: 'default',
  data: () => ({
    loading: false, dialog: false, dialogEliminar: false, dialogTitulo: '', editandoId: null,
    pcAEliminar: null, items: [],
    formPC: { nombre: '', numero: '', ip: '', admin: '', setup: '' },
    headers: [
      { text: 'Inventario', value: 'numero', width: '20%' },
      { text: 'Nombre', value: 'nombre', width: '25%' },
      { text: 'IP', value: 'ip', width: '25%' },
      { text: 'Acciones', value: 'actions', sortable: false, width: '20%' }
    ]
  }),
  computed: {
    user() { if (process.client) return JSON.parse(localStorage.getItem('user') || 'null'); return null },
    jcNombre() { return this.user?.jc?.nombre || '' }
  },
  async created() { await this.cargarComputadoras(); },
  methods: {
    async cargarComputadoras() {
      this.loading = true
      try { const { data } = await this.$axios.get('api/pcs'); this.items = data; }
      catch (e) { console.error(e); }
      finally { this.loading = false }
    },
    abrirDialogNuevo() { this.dialogTitulo = 'Agregar Computadora'; this.editandoId = null; this.formPC = { nombre: '', numero: '', ip: '', admin: '', setup: '' }; this.dialog = true },
    editarPC(item) { this.dialogTitulo = 'Editar Computadora'; this.editandoId = item.id; this.formPC = { nombre: item.nombre, numero: item.numero, ip: item.ip, admin: '', setup: '' }; this.dialog = true },
    cerrarDialog() { this.dialog = false },
    async guardarPC() {
      if (!this.formPC.nombre || !this.formPC.numero || !this.formPC.ip) { alert('Campos * obligatorios'); return }
      try {
        const p = { nombre: this.formPC.nombre, numero: this.formPC.numero, ip: this.formPC.ip, admin: this.formPC.admin || '', setup: this.formPC.setup || '' }
        if (this.editandoId) { await this.$axios.put(`api/pcs/${this.editandoId}`, p) } else { await this.$axios.post('api/pcs', p) }
        this.cerrarDialog(); await this.cargarComputadoras()
      } catch (e) { alert('Error al guardar') }
    },
    abrirDialogEliminar(item) { this.pcAEliminar = item; this.dialogEliminar = true },
    async confirmarEliminar() { try { await this.$axios.delete(`api/pcs/${this.pcAEliminar.id}`); this.dialogEliminar = false; await this.cargarComputadoras(); } catch (e) { alert('Error al eliminar') } }
  }
}
</script>