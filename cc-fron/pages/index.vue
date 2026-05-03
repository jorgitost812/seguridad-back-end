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
    await this.$nextTick();
    
    // Forzar recarga del usuario desde el store y localStorage
    let user = this.$store.state.auth.user;
    
    if (!user || !user.jc) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
          console.log('Usuario desde localStorage:', user);
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    }
    
    console.log('=== INDEX REDIRECT ===');
    console.log('Usuario completo:', user);
    console.log('Rol ID:', user?.rol?.id);
    console.log('JC del usuario:', user?.jc);
    console.log('JC ID:', user?.jc?.id);
    
    if (!user || !user.rol) {
      this.$router.replace('/login');
      return;
    }
    
    const rolId = user.rol.id;
    const tieneJC = user?.jc?.id;
    
    // Redirección por ID
    if (rolId === 5) {  // AdministradorJC
      if (!tieneJC) {
        console.error('ERROR: AdministradorJC sin JC asignado');
        this.$store.commit('alert/setAlert', {
          status: true,
          message: 'Error: Usuario no tiene Joven Club asignado. Contacte al administrador.',
          color: 'error'
        });
      }
      console.log('✅ Redirigiendo a dashboard-adminjc');
      this.$router.replace('/dashboard-adminjc');
    } 
    else if (rolId === 6) {  // Supervisor
      console.log('✅ Redirigiendo a dashboard-supervisor');
      this.$router.replace('/dashboard-supervisor');
    } 
    else if (rolId === 7) {  // Técnico
      console.log('✅ Redirigiendo a dashboard-tecnico');
      this.$router.replace('/dashboard-tecnico');
    }
    else if (rolId === 8) {  // Usuario
      console.log('✅ Redirigiendo a dashboard-usuario');
      this.$router.replace('/dashboard-usuario');
    }
    else {
      console.log('✅ Redirigiendo a dashboard-admin');
      this.$router.replace('/dashboard-admin');
    }
  }
};
</script>