<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="5" md="8">
        <v-card elevation="12" :class="['mt-16', 'ml-16']">
          <v-toolbar color="blue darken-2" dark>
            <img src="./../static/logojc.jpg" style="border-radius: 60%;" alt="" width="60" height="55">
            <v-toolbar-title :class="['ml-16']"> Inicio de sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text style="background-color: #FFF9C4">
            <v-form @submit.prevent="userLogin">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Correo electrónico" type="email" v-model="email" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field 
                    v-model="password" 
                    required
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                    label="Contraseña">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn color="blue darken-2" dark type="submit"> Entrar </v-btn>
                </v-col>
              </v-row>
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
    email: 'ivan@aol.com',
    password: 'Yoendris123.',
    show: false
  }),
  methods: {
    async userLogin() {
      try {
        const result = await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        });
        
        if (result.success) {
          const user = result.user;
          const rolNombre = user?.rol?.nombre;
          
          console.log('Login exitoso. Rol:', rolNombre);
          
          // Redirección según el rol
          if (rolNombre === 'usuario' || rolNombre === 'Usuario') {
            this.$router.push('/dashboard-usuario');
          } 
          else if (rolNombre === 'Técnico') {
            this.$router.push('/dashboard-tecnico');
          }
          else {
            this.$router.push('/dashboard-admin');
          }
        } else {
          this.$store.commit('alert/setAlert', {
            status: true,
            message: result.error || 'Usuario o contraseña incorrectos',
            color: 'error'
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        this.$store.commit('alert/setAlert', {
          status: true,
          message: 'Error al iniciar sesión',
          color: 'error'
        });
      }
    }
  }
};
</script>