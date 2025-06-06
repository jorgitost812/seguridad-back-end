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
        <v-toolbar-title  >Roles y sus funcionalidades</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small color="primary" fab v-bind="attrs" v-on="on" :disabled="user.rol.id !== 1">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            
            <v-spacer></v-spacer> 
          </template>
          <v-card >
            <v-card-title >
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text >
              <v-container>
                <v-row>
                  
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
                  </v-col>
                 <v-col cols="12" sm="6" md="4">
                      <v-select multiple
                        :items="funcionesroles.data" 
                        label="Funcionalidad" 
                        item-text="nombre" 
                        item-value="id" 
                        v-model="editedItem.funroles">
                        multiple
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
      <v-icon  v-if="user.rol.id <2" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
    </template>
        
  </v-data-table>
  </div>
</template>

<script>
  export default {
    data: () => ({
      usuarioActivo: '',
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Id', value: 'id', width: '3%'},
        { text: 'Nombre', align: 'start', sortable: false, value: 'nombre', width: '15%'},
        { text: 'Descripción', align: 'start', sortable: false, value: 'descripcion', width: '60%'},
        { text: 'Acción', value: 'actions', sortable: false, width: '15%'},
       
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        nombre: '',
        descripcion: '',
        funroles: null,
      },
      defaultItem: {
        nombre: '',
        descripcion: '',
        funroles: null,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editando registro'
      },
      user() {
        return this.$store.state.auth.user;
    },
      funcionesroles() {
        return this.$store.state.funcionesroles.list;
      },
      roles() {
      return this.$store.state.roles.list;
    },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize();
      this.$store.dispatch('funcionesroles/getfuncionesRoles');
      
    },

    methods: {
      callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
      },
      
      async initialize () {
        try {
          const {data} = await this.$axios.get('api/roles');
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
        await this.$axios.delete(`api/roles/${this.items[this.editedIndex].id}`);
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
          try{
          // Object.assign(this.items[this.editedIndex], this.editedItem)
          await this.$axios.put(`api/roles/${this.items[this.editedIndex].id}`, this.editedItem);
          this.callAlert({status: true, message: 'Se modifico satifactoriamente', color: 'primary'});
          this.initialize();
          }catch (error) {
            this.callAlert({status: true, message: 'No se modifico ', color: 'error'});
          }
        } else {
          // Se ejecuta para crear uno nuevo
          try {
            console.log(this.editedIndex);
            await this.$axios.post(`api/roles`, this.editedItem);
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
