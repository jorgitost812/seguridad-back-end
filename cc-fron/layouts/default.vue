<template>
  <v-app dark>
    <v-navigation-drawer v-if="user" color="#FFF9C4" v-model="drawer" clipped fixed app>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <img :src="imagen.url" :alt="user.nombre" width="200">
        </v-list-item-avatar> 
        <v-list-item-title>{{ user.nombre }} {{ user.apellidos }}</v-list-item-title> 
      </v-list-item>
      <v-divider></v-divider>
      
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          v-show="isAllow(item.role)"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- Reportes -->
      <v-list>
        <v-list-group :value="false" no-action>
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-home-city</v-icon>
            </v-list-item-action>            
            <v-list-item-content>
              <v-list-item-title>Reportes</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, icon, ruta, role], i) in reportes"
            :key="i"
            :to="ruta"
            :role="role"
            v-show="isAllow(role)"
            link
          >
            <v-list-item-icon><v-icon v-text="icon"></v-icon></v-list-item-icon>
            <v-list-item-title v-text="title"></v-list-item-title>
          </v-list-item>
        </v-list-group>
        
        <!-- Configuración -->
        <v-list-group :value="false" no-action>
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-action>            
            <v-list-item-content>
              <v-list-item-title>Configuración</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, icon, ruta, role], i) in configura"
            :key="i"
            :to="ruta"
            :role="role"
            v-show="isAllow(role)"
            link
          >
            <v-list-item-icon><v-icon v-text="icon"></v-icon></v-list-item-icon>
            <v-list-item-title v-text="title"></v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    
    <v-app-bar color="primary" dark clipped-left fixed app>
      <v-app-bar-nav-icon v-if="user" @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-list-item-title align="right">
        {{ user ? user.nombre + ' ' + user.apellidos + ' (' + (user.rol ? user.rol.nombre : '') + ')' : 'Cargando...' }}
      </v-list-item-title>
      <v-btn small class="ml-2" icon @click="Salir">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-main style="background-color: #FFF9C4">
      <MiAlerta/>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    
    <v-footer color="primary" dark :absolute="!fixed" app>
      <v-spacer></v-spacer>
      <span>&copy; Grupo Informatico Las Tunas @ Año: {{ new Date().getFullYear() }}</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
import MiAlerta from '../components/Mialerta.vue'

export default {
  components: { MiAlerta },
  data() {
    return {
      drawer: true,
      fixed: true,
      imagen: { url: require('@/static/fotousuarios/logojc.jpg') },
      title: "Control contraseñas de las PC",
      reportes: [
        ['Accesos a PC', 'mdi-map', '/admin/reportepc', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI"]],
      ],
      configura: [
        ['Municipios', 'mdi-map', '/admin/municipios', ["Administrador", "AdministradorProv"]],
        ['Trazas', 'mdi-history', '/admin/trazas', ["Administrador", "AdministradorProv"]],
        ['Cambio contraseña', 'mdi-file-outline', '/contrasena', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI", "Técnico"]],
        ['Salir', 'mdi-logout', '/login', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI", "Técnico"]],
      ],  
      items: [
        { icon: "mdi-home", title: "Inicio", to: "/admin", role: ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI", "Técnico"] },
        { icon: "mdi-office-building", title: "Joven Clubs", to: "/admin/jc", role: ["Administrador", "AdministradorProv", "DirectorMunicipal"] },
        { icon: "mdi-laptop", title: "Computadoras", to: "/admin/pc", role: ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI", "Técnico"] },
        { icon: "mdi-account-multiple-outline", title: "Instructores", to: "/admin/user", role: ["Administrador", "AdministradorProv", "DirectorMunicipal"] }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    jcs() {
      return this.$store.state.jcs.list
    }
  },
  methods: {
    async Salir() {
      await this.$auth.logout()
      this.$router.push("/login")
    },
    isAllow(roleList) {
      if (!this.user || !this.user.rol || !this.user.rol.nombre) return false
      return roleList.includes(this.user.rol.nombre.trim())
    }
  }
}
</script>