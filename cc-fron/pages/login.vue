<template>
  <v-container><v-row align="center" justify="center"><v-col cols="12" lg="5" md="8"><v-card elevation="12"><v-toolbar color="blue darken-2" dark><img src="./../static/logojc.jpg" style="border-radius: 60%;" width="60" height="55"><v-toolbar-title class="ml-16">Inicio de sesión</v-toolbar-title></v-toolbar><v-card-text style="background-color: #FFF9C4"><v-form @submit.prevent="userLogin"><v-text-field label="Correo electrónico" type="email" v-model="email" required></v-text-field><v-text-field v-model="password" required :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" @click:append="show = !show" label="Contraseña"></v-text-field><v-btn color="blue darken-2" dark type="submit">Entrar</v-btn></v-form></v-card-text></v-card></v-col></v-row></v-container>
</template>

<script>
export default {
  layout: "simple", auth: false,
  data: () => ({ email: '', password: '', show: false }),
  methods: {
    async userLogin() {
      const result = await this.$store.dispatch('auth/login', { email: this.email, password: this.password });
      if (result.success) {
        const rol = result.user?.rol?.nombre;
        if (rol === 'Administrador' || rol === 'AdministradorProv') this.$router.push('/admin');
        else if (rol === 'AdministradorJC') this.$router.push('/adminjc');
        else if (rol === 'Supervisor') this.$router.push('/supervisor');
        else if (rol === 'Técnico') this.$router.push('/tecnico');
        else if (rol === 'usuario') this.$router.push('/usuario');
        else this.$router.push('/admin');
      } else {
        this.$store.commit('alert/setAlert', { status: true, message: result.error || 'Credenciales inválidas', color: 'error' });
      }
    }
  }
};
</script>