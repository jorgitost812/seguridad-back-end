<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-toolbar color="primary" dark>
            <v-toolbar-title>PC: {{pc.nombre}} </v-toolbar-title>
            </v-toolbar>            
            <v-card-text style="background-color: #FFF9C4">
            <v-simple-table style="background-color: #FFF9C4">
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>IP: {{ pc.ip }}</td>
                  </tr>
                  <tr>
                    <td>Numero: {{ pc.numero }}</td>
                  </tr>
                  <tr>
                    <td v-if="pc.jc">JC: {{ pc.jc.nombre }}</td>
                  </tr> 
                </tbody>
              </template>
            </v-simple-table>
            </v-card-text>
            <v-toolbar color="primary" dark>
            <v-toolbar-title>Autorización para mostrar contraseñas</v-toolbar-title>
            </v-toolbar>
            <v-card-text style="background-color: #FFF9C4">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4" >
                  <v-select 
                    v-model="causa"
                    :items="states"
                    label="Causa">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" >
                  <v-select 
                    v-model="supervisor"
                    :items="usuarioSupervisor"
                    item-text="email"
                    label="Autoriza">
                  </v-select>
                </v-col>
                </v-row>
              </v-container>  
            </v-card-text>
            <v-card-actions style="background-color: #FFF9C4">
              <v-row>
                <v-col cols="12">
                  <v-btn v-if="user.rol.id !==8" color="primary" @click="AutorizaPWD" >
                     <v-icon dark left>{{candado}}</v-icon>{{registro_boton}}</v-btn>
                  </v-col>
              </v-row>
            </v-card-actions>  
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
              <v-toolbar color="primary" dark>
              <v-toolbar-title>Seguridad</v-toolbar-title>
              </v-toolbar>            
            <v-card-text style="background-color: #FFF9C4">
              <p ALIGN= "left" :hidden="!showBoton" >Incidencia reportada</p>
              <v-simple-table style="background-color: #FFF9C4">
              <template v-slot:default>
               
                <tbody>
                  <tr>
                    <td>Admin: </td>
                    <td > 
                      <v-text-field 
                        disabled
                        v-model="admin"
                        :type="show ?  'text' : 'password'">
                      </v-text-field>
                    </td>
                  </tr>
                  <tr>
                    <td>Setup: </td>
                    <td>
                      <v-text-field
                        disabled
                        v-model="setup"
                        :type="show ? 'text' : 'password'">
                      </v-text-field>
                    </td>
                  </tr>               
                </tbody>
              </template>
            </v-simple-table>
            </v-card-text>
            <!-- <v-card-actions style="background-color: #FFF9C4">
              <v-row>
                <v-col cols="12">
                  <v-btn color="primary" @click="revelarPWD" :disabled="show">
                     <v-icon dark left>{{icon}}</v-icon>{{titulo_boton}}</v-btn>
                  </v-col>
               </v-row>
            </v-card-actions>             -->
          </v-card>  
              
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {decrypt} from '../helpers/crypto.helper'
export default {
  name: 'PCDetalle',
  props: {
    pcID: {
      type: String,
      required: true
    }
  },
  data: () => ({
    pc: {},
    show: false,
    showBoton: false,
    items: [],
    correo: [],
    states: ['Mantenimiento', 'Supervisión'],
    causa:'Mantenimiento',
    supervisor: '',
    admin: '',
    setup: '',
    editedIndex: -1,
    editedItem: {
        nombrejc: '',
        nombrepc: '',
        inventario: '',
        admin: '',
        tecnico: '',
        supervisor: '',
        causa: '',
      },
      defaultItem: {
        nombrejc: '',
        nombrepc: '',
        inventario: '',
        admin: '',
        tecnico: '',
        supervisor: '',
        causa: '',
      }
  }),
  computed: {
     user() {
      return this.$store.state.auth.user;
    },
    usuarioSupervisor() {
        return this.$store.state.usuarios.list;
    },
     usuarioAdminJC() {
        return this.$store.state.usuarios.list;
    },
    arregloAdmin(){
      return this.$store.state.usuarios.admin;
    },
    /*icon(){
      //"show ? 'mdi-eye' : 'mdi-eye-off'"
      if(!this.show) {
        return 'mdi-eye'
      } else {
        return 'mdi-eye-off'
      }
    },*/
    candado(){
      //"show ? 'mdi-eye' : 'mdi-eye-off'"
      if(!this.showBoton) {
        return 'mdi-notebook-plus'
      } else {
        //return 'mdi-notebook-outline'
        return 'mdi-eye-off'
      }
    },
    titulo_boton(){
      //"show ? 'mdi-eye' : 'mdi-eye-off'"
     /* if(!this.show) {
        return 'Mostrar'
      } else {
        return 'Ocultar'
      }*/
    },  
    registro_boton(){
      if(!this.showBoton) {
        return 'Registrar'
      } else {
        return 'Ocultar'
      }
    }    
  },
  async created() { 
    await this.$store.dispatch('usuarios/getByRol', 6);
    await this.getPC();
  },
  methods: {
    callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
      },
    async getPC() {
     
      try {
        const {data} = await this.$axios.get(`/api/pcs/${this.$route.params.id}`)
        this.admin = decrypt(data.pwd);
        this.setup = decrypt(data.setupPwd);
        this.pc = data;
        await this.$store.dispatch(`usuarios/getByIdJovenClubAndNombreRol`, 6);
      
        //alert(JSON.stringify(this.arregloAdmin[0]));
      } catch (error) {
        //alert(this.adminJC.email);
        //console.log(error);

      }
    },
    AutorizaPWD() {
      if((this.supervisor === '' || this.supervisor === this.user.email)){
        //if((this.supervisor === '' && this.user.rol.id !==6)){
        //if(this.supervisor === this.user.email)
          this.callAlert({status: true, message: 'Seleccione el supervisor', color: '#FF6F00'});
      }
      else{
        if(true){
      //if(this.user.rol.id !==6){
          if(!this.showBoton)
          {
            this.editedItem.nombrejc= this.pc.jc.nombre;
            this.editedItem.nombrepc= this.pc.nombre;
            this.editedItem.inventario= this.pc.numero;
            this.editedItem.admin= this.arregloAdmin.length;
            this.editedItem.tecnico= this.user.email;
            this.editedItem.supervisor= this.supervisor;
            this.editedItem.causa= this.causa;
            this.save();
            try {
              //this.$axios.post('mail/hola}');
              //const {data} = this.$axios.post('mail/hola}'); //${this.pc.jc.id}
              // this.$axios.post(`mail/notification/${this.editedItem}`);
              const payload = this.editedItem;
              this.$axios.post(`mail/notification`, payload);
              //this.correo = data;
               //alert("Paso");
            } catch (error) {
              alert(error);
            }
          }
          else
          {
          this.showBoton = !this.showBoton
          this.show = !this.show
        }
        }
      }
      
      
    },
     revelarPWD() {
alert("revelarPWD");
       this.showBoton = !this.showBoton
      this.show = !this.show
    },
    async save () {
      try {
        await this.$axios.post("api/accesos", this.editedItem);
        //this.callAlert({status: true, message: 'Se agrego satifactoriamente', color: 'primary'});
        this.showBoton = !this.showBoton
        this.show = !this.show
      } catch (error) {
        alert("save3");
        console.log(error.response.data);
        this.callAlert({status: true, message: 'No se agrego ', color: 'error'});
      }
    },
  }
}
</script>

<style>

</style>