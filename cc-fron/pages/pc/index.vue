<template>
  <v-data-table style="background-color: #FFF9C4"
    :headers="headers"
    :items="items"
    :items-por-pagina="10"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="primary" dark flat >
        <v-toolbar-title>Computadoras: </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
    small 
    class="ml-2" 
    color="primary" 
    fab 
    v-bind="attrs" 
    v-on="on" 
    :disabled="!canAddPC"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
                                  
            <v-col  cols="12" sm="6" md="4" >
              <v-row>
                <v-select class="dark" :class="['mt-5']" style="width: 45%;" v-if="user.rol.id < 3"
                  :items="municipios"
                  label="Municipio"
                  item-text="nombre"
                  item-value="id"
                  v-model="municipio">
                </v-select>
                <v-select  class="dark" :class="['mt-5','ml-3']" style="width: 45%;" v-if="user.rol.id !== 4"
                  :items="jcs"
                  label="Jclub"
                  item-text="nombre"
                  item-value="id"
                  v-model="jcx">
                </v-select>
                
              </v-row>
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
                    <v-text-field v-model="editedItem.numero" label="N. Inventario">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.ip" label="IP"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field 
                      v-model="editedItem.setup" 
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                      label="Pass Setup"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field 
                      v-model="editedItem.admin" 
                      :append-icon="showp ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showp ? 'text' : 'password'"
                      @click:append="showp = !showp"
                      label="Pass Admin"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="(user.rol.id < 3)">
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
        <v-dialog v-model="dialogTras" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Traslado a...</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4" v-if="user.rol.id < 3">
                <v-select class="dark" :class="['mt-5','ml-16']" style="width: 100%;"
                  :items="municipios"
                  label="Municipio"
                  item-text="nombre"
                  item-value="id"
                  v-model="municipio">
                </v-select>
              </v-col>
                  <v-col cols="12" sm="6" md="4">
                  <v-select class="dark" :class="['mt-5','ml-16']" style="width: 100%;"
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
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small fab @click="irDetalles(item)"> mdi-eye </v-icon>
      <v-icon v-if="user.rol.id === 4" small fab @click="editItem(item)" > mdi-pencil </v-icon>
      <v-icon v-if="user.rol.id === 4" small fab @click="deleteItem(item)" > mdi-delete </v-icon>
      <v-icon v-if="user.rol.id < 4" small fab @click="trasladoItem(item)" > mdi-camera-switch </v-icon>
      
    </template>

    

  </v-data-table>
</template>

<script>

