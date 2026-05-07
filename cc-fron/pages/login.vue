<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="5" md="8">
        <v-card elevation="12">
          <v-toolbar color="#0D47A1" dark>
            <img src="/logojc.jpg" style="border-radius: 60%;" alt="" width="60" height="55">
            <v-toolbar-title class="ml-4" style="color: #FFC107;">Inicio de Sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text style="background-color: #FFF9C4">
            <v-form @submit.prevent="userLogin">
              <v-text-field label="Correo electrónico" type="email" v-model="email" required outlined dense></v-text-field>
              <v-text-field v-model="password" required :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" @click:append="show = !show" label="Contraseña" outlined dense></v-text-field>
              <v-btn color="#0D47A1" dark type="submit" block :loading="loading">Entrar</v-btn>
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
  data: () => ({ email: '', password: '', show: false, loading: false }),
  methods: {
    async userLogin() {
      this.loading = true
      try {
        const { data } = await this.$axios.post('/api/auth/login', {
          email: this.email,
          password: this.password
        })
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        this.$router.push('/dashboard')
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || 'Credenciales inválidas'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>