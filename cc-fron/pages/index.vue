<template>
  <v-container class="fill-height" align-center justify-center>
    <v-row>
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4">Redirigiendo...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async mounted() {
    // Obtener usuario del store o localStorage
    let user = this.$store.state.auth.user;
    
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
        this.$store.commit('auth/SET_USER', user);
      }
    }
    
    console.log('Usuario en index:', user);
    
    if (!user || !user.rol) {
      this.$router.replace('/login');
      return;
    }
    
    const rolNombre = user.rol.nombre;
    console.log('Redirigiendo según rol:', rolNombre);
    
    // Redirección según el rol
    if (rolNombre === 'usuario' || rolNombre === 'Usuario') {
      console.log('Redirigiendo a dashboard-usuario');
      this.$router.replace('/dashboard-usuario');
    } 
    else if (rolNombre === 'Técnico') {
      console.log('Redirigiendo a dashboard-tecnico');
      this.$router.replace('/dashboard-tecnico');
    }
    else {
      console.log('Redirigiendo a dashboard-admin');
      this.$router.replace('/dashboard-admin');
    }
  }
};
</script>