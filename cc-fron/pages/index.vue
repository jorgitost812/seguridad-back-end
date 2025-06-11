<template >
  <v-container  >
  <v-row  justify="center" align="center" >
    <v-col  cols="12" md="6" lg="3">
      <Widget style="background-color: #FFF9C4" titulo="Total" subtitulo="Técnicos JC" :valor="usuarios.length-d.usuariosDP" icono="mdi-account" vinculo="user"></Widget>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <Widget style="background-color: #FFF9C4" titulo="Total" subtitulo="Joven Clubs" :valor="jcs.length" icono="mdi-office-building" vinculo="jc"></Widget>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <Widget style="background-color: #FFF9C4" titulo="Total" subtitulo="Computadoras" :valor="pcs.length-d.pcsDP" icono="mdi-laptop" vinculo="pc"></Widget>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <Widget style="background-color: #FFF9C4" titulo="Total" subtitulo="Municipios" :valor="municipios.length" icono="mdi-map" vinculo="municipios"></Widget>
    </v-col>
    <v-col  cols="12" md="6" lg="3">
      <Widget style="background-color: #FFF9C4" titulo="Total" subtitulo="D. Provincial Técnicos" :valor="d.usuariosDP" icono="mdi-account" vinculo="user"></Widget>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <Widget style="background-color: #FFF9C4" titulo="Total" subtitulo="D. Provincial Computadoras" :valor="d.pcsDP" icono="mdi-laptop" vinculo="pc"></Widget>
    </v-col>
  </v-row>
  </v-container  >
</template>
//<v-alert slot="no-results" :value="true" dir="rtl" color="info" icon="mdi-laptop">Hola</v-alert>
<script>
import Widget from '~/components/Widget.vue';
import { state } from '~/store/jcs';

export default {
  middleware: 'auth',
  async created() {
    try {
      console.log('User component created');
      await this.$store.dispatch('roles/getRoles');
      await this.$store.dispatch('provincias/getProvincias');
      
      const user = this.$auth.user;
      console.log('Current user:', user);

      if (user?.jc?.municipio?.provincia?.id) {
        this.provincia = user.jc.municipio.provincia.id;
        await this.$store.dispatch('municipios/getMunByProvincia', this.provincia);
      }

      if (user?.jc?.municipio?.id) {
        this.municipio = user.jc.municipio.id;
        await this.$store.dispatch('jcs/getJcsByMunicipios', this.municipio);
      }

      if (user?.jc?.id) {
        this.jcx = user.jc.id;
        await this.initialize();
      }
    } catch (error) {
      console.error('Error in created:', error);
      this.callAlert({
        status: true,
        message: 'Error al cargar datos iniciales',
        color: 'error'
      });
    }
  },

  methods: {
    async initialize() {
      try {
        console.log('Initializing with JC:', this.jcx);
        const {data} = await this.$axios.get(`api/usuarios/by_joven_club/${this.jcx}`);
        console.log('Users data:', data);
        this.items = data;
      } catch (error) {
        console.error('Error loading users:', error);
        this.callAlert({
          status: true,
          message: 'Error cargando usuarios',
          color: 'error'
        });
      }
    }
  },
  components: { Widget },
  data: () => ({
    backgroundDiv : {
        backgroundImage : 'url(' + require('../assets/fondopc.jpg') + ')',
        backgroundRepeat : 'no-repeat',
        backgroundSize : '100% 100%'
  }, 
    d: {
      "usuarios": 0,
      "usuariosDP": 1,
      "pcsDP": 1,
    }
  }),
  computed: {
  
    jcs() {
      return this.$store.state.jcs.list;
    },
     pcs() {
      return this.$store.state.pcs.list;
    },
    municipios() {
      return this.$store.state.municipios.list;
      
    },
    usuarios() {
      return this.$store.state.usuarios.list;
    },
    
  },
  created() {
    this.$store.dispatch('jcs/getJcs');
    this.$store.dispatch('pcs/getPcs');
    this.$store.dispatch('municipios/getMunicipios');
    this.$store.dispatch('usuarios/getUsuarios');
    this.getDasboard()
  },
  methods: {
    async getDasboard() {
      try {
      
       
      } catch (error) {
        
        console.log(error);
      }
    }
  }
}
</script>
<style >

</style>