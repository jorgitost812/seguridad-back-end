<template>
  <div class="text-center pa-10">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <p class="mt-4">Redirigiendo...</p>
  </div>
</template>

<script>
export default {
  async mounted() {
    // Esperar a que el store esté listo
    await this.$nextTick()
    
    let user = null
    
    // Intentar obtener usuario del store
    if (this.$store.state.auth && this.$store.state.auth.user) {
      user = this.$store.state.auth.user
    }
    
    // Si no hay usuario en el store, intentar recuperar del localStorage
    if (!user && process.client) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          user = JSON.parse(storedUser)
        } catch (e) {
          console.error('Error parsing user:', e)
        }
      }
    }
    
    console.log('=== INDEX REDIRECT ===')
    console.log('Usuario encontrado:', user ? user.email : 'No hay usuario')
    
    // Si NO hay usuario, redirigir al login
    if (!user || !user.rol) {
      console.log('No hay usuario, redirigiendo a /login')
      // Limpiar cualquier residuo
      if (process.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
      this.$router.replace('/login')
      return
    }
    
    const rolNombre = user.rol.nombre
    console.log('Rol detectado:', rolNombre)
    
    // Redirección según el rol
    if (rolNombre === 'Administrador' || rolNombre === 'AdministradorProv') {
      this.$router.replace('/admin')
    } else if (rolNombre === 'AdministradorJC') {
      this.$router.replace('/adminjc')
    } else if (rolNombre === 'Supervisor') {
      this.$router.replace('/supervisor')
    } else if (rolNombre === 'Técnico') {
      this.$router.replace('/tecnico')
    } else if (rolNombre === 'usuario') {
      this.$router.replace('/usuario')
    } else {
      this.$router.replace('/login')
    }
  }
}
</script>