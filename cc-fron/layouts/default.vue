<template>
  <v-app dark>
    <v-navigation-drawer v-if="user" color="#FFF9C4" v-model="drawer" clipped fixed app>
      <v-list-item class="px-2 mt-4">
        <v-list-item-avatar>
          <img src="/logojc.jpg" alt="JC" width="200">
        </v-list-item-avatar>
        <v-list-item-title style="color: #0D47A1;">{{ user?.nombre }} {{ user?.apellidos }}</v-list-item-title>
        <v-list-item-subtitle style="color: #0D47A1;">{{ user?.rol?.nombre || 'Usuario' }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>

      <v-list dense class="mt-4">
        <v-list-item to="/dashboard" router exact>
          <v-list-item-action><v-icon color="#0D47A1">mdi-view-dashboard</v-icon></v-list-item-action>
          <v-list-item-content><v-list-item-title style="color: #0D47A1;">Dashboard</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/computadoras" router exact>
          <v-list-item-action><v-icon color="#0D47A1">mdi-laptop</v-icon></v-list-item-action>
          <v-list-item-content><v-list-item-title style="color: #0D47A1;">Computadoras</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/inventario" router exact>
          <v-list-item-action><v-icon color="#0D47A1">mdi-package-variant</v-icon></v-list-item-action>
          <v-list-item-content><v-list-item-title style="color: #0D47A1;">Inventario General</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/trazas" router exact>
          <v-list-item-action><v-icon color="#0D47A1">mdi-history</v-icon></v-list-item-action>
          <v-list-item-content><v-list-item-title style="color: #0D47A1;">Trazas</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#0D47A1" dark clipped-left fixed app>
      <v-app-bar-nav-icon v-if="user" @click.stop="drawer = !drawer" />
      <v-toolbar-title>Sistema de Gestión de Inventarios - JC Las Tunas</v-toolbar-title>
      <v-spacer></v-spacer>
      <span style="color: #FFC107;" v-if="user">{{ user?.nombre }} ({{ user?.rol?.nombre }})</span>
      <v-btn small class="ml-2" icon @click="Salir" color="#FFC107"><v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>

    <v-main style="background-color: #FFF9C4">
      <v-container fluid><nuxt /></v-container>
    </v-main>

    <v-footer color="#0D47A1" dark app>
      <v-spacer></v-spacer>
      <span style="color: #FFC107;">&copy; Grupo Informático Las Tunas - Joven Club - {{ new Date().getFullYear() }}</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return { drawer: true }
  },
  computed: {
    user() {
      if (process.client) {
        const u = localStorage.getItem('user')
        return u ? JSON.parse(u) : null
      }
      return null
    }
  },
  methods: {
    Salir() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>