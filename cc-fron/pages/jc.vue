<template>
<div>
  <v-data-table style="background-color: #FFF9C4"
    :headers="headers"
    :items="items"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Entidades</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small color="primary" fab v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn small class="mr-2" color="primary" fab  v-bind="attrs" v-on="on">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-col cols="12" sm="6" md="4" v-if="user.rol.id <3">  
                <v-select  class="dark" :class="['mt-5','ml-16']" style="width: 60%;"
                  :items="municipios" 
                  label="Municipio" 
                  item-text="nombre" 
                  item-value="id" 
                  v-model="municipio">
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
                    <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="user.rol.id < 3">
                    <v-select 
                      :items="municipios" label="Municipio" item-text="nombre" item-value="id"
                      v-model="editedItem.municipio"
                  ></v-select>
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
      </v-toolbar>
    </template>
    <template v-slot:item.actions= "{ item }">
      <v-icon v-if="user.rol.id ===3" small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
      <v-icon v-if="user.rol.id ===3" small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    
  </v-data-table>
  </div>
</template>

<script>
//{ text: 'Id', value: "id" },
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      municipio: 1,
      headers: [
        { text: 'Nombre', align: 'start', sortable: false, value: "nombre", width: '30%' },
        { text: "Municipio", value: "municipio.nombre", width: '40%' },
        { text: 'Acción', value: 'actions', sortable: false , width: '15%'},
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        nombre: '',
        mun: null
      },
      defaultItem: {
        nombre: '',
        mun: null
      },
    }),

    computed: {
      formTitle () {
        if(this.editedIndex === -1) this.editItem.municipio = this.municipio;
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editando registro'
      },
      user() {
        return this.$store.state.auth.user;
      },
      municipios() {
        return this.$store.state.municipios.list;
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
          this.editedItem.municipio = this.municipio; 
          this.initialize();
      },
        deep: true
      }
    },

    created () {
      
      this.initialize();
      this.$store.dispatch('municipios/getMunicipios');
      this.municipio = this.user.jc.municipio.id;
      
    },

    methods: {
      callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
      },
      async initialize () {
        if(this.user.rol.id === 3){
        this.municipio = this.user.jc.municipio.id;
      } 
        try {
          //const {data} = await this.$axios.get('api/jcs')
         
          const {data} = await this.$axios.get(`api/jcs/by_municipio/${this.municipio}`)
          this.items = data;
        } catch(error) {
          console.log(error);
        }
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
        await this.$axios.delete(`api/jcs/${this.items[this.editedIndex].id}`);
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

      async save () {

        //Se ejeucata para modificar uno existente
        if (this.editedIndex > -1) {
          // Object.assign(this.items[this.editedIndex], this.editedItem)
          await this.$axios.put(`api/jcs/${this.items[this.editedIndex].id}`, this.editedItem);
          this.callAlert({status: true, message: 'Se modifico satifactoriamente', color: 'primary'});
          this.initialize()
        } else {
          
          // Se ejecuta para crear uno nuevo
          try {
            await this.$axios.post(`api/jcs`, this.editedItem);
            this.callAlert({status: true, message: 'Se agrego satifactoriamente', color: 'primary'});
            this.initialize();
        } catch (error) {
           this.callAlert({status: true, message: 'No se agrego ', color: 'error'});
        }
        }
        this.close()
      },
    },
  }
</script>
