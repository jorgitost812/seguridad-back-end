<template><div class="text-center pa-10"><v-progress-circular indeterminate color="primary"></v-progress-circular><p class="mt-4">Redirigiendo...</p></div></template>
<script>
export default {
  async mounted() {
    await this.$nextTick();
    let user = this.$store.state.auth.user;
    if (!user) { const storedUser = localStorage.getItem('user'); if (storedUser) user = JSON.parse(storedUser); }
    if (!user || !user.rol) { this.$router.replace('/login'); return; }
    const rol = user.rol.nombre;
    if (rol === 'Administrador' || rol === 'AdministradorProv') this.$router.replace('/admin');
    else if (rol === 'AdministradorJC') this.$router.replace('/adminjc');
    else if (rol === 'Supervisor') this.$router.replace('/supervisor');
    else if (rol === 'Técnico') this.$router.replace('/tecnico');
    else if (rol === 'usuario') this.$router.replace('/usuario');
    else this.$router.replace('/admin');
  }
};
</script>