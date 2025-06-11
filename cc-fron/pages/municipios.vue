<template>
  <div>
  <v-data-table style="background-color: #FFF9C4"
    :headers="headers"
    :items="items"
    sort-by="id"
    class="elevation-5"
  >
    <template v-slot:top>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title  >Dirección Provincial y Municipios</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small color="primary" fab v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
           
            <v-col cols="12" sm="6" md="4" v-if="user.rol.id < 2">
              <v-select class="dark" :class="['mt-5','ml-16']" style="width: 60%;"  
                :items="provincias.list"
                label="Provincia"
                item-text="nombre"
                item-value="id"
                v-model="provincia">
              </v-select>
            </v-col>
            <v-spacer></v-spacer> 
          </template>
          <v-card >
            <v-card-title >
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text >
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="user.rol.id < 2">
                      <v-select 
                        :items="provincias.data" 
                        label="Provincia" 
                        item-text="nombre" 
                        item-value="id" 
                        v-model="editedItem.provincia">
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card >
            <v-card-title class="text-h5">Estás seguro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Aceptar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions= "{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
        
  </v-data-table>
  </div>
</template>

<script>
// { text: 'Id', value: 'id'},
  export default {
    middleware: 'auth',
    data: () => ({
      usuarioActivo: '',
      dialog: false,
      selectedProvinciaId: null,
      dialogDelete: false,
      provincia: null,
      headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Provincia', value: 'provincia.nombre' }
    ],
      items: [],
      Misprovincias: [],
      editedIndex: -1,
      editedItem: {
        nombre: '',
        provincia: null
      },
      defaultItem: {
        nombre: '',
        provincia: null
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editando registro'
      },
       user() {
        return this.$store.state.auth.user;
    },
      roles() {
      return this.$store.state.roles.list;
    },
    provincias() {
      return this.$store.state.provincias
    },
    municipios() {
      return this.$store.state.municipios.list
    }
    },
    

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      municipio: {
         handler: function(val) { 
         //this.provincia = this.user.jc.municipio.id;  
         
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
  try {
    // Cargar provincias y roles
    await Promise.all([
      this.$store.dispatch('provincias/getProvincias'),
      this.$store.dispatch('roles/getRoles')
    ]);

    // Establecer provincia si el usuario la tiene asignada
    const user = this.$auth.user;
    if (user?.jc?.municipio?.provincia?.id) {
      this.provincia = user.jc.municipio.provincia.id;
    } else {
      console.warn('Usuario no tiene provincia asignada');
      this.provincia = 1; // valor por defecto
    }

    // Inicializar municipios
    await this.initialize();
  } catch (error) {
    console.error('Error en created:', error);
    this.$store.commit('alert/setAlert', {
      status: true,
      message: 'Error cargando datos iniciales',
      color: 'error'
    });
  }
}
,

    methods: {
      callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
      },
      
      async initialize () {
  try {
    const {data} = await this.$axios.get(`api/municipios/by_provincia/${this.provincia}`)
    this.items = data;
  } catch(error) {
    console.error('Error loading municipios:', error);
    this.callAlert({
      status: true,
      message: 'Error cargando municipios',
      color: 'error'
    });
  }
},
      actualizaMun(){
      //alert("actualizaMun"+this.provincia);
      this.$store.dispatch('jcs/getMunByProvincia', this.provincia);
      },
      actualizaJC(){
      this.$store.dispatch('jcs/getJcsByMunicipio', this.municipio);
      },
      editItem (item) {
        
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        await this.$axios.delete(`api/municipios/${this.items[this.editedIndex].id}`);
        this.callAlert({status: true, message: 'Se elimino satifactoriamente', color: 'primary'});
        this.initialize();
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        
        })
      },

      async save() {
      if (this.editedIndex > -1) {
        try {
          await this.$axios.put(`api/municipios/${this.items[this.editedIndex].id}`, {
            nombre: this.editedItem.nombre,
            provincia: this.editedItem.provincia
          });
          this.callAlert({status: true, message: 'Se modificó satisfactoriamente', color: 'primary'});
          this.initialize();
        } catch (error) {
          this.callAlert({status: true, message: 'Error al modificar', color: 'error'});
        }
      } else {
        try {
          await this.$axios.post('api/municipios', {
            nombre: this.editedItem.nombre,
            provincia: this.editedItem.provincia
          });
          this.callAlert({status: true, message: 'Se creó satisfactoriamente', color: 'primary'});
          this.initialize();
        } catch (error) {
          this.callAlert({status: true, message: 'Error al crear', color: 'error'});
        }
      }
      this.close();
    },
    },
  }
</script>
