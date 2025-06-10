<template >
  <v-container  >
    
    <v-row align="center" justify="center" >
      <v-col cols="12" lg="5" md="8">
        <v-card elevation="12" :class="['mt-16','ml-16']">
          <v-toolbar color="blue darken-2" dark>
            <img src="./../static/logojc.jpg" style="border-radius: 60%;" alt="" width="60" height="55" >
            
            <v-toolbar-title  :class="['ml-16']"> Inicio de sesión</v-toolbar-title>
            
          </v-toolbar >
          <v-card-text  style="background-color: #FFF9C4" >
            <v-form @submit.prevent="userLogin" >
              <v-row>
                <v-col cols="12" >
                  <v-text-field label="Correo electrónico" type="email" v-model="email" required></v-text-field>
                 
                </v-col>
                
                
                <v-col cols="12"  >
                  <v-text-field 
                  v-model="password" required
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

import MiAlerta from '../components/Mialerta.vue'
export default {
  //<v-container style="background-color: #000A90" fill-height fluid>
  components: {MiAlerta},
  layout: "simple",
  auth: false,
  show: false,
  data: () => ({
  email: 'ivan@aol.com',
  password: 'Yoendris123.',
  show: false
}),
 
methods: {
  async userLogin() {
    try {
      const response = await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
      
      console.log('Login response:', response)
      
      if (response.data.statusCode === 200) {
        await this.$auth.setUser(response.data.user)
        await this.$router.push('/dashboard')  // o la ruta que desees
      }
    } catch (error) {
      console.error('Login error:', error)
      // Mostrar error usando Vuetify snackbar o alert
      this.$store.commit('alert/setAlert', {
        status: true,
        message: 'Usuario o contraseña incorrectos',
        color: 'error'
      })
    }
  }
}
};
//gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
</script>

<style>
.bottom-gradient {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 72px);
}

.repeating-gradient {
  background-image: repeating-linear-gradient(-45deg,
                      rgba(255,0,0,.25),
                      rgba(255,0,0,.25) 5px,
                      rgba(0,0,255,.25) 5px,
                      rgba(0,0,255,.25) 10px
                    );
}
</style>