export default {
  data: () => ({
    show: false,
    showp: false,
    dialog: false,
    dialogTras: false,
    jcx: 1,
    municipio: 1,
    dialogDelete: false,
    headers: [
      { text: "N. Inventario", align: "start", sortable: false, value: "numero", width: '12%' },
      { text: "Nombre", align: "start", sortable: false, value: "nombre", width: '24%' },
      { text: "IP", align: "start", sortable: false, value: "ip", width: '24%' },
      { text: "J. Club", value: "jc.nombre", width: '15%' },
      { text: "Acción", value: "actions", sortable: false, width: '15%' },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      numero: "",
      ip: "",
      setup: "",
      admin: "",
      jc: null,
    },
    defaultItem: {
      nombre: "",
      numero: "",
      ip: "",
      setup: "",
      admin: "", 
      jc: null,
    },
  }),

  computed: {
    formTitle() {
     return this.editedIndex === -1 ? 'Nuevo registro' : 'Editando registro'
    },
     jcs() {
      return this.$store.state.jcs.list;
    },
    user() {
      return this.$store.state.auth.user;
    },
    municipios() {
      return this.$store.state.municipios.list;
    },
    canAddPC() {
      return this.user && this.user.rol && this.user.rol.id === 1;
    },
  },
    

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogTras(val) {
      val || this.close();
    },
     jcx: {
        handler: function(val) {
          this.editedItem.jc = this.jcx;
          this.initialize();
      },
        deep: true
      },
    municipio: {
         handler: async function(val) { 
           await this.actualizaJC(); 
           await this.initialize();
           if(this.jcs.length > 0){
             this.jcx = this.jcs[0].id;
           } else {
             this.jcx = null;
           }
        
      },
        deep: true
      }
  },

  async created() {
  try {
    if (!this.canAddPC) {
        console.warn('Usuario no tiene permisos para agregar PCs');
      }
    this.$store.dispatch('roles/getRoles');
    await this.$store.dispatch('provincias/getProvincias');
    
    // Verificación segura de propiedades anidadas
    if (this.user?.jc?.municipio?.provincia?.id) {
      this.provincia = this.user.jc.municipio.provincia.id;
    } else {
      // Valor por defecto o manejo de error
      console.error("Provincia no definida en usuario:", this.user);
      this.provincia = 1; // ID de provincia por defecto
    }

    await this.$store.dispatch('municipios/getMunByProvincia', this.provincia);
    
    if (this.user?.jc?.municipio?.id) {
      this.municipio = this.user.jc.municipio.id;
    } else {
      console.error("Municipio no definido en usuario:", this.user);
      this.municipio = 1; // ID de municipio por defecto
    }
    
    await this.$store.dispatch('jcs/getJcsByMunicipios', this.municipio);
    
    // Asignación segura de jcx
    this.jcx = this.user?.jc?.id || this.jcs[0]?.id || null;
    
    await this.initialize();
  } catch (error) {
    console.error("Error en created:", error);
    this.$store.commit('alert/setAlert', {
      status: true,
      message: 'Error cargando datos',
      color: 'error'
    });
  }
},

  methods: {
    irDetalles(item){
      this.$router.push(`/pc/${item.id}`)
    },
    callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
       
      },
    async initialize() {
      try {
        if((this.user.rol.id !== 1) && ( this.user.grupo_municipal !==true))
           this.jcx=this.user.jc.id;
        const {data} = await this.$axios.get(`api/pcs/by_joven_club/${this.jcx}`)
        this.items = data;
      } catch (error) {
        console.log(error);
      }
    },
    async actualizaJC() {
  // Validar que municipio sea un número válido
  if (!this.municipio || isNaN(this.municipio)) {
    console.error('Municipio inválido:', this.municipio);
    this.municipio = 1; // Valor por defecto
  }
  
  await this.$store.dispatch('jcs/getJcsByMunicipio', this.municipio);
},

async initialize() {
  try {
    // Validar jcx antes de usarlo
    if (!this.jcx || isNaN(this.jcx)) {
      console.error('JC inválido:', this.jcx);
      if (this.jcs.length > 0) {
        this.jcx = this.jcs[0].id;
      } else {
        throw new Error('No hay JCs disponibles');
      }
    }

    const { data } = await this.$axios.get(`api/pcs/by_joven_club/${this.jcx}`);
    this.items = data;
  } catch (error) {
    console.error("Error loading PCs:", error);
    this.$store.commit('alert/setAlert', {
      status: true,
      message: 'Error cargando computadoras',
      color: 'error'
    });
  }
},
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    trasladoItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogTras = true;
    },
    closeTras() {
      this.dialogTras = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
   

    async deleteItemConfirm() {
      // this.items.splice(this.editedIndex, 1)
      await this.$axios.delete(`api/pcs/${this.items[this.editedIndex].id}`);
      this.callAlert({status: true, message: 'Se elimino satifactoriamente', color: 'primary'});
      this.initialize();
      this.closeDelete();
    },

    close() {
      this.dialog = false;this.dialogTras = false;
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
        if (!this.editedItem.nombre || !this.editedItem.numero || !this.editedItem.ip) {
          this.callAlert({
            status: true,
            message: 'Los campos Nombre, N. Inventario e IP son requeridos',
            color: 'warning'
          });
          return;
        }

        if (this.editedIndex > -1) {
          // Update existing PC
          await this.$axios.put(`api/pcs/${this.items[this.editedIndex].id}`, this.editedItem);
          this.callAlert({
            status: true, 
            message: 'Se modificó correctamente', 
            color: 'success'
          });
        } else {
          // Create new PC
          const newPC = {
            ...this.editedItem,
            jc: this.user.rol.id === 4 ? this.user.jc.id : this.editedItem.jc
          };

          await this.$axios.post("api/pcs", newPC);
          this.callAlert({
            status: true,
            message: 'Se agregó correctamente',
            color: 'success'
          });
        }

        await this.initialize();
        this.close();
      } catch (error) {
        console.error('Error saving PC:', error);
        this.callAlert({
          status: true,
          message: error.response?.data?.message || 'Error al guardar la computadora',
          color: 'error'
        });
      }
    },

    close() {
      this.dialog = false;
      this.dialogTras = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};

</script>
