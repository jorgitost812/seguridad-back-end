<template>
  <v-row align="center" justify="center"><v-col cols="12" sm="6" md="4"><v-card elevation="12"><v-toolbar color="accent"><v-toolbar-title>Cambio de Contraseña</v-toolbar-title></v-toolbar><v-card-text style="background-color: #FFF9C4"><v-form><v-text-field type="password" v-model="password" label="Nueva Contraseña"></v-text-field><v-text-field label="Confirmar contraseña" type="password" v-model="passwordc" required></v-text-field><v-btn color="blue darken-1" text @click="save">Guardar</v-btn></v-form></v-card-text></v-card></v-col></v-row>
</template>

<script>
export default {
  layout() { const user = this.$store.state.auth.user; return (user?.rol?.nombre === 'Administrador' || user?.rol?.nombre === 'AdministradorProv') ? 'default' : 'usuario'; },
  data: () => ({ password: '', passwordc: '' }),
  computed: { user() { return this.$store.state.auth.user; } },
  methods: {
    async save() {
      if (this.password !== this.passwordc) { this.$store.commit('alert/setAlert', { status: true, message: 'No coinciden', color: 'error' }); return; }
      try { await this.$axios.put(`api/usuarios/${this.user.id}`, { password: this.password }); this.$store.commit('alert/setAlert', { status: true, message: 'Contraseña actualizada', color: 'success' }); this.password = ''; this.passwordc = ''; }
      catch { this.$store.commit('alert/setAlert', { status: true, message: 'Error', color: 'error' }); }
    }
  }
};
</script>