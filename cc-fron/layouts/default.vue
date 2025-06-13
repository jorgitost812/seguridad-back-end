<template>
  <v-app dark>
    <v-navigation-drawer  color="#FFF9C4" v-model="drawer" clipped fixed app>
      <v-list-item class="px-2">
         <v-list-item-avatar>
          <img :src="imagen.url" :alt="user.nombre" width="200">
        </v-list-item-avatar> 
         <v-list-item-title>{{user.nombre+" "+user.apellidos }}</v-list-item-title> 
           <!-- <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>  -->
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <!-- <v-divider></v-divider> -->
      <v-list-item-title align="right">{{user.email }} ( {{user.rol.nombre}})</v-list-item-title>
      <v-btn small class="ml-2" icon @click="Salir"><v-icon>mdi-logout</v-icon></v-btn>
     
      <v-spacer></v-spacer>  
          
      
    </v-app-bar>
    <v-main style="background-color: #FFF9C4">
      <MiAlerta/>
      <v-container >
        <nuxt />
      </v-container>
    </v-main>
    <v-footer color="primary" dark :absolute="!fixed" app>
      <v-spacer></v-spacer>
      <span>&copy; Grupo Informatico Las Tunas @ Año: {{ new Date().getFullYear() }} </span>
      <v-spacer></v-spacer>
    </v-footer>
    
  </v-app>
   
</template>

<script>
import MiAlerta from '../components/Mialerta.vue'
import ref from 'vue'
//  #90CAF9

export default {
  components: {MiAlerta},
  usuarioReal: "",
  data() {
    return {
      accesos: [],
      clipped: false,
      activo: 0,
      imagen: {
        url: require('@/static/fotousuarios/logojc.jpg'),
        nombre: "x",
        
      },
      
      drawer: true,
      fixed: true,
      backgroundDiv: {
        backgroundImage : 'url(' + require('../assets/fondopc.jpg') + ')',
        //background:'-moz-linear-gradient(top, #0f9fe7 0%, #3e4dda 100%);',
        backgroundRepeat : 'no-repeat',
        backgroundSize : '100% 100%'
      },
      reportes: [
        ['Accesos a PC', 'mdi-map', '/reportepc', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI"]],
        //['Inicios de sesiones', 'mdi-map', '/reporteini', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI"]],
      ],
      configura: [
        ['Municipios', 'mdi-map', '/municipios', ["Administrador", "AdministradorProv"]],
        //['Roles y Funciones', 'mdi-map', '/roles', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI","Técnico"]],
        ['Cambio contraseña', 'mdi-file-outline', '/contrasena', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI","Técnico"]],
        ['Salir', 'mdi-logout', '/login', ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI","Técnico"]],
      ],  
      items: [
        {
          icon: "mdi-home",
          title: "Inicio",
          to: "/",
          role: ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI","Técnico"],
        },
        {
          icon: "mdi-office-building",
          title: "Joven Clubs",
          to: "/jc",
          role: ["Administrador", "AdministradorProv", "DirectorMunicipal"],
        },
        {
          icon: "mdi-laptop",
          title: "Computadoras",
          to: "/pc",
          role: ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI","Técnico"],
        },
        {
          icon: "mdi-account-multiple-outline",
          title: "Instructores",
          to: "/user",
          role: ["Administrador", "AdministradorProv", "DirectorMunicipal"],
         }
        //,{
        //   icon: "mdi-home-city",
        //   title: "Reportes",
        //   to: "/",
        //   role: ["Administrador", "AdministradorProv", "DirectorMunicipal", "AdministradorJC", "Supervisor", "RSI","Técnico"],
        // }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Control contraseñas de las PC",
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
     roles() {
      return this.$store.state.roles.list;
    },
    jcs() {
      return this.$store.state.jcs.list;
    },
    userRol() {
      const storageUser = localStorage.getItem('usuario')
      const user = JSON.parse(storageUser)
      //alert(user.rol.nombre.trim());
      return user.rol.nombre.trim();
    }
   
  },
   
  async created() {
    const response = await this.$axios.get('http://localhost:8080/reportepc');
    this.accesos = response.data;
  },
  methods: {
    initialize() {
      this.usuarioReal =  this.user.email;
      var cuenta=0;
      for (var i = 0; i < this.usuarioReal.length; i++) {
        if(this.usuarioReal[i] === "@"){
          this.usuarioReal =  this.user.email.substr(0, cuenta); 
          }
         ++cuenta;
      }
      this.imagen.url= require(`@/static/fotousuarios/${this.usuarioReal}.jpg`);   
      
    },
    async Salir() {
      await this.$auth.logout();
      this.$router.push("/login");
    },
    isAllow(roleList) { 
      
       return !!roleList.includes(this.user.rol.nombre.trim())
    },
    
  },
  
};
</script>
