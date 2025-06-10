<template>
  <div>
    <v-data-table 
      style="background-color: #FFF9C4"
      :headers="headers"
      :items="items"
      :loading="loading"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Joven Club</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          
          <template v-if="canEdit">
            <v-btn small color="primary" fab @click="dialog = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>

          <v-btn small class="mr-2" color="primary" fab>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>

          <v-col cols="12" sm="6" md="4" v-if="canSelectMunicipio">  
            <v-select
              class="dark"
              :class="['mt-5','ml-16']"
              style="width: 60%;"
              :items="municipios"
              label="Municipio"
              item-text="nombre"
              item-value="id"
              v-model="municipio"
              :loading="loadingMunicipios"
            ></v-select>
          </v-col>
        </v-toolbar>

        <!-- Dialog Forms -->
        <v-dialog v-model="dialog" max-width="500px">
          <!-- ...existing dialog content... -->
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <!-- ...existing delete dialog content... -->
        </v-dialog>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon 
          v-if="canEdit" 
          small 
          @click="editItem(item)" 
          class="mr-2"
        >
          mdi-pencil
        </v-icon>
        <v-icon 
          v-if="canEdit" 
          small 
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'JovenClub',
  middleware: 'auth',
  
  data: () => ({
    loading: false,
    loadingMunicipios: false,
    dialog: false,
    dialogDelete: false,
    municipio: null,
    headers: [
      { text: 'Nombre', align: 'start', sortable: true, value: "nombre", width: '30%' },
      { text: "Municipio", value: "municipio.nombre", width: '40%' },
      { text: 'Acción', value: 'actions', sortable: false, width: '15%' },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      nombre: '',
      municipio: null
    },
    defaultItem: {
      nombre: '',
      municipio: null
    },
  }),

  computed: {
    canEdit() {
      return this.$auth.user?.rol?.id === 3;
    },
    canSelectMunicipio() {
      return this.$auth.user?.rol?.id < 3;
    },
    user() {
      return this.$auth.user;
    },
    municipios() {
      return this.$store.state.municipios.list;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    municipio: {
      handler(val) {
        if (val) {
          this.editedItem.municipio = val;
          this.initialize();
        }
      }
    }
  },

  async created() {
    await this.$store.dispatch('municipios/getMunicipios');
    this.municipio = this.user?.jc?.municipio?.id;
    await this.initialize();
  },

  
methods: {
  callAlert(objetoAlerta) {
    return this.$store.commit('alert/setAlert', objetoAlerta)
  },
  async initialize() {
    try {
      this.loading = true;
      console.log('Current user:', this.user);
      console.log('Selected municipio:', this.municipio);
      
      if (!this.municipio) {
        console.warn('No municipio selected');
        return;
      }

      const response = await this.$axios.get(`api/jcs/by_municipio/${this.municipio}`);
      console.log('API Response:', response.data);
      
      this.items = response.data;
    } catch (error) {
      console.error('Error loading JCs:', error);
      this.callAlert({
        status: true,
        message: 'Error al cargar los Joven Club',
        color: 'error'
      });
    } finally {
      this.loading = false;
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
