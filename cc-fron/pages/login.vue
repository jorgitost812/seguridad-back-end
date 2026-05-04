<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="5" md="8">
        <v-card elevation="12">
          <v-toolbar color="blue darken-2" dark>
            <img src="/logojc.jpg" style="border-radius: 60%;" alt="" width="60" height="55">
            <v-toolbar-title class="ml-16">Inicio de sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text style="background-color: #FFF9C4">
            <v-form @submit.prevent="userLogin">
              <v-text-field 
                label="Correo electrónico" 
                type="email" 
                v-model="email" 
                required
                outlined
                dense
              ></v-text-field>
              <v-text-field 
                v-model="password" 
                required
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                label="Contraseña"
                outlined
                dense
              ></v-text-field>
              <v-btn color="blue darken-2" dark type="submit" block>Entrar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "simple",
  auth: false,
  data: () => ({
    email: '',
    password: '',
    show: false
  }),
  methods: {
    async userLogin() {
      try {
        const result = await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        })
        
        if (result.success) {
          const user = result.user
          const rolNombre = user?.rol?.nombre
          
          if (rolNombre === 'Administrador' || rolNombre === 'AdministradorProv') {
            this.$router.push('/admin')
          } else if (rolNombre === 'AdministradorJC') {
            this.$router.push('/adminjc')
          } else if (rolNombre === 'Supervisor') {
            this.$router.push('/supervisor')
          } else if (rolNombre === 'Técnico') {
            this.$router.push('/tecnico')
          } else if (rolNombre === 'usuario') {
            this.$router.push('/usuario')
          } else {
            this.$router.push('/admin')
          }
        } else {
          this.$store.commit('alert/setAlert', {
            status: true,
            message: result.error || 'Credenciales inválidas',
            color: 'error'
          })
        }
      } catch (error) {
        console.error('Login error:', error)
        this.$store.commit('alert/setAlert', {
          status: true,
          message: 'Error al iniciar sesión',
          color: 'error'
        })
      }
    }
  }
}
</script>