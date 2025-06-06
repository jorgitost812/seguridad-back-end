<template >
   <v-row align="center" justify="center">
      
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="12" >
          <v-toolbar color="accent" >
            <v-toolbar-title> Cambio de Contraseña </v-toolbar-title>
            
            <v-spacer></v-spacer>
          </v-toolbar >
          
        <v-card-text  style="background-color: #FFF9C4" >
          <v-form @submit.prevent="userLogin" >
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <pre class="font-weight-bold" v-once>Nombre: {{ nombreCompleto }}</pre>
              </v-col>
              <v-col cols="12">
                <v-text-field type="password" v-model="editedItem.password" label="Contrasena"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Confirmar contraseña" type="password" v-model="passwordc" required></v-text-field>
              </v-col>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-row>
          </v-form>
        </v-card-text>

        </v-card>
      </v-col>
      
    </v-row>
  
  
</template>

<script>
 
  export default {
    data: () => ({
      passwordc: "",
      nombreCompleto: "",
      usuarioReal: 0,
      editedIndex: 0,
      editedItem: {
      email: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      apellidos: "",
      jc: "",
      rol: "",
    },
    items: [],
    editedItem: {
      email: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      apellidos: "",
      grupo_municipal: null,
      jc: "",
      rol: "",
    },
    defaultItem: {
      email: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      apellidos: "",
      grupo_municipal: null,
      jc: "",
      rol: "",
    },
    }),

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
    municipios() {
      return this.$store.state.municipios.list;
    },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      
    },

    created() {
    this.usuarioReal = this.user.id; 
    this.nombreCompleto = this.user.nombre+" "+this.user.apellidos; 
    this.initialize();
  },
    methods: {
      editItem(item) {
      
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
      callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
        
    },
    async initialize() {
      //this.editedIndex = alert("fdfd ; "+this.items.indexOf(item));
      this.editedIndex =0;
      this.editedItem = Object.assign({}, 0);
    },
    async save () {
     
      alert(this.editedIndex);
      if(this.editedItem.password === this.passwordc){
        try{
          await this.$axios.put(`api/usuarios/${this.items[this.editedIndex].id}`, this.editedItem);
          this.callAlert({status: true, message: 'Se modificó satifactoriamente', color: 'primary'});
                   
        }catch (error) {
          this.callAlert({status: true, message: 'No se modificó', color: 'error'});
        }
      }
      else{
        this.callAlert({status: true, message: 'No coincide  la contraseña', color: 'error'});
      }        
    },
  },
}
</script>