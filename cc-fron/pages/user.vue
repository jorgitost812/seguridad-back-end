<template>
   <v-data-table style="background-color: #FFF9C4"
    :headers="headers"
    :items="items"
    :items-por-pagina="7"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar  color="primary" dark flat >
        <v-toolbar-title>Instructores: </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" >
          <template v-slot:activator="{ on, attrs }">
            
              <v-btn small class="ml-2" color="primary" fab v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-col   cols="12" sm="6" md="4" align="right">
                <v-row>
                  <v-select class="dark" :class="['mt-5']" style="width: 45%;" v-if="user.rol.id <3"
                  :items="municipios"
                  label="Municipio"
                  item-text="nombre"
                  item-value="id"
                  v-model="municipio">
                </v-select>
                <v-select  class="dark" :class="['mt-5','ml-3']" style="width: 45%;" v-if="user.rol.id <4"
                  :items="jcs"
                  label="Jclub"
                  item-text="nombre"
                  item-value="id"
                  v-model="jcx">
                </v-select>
               
                </v-row>
              </v-col>
               
              <v-col  cols="12" sm="6" md="4" align="right">
              <v-select class="dark" :class="['mt-5','ml-16']" style="width: 40%;" :disabled="user.rol.id >1" 
                :items="provincias.data"
                label="Provincia"
                item-text="nombre"
                item-value="id"
                v-model="provincia">
              </v-select>
            </v-col>
              <v-spacer></v-spacer>
            </template>
         
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
  v-model="editedItem.nombre"
  label="Nombre"
  :rules="[v => !!v || 'Nombre es requerido']"
  required
></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
  v-model="editedItem.apellidos"
  label="Apellidos"
  :rules="[v => !!v || 'Apellidos son requeridos']"
  required
></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
  v-model="editedItem.email"
  label="Correo"
  type="email"
  :rules="[
    v => !!v || 'Email es requerido',
    v => /.+@.+\..+/.test(v) || 'Email debe ser válido'
  ]"
  required
></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
    v-model="editedItem.password"
    label="Contraseña"
    type="password"
    :rules="passwordRules"
    required
  ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" >
                    <v-checkbox 
                      label="G. Municipal" 
                      v-model="editedItem.grupo_municipal">
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="user.rol.id <4">
                    <v-select 
    :items="jcs" 
    label="Joven Club" 
    item-text="nombre" 
    item-value="id" 
    v-model="editedItem.jcId">  <!-- Changed from jc to jcId -->
  </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="user.rol.id <4">
                    <v-select 
    :items="roles" 
    label="Roles"
    item-text="nombre"
    item-value="id" 
    v-model="editedItem.rolId">  <!-- Changed from rol to rolId -->
  </v-select>
                     
                  </v-col>
                  
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="300px">
          <v-card>
            <v-card-title class="text-h5">Estás seguro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Aceptar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogTras" width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Traslado a...</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                <v-col cols="12" sm="6" md="4" v-if="(user.rol.id <3)">
                <v-select class="dark" :class="['mt-5','ml-16']" style="width: 60%;"
                  :items="municipios"
                  label="Municipio"
                  item-text="nombre"
                  item-value="id"
                  v-model="municipio">
                </v-select>
              </v-col>
                  <v-col cols="12" sm="6" md="4">
                  <v-select 
                    :items="jcs" 
                    label="Joven Club" 
                    item-text="nombre" 
                    item-value="id" 
                    v-model="editedItem.jc"></v-select>
                  </v-col>
                  
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn> -->
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
     
    </template>
    <template v-slot:item.grupo_municipal="{ item }" >
      {{grupo_mcpal(item.grupo_municipal)}}
    </template>
    <template v-slot:item.actions="{ item }" >
      <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      <v-icon v-if="user.rol.id <4" small fab @click="trasladoItem(item)" > mdi-camera-switch </v-icon>
    </template>
    
  </v-data-table>
  </template>

<script>
export default {
  data: () => ({
    passwordRules: [
      v => !!v || 'La contraseña es requerida',
      v => v.length >= 8 || 'Mínimo 8 caracteres',
      v => /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[A-Za-z0-9#?!@$%^&*-]{8,}$/.test(v) || 
           'Debe contener mayúscula, minúscula, número y carácter especial'
    ],
    loading: false,
    dialog: false,
    dialogTras: false,
    dialogDelete: false,
    rsi: false,
    jcx: 0,
    municipio: null,
    provincia: 1,
    headers: [
      { text: "Nombre", align: "start", sortable: false, value: "nombre", width: '9%'},
      { text: "Apellidos", value: "apellidos", width: '15%' },
      { text: "Correo", value: "email", width: '18%' },
      { text: "J. Club", value: "jc.nombre", width: '12%' },      
      { text: "G. Municipal", value:"grupo_municipal", width: '8%' },
      { text: "Rol", value: "rol.nombre" , width: '8%' },
      { text: "Acción", value: "actions", sortable: false, width: '12%' },
    ],
    items: [],
    munis: [],
    editedIndex: -1,
    editedItem: {
  nombre: "",
  apellidos: "",
  email: "",
  password: "",
  grupo_municipal: false,
  jcId: null,  // maps to jcId
  rolId: null, // maps to rolId
  activo: true
},
    defaultItem: {
      email: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      apellidos: "",
      grupo_municipal: false,
      jcId: "",
      rolId: "",
    },
  }),

  computed: {
    canEditUser() {
    return this.user?.rol?.id === 1 || this.user?.rol?.id === 2;
  },
    formTitle() {
     return this.editedIndex === -1 ? 'Nuevo registro' : 'Editando registro'
    },
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
    provincias() {
        return this.$store.state.provincias.list;
      }
  },

  watch: {
     
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    jcx: {
        handler: function(val) {
          this.editedItem.jc = this.jcx;
          this.initialize();
      },
        deep: true
    },
     
    municipio: {
         handler: function(val) { 
         this.actualizaJC(); 
         this.initialize();
     },
        deep: true
    },
    provincia: {
         handler: function(val) { 
         this.actualizaMun(); 
         this.initialize();
      },
        deep: true
      }
  },

  async created() {
    console.log('User component created')
    try {
      await this.loadInitialData()
    } catch (error) {
      console.error('Error in created:', error)
      this.callAlert({
        status: true,
        message: 'Error cargando datos iniciales',
        color: 'error'
      })
    }
  },

  methods: {
    async loadInitialData() {
      this.loading = true
      try {
        await this.$store.dispatch('roles/getRoles')
        await this.$store.dispatch('provincias/getProvincias')
        
        const user = this.$auth.user
        console.log('Current user:', user)

        if (user?.jc?.municipio?.provincia?.id) {
          this.provincia = user.jc.municipio.provincia.id
          await this.$store.dispatch('municipios/getMunByProvincia', this.provincia)
        }

        if (user?.jc?.municipio?.id) {
          this.municipio = user.jc.municipio.id
          await this.$store.dispatch('jcs/getJcsByMunicipios', this.municipio)
        }

        if (user?.jc?.id) {
          this.jcx = user.jc.id
          await this.initialize()
        }
      } finally {
        this.loading = false
      }
    },
    async initialize() {
      try {
        console.log('Initializing with JC:', this.jcx)
        const response = await this.$axios.get(`api/usuarios/by_joven_club/${this.jcx}`)
        console.log('Users response:', response)
        this.items = response.data
      } catch (error) {
        console.error('Error loading users:', error)
        this.callAlert({
          status: true,
          message: 'Error cargando usuarios',
          color: 'error'
        })
      }
    },
    grupo_mcpal(val){
      return val === true ? 'Sí' : 'No'  
    },   
    callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
      },
    actualizaJC(){
        this.$store.dispatch('jcs/getJcsByMunicipio', this.municipio);
    },
    actualizaMun(){
      this.$store.dispatch('municipios/getMunByProvincia', this.provincia);
      
    },
      trasladoItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogTras = true;
    },
    closeTras() {
      //this.dialogTras = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    editItem(item) {
      
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      // this.items.splice(this.editedIndex, 1)
      await this.$axios.delete(`api/usuarios/${this.items[this.editedIndex].id}`);
      this.callAlert({status: true, message: 'Se elimino satifactoriamente', color: 'primary'});
      this.initialize();
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.dialogTras = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
  try {
    // 1. Validate required fields first
    if (!this.editedItem.nombre || !this.editedItem.apellidos || !this.editedItem.email) {
      this.callAlert({
        status: true,
        message: 'Los campos Nombre, Apellidos y Correo son obligatorios',
        color: 'error'
      });
      return;
    }

    // 2. Create new user
    if (this.editedIndex === -1) {
      // Validate password
      if (!this.editedItem.password) {
        this.callAlert({
          status: true,
          message: 'La contraseña es obligatoria para nuevos usuarios',
          color: 'error'
        });
        return;
      }

      // Validate role and JC
      if (!this.editedItem.rolId || !this.editedItem.jcId) {
        this.callAlert({
          status: true,
          message: 'Debe seleccionar un Rol y un Joven Club',
          color: 'error'
        });
        return;
      }

      const newUser = {
        nombre: this.editedItem.nombre,
        apellidos: this.editedItem.apellidos,
        email: this.editedItem.email,
        password: this.editedItem.password,
        confirmPassword: this.editedItem.password,
        grupo_municipal: this.editedItem.grupo_municipal || false,
        rolId: parseInt(this.editedItem.rolId),
        jcId: parseInt(this.editedItem.jcId || this.jcx),
        activo: true
      };

      console.log('Creating new user:', newUser);
      await this.$axios.post("api/usuarios", newUser);
      this.callAlert({
        status: true,
        message: 'Usuario creado exitosamente',
        color: 'success'
      });
    } else {
      // 3. Update existing user
      const updateData = {
        ...this.editedItem,
        rolId: parseInt(this.editedItem.rolId),
        jcId: parseInt(this.editedItem.jcId)
      };
      
      if (!updateData.password) {
        delete updateData.password;
      } else {
        updateData.confirmPassword = updateData.password;
      }

      await this.$axios.put(
        `api/usuarios/${this.items[this.editedIndex].id}`,
        updateData
      );
      this.callAlert({
        status: true,
        message: 'Usuario actualizado exitosamente',
        color: 'success'
      });
    }

    await this.initialize();
    this.close();
  } catch (error) {
    console.error('Error saving user:', error.response?.data);
    this.callAlert({
      status: true,
      message: error.response?.data?.message || 'Error al guardar el usuario',
      color: 'error'
    });
  }
},
  },
};
</script>


