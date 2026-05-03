<template>
  <div>
    <v-data-table
      style="background-color: #fff9c4"
      :headers="headers"
      :items="filteredAccesos"
      sort-by="id"
      class="elevation-5"
    >
      <template v-slot:top>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Accesos a las contraseñas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn small class="ml-2" color="primary" fab v-bind="attrs" v-on="on">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn small class="ml-2" color="primary" fab>
                <v-icon small @click.prevent="pdf()">mdi-file-outline</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              
              <!-- Filtros: solo visibles para roles con id < 5 (Administradores) -->
              <template v-if="user.rol.id < 5">
                <v-col cols="12" sm="6" md="4" align="right">
                  <v-row>
                    <v-select
                      class="dark"
                      :class="['mt-5']"
                      style="width: 45%"
                      :disabled="user.rol.id > 2"
                      :items="municipios"
                      label="Municipios"
                      item-text="nombre"
                      item-value="id"
                      v-model="municipio"
                    >
                    </v-select>
                    <v-select
                      class="dark"
                      :class="['mt-5', 'ml-3']"
                      style="width: 45%"
                      :disabled="user.rol.id > 3"
                      :items="jcs"
                      label="Jclub"
                      item-text="nombre"
                      item-value="id"
                      v-model="jcx"
                    >
                    </v-select>
                  </v-row>
                </v-col>

                <v-col cols="12" sm="6" md="4" align="right">
                  <v-select
                    align="right"
                    class="dark"
                    :class="['mt-5']"
                    style="width: 46%"
                    :disabled="user.rol.id > 1"
                    :items="provincias.data"
                    label="Provincia"
                    item-text="nombre"
                    item-value="id"
                    v-model="provincia"
                  >
                  </v-select>
                </v-col>
              </template>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Filtro</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nombrejc" label="Nombre JC"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nombrepc" label="Nombre PC"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.inventario" label="Inventario"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.admin" label="Administrador JC"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.supervisor" label="Supervisor"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.tecnico" label="Técnico"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select v-model="causa" :items="states" label="Causa"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="initialize">Buscar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import download from "downloadjs";

export default {
  middleware: 'auth',
  data: () => ({
    filteredAccesos: [],
    allAccesos: [],
    usuarioActivo: "",
    loading: false,
    dialog: false,
    dialogDelete: false,
    jcx: null,
    municipio: null,
    provincia: null,
    states: ["Todos", "Mantenimiento", "Supervisión"],
    causa: "Todos",
    jsonX: {
      causa: "",
      nombrejc: "Tunas 1",
      nombrepc: "",
      supervisor: "",
      tecnico: "",
      admin: "",
    },
    headers: [
      { text: 'JC', value: 'nombrejc' },
      { text: 'PC', value: 'nombrepc' },
      { text: 'Técnico', value: 'tecnico' },
      { text: 'Supervisor', value: 'supervisor' },
      { text: 'Causa', value: 'causa' },
      { text: 'Fecha', value: 'displayDate' }
    ],
    items: [],
    accessos: [],
    Misprovincias: [],
    editedIndex: -1,
    editedItem: {
      nombrejc: "",
      nombrepc: "",
      causa: "",
      tecnico: "",
      admin: "",
      supervisor: "",
      inventario: ""
    },
    defaultItem: {
      nombrejc: "",
      nombrepc: "",
      causa: "",
      tecnico: "",
      admin: "",
      supervisor: "",
      inventario: ""
    },
  }),

  computed: {
    accesos() {
      return this.$store.state.reportepc.list;
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
    },
    filtro() {
      return this.$store.state.filtro.list;
    },
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
        if (val) {
          const selectedJC = this.jcs.find(jc => jc.id === val);
          if (selectedJC) {
            this.filterByJC(selectedJC.nombre);
          }
        }
      },
      deep: true
    },
    municipio: {
      handler: function (val) {
        this.actualizaJC();
        this.initialize();
      },
      deep: true,
    },
    provincia: {
      handler: function (val) {
        this.actualizaMun();
        this.initialize();
      },
      deep: true,
    },
  },

  async created() {
    try {
      // Si es AdministradorJC (id 5), forzar filtro por su JC
      if (this.user.rol.id === 5) {
        this.jcx = this.user.jc.id;
        const selectedJC = this.jcs.find(jc => jc.id === this.jcx);
        if (selectedJC) {
          await this.filterByJC(selectedJC.nombre);
        }
      } else {
        await this.initialize();
      }
      if (this.$auth.user?.jc?.nombre) {
        this.filterByJC(this.$auth.user.jc.nombre);
      }
    } catch (error) {
      console.error('Error in created:', error);
    }
  },

  methods: {
    lee_fecha(val) {
      if (!val) return '';
      const date = new Date(val);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async initialize() {
      try {
        this.loading = true;
        
        const { data } = await this.$axios.get('api/accesos', {
          headers: {
            'Authorization': `Bearer ${this.$auth.strategy.token.get()}`
          }
        });
        
        this.allAccesos = data.map(acceso => ({
          ...acceso,
          createdAt: acceso.createdAt
        }));
        
        this.filteredAccesos = this.allAccesos.map(acceso => ({
          ...acceso,
          displayDate: this.lee_fecha(acceso.createdAt)
        }));
        
      } catch (error) {
        console.error('Error loading accesos:', error);
        this.callAlert({
          status: true,
          message: 'Error cargando datos',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    filterByJC(jcNombre) {
      if (!jcNombre) return;
      
      this.filteredAccesos = this.allAccesos
        .filter(acceso => acceso.nombrejc === jcNombre)
        .map(acceso => ({
          ...acceso,
          displayDate: this.lee_fecha(acceso.createdAt)
        }));
    },

    actualizaJC() {
      this.$store.dispatch('jcs/getJcsByMunicipio', this.municipio);
    },

    actualizaMun() {
      this.$store.dispatch('municipios/getMunByProvincia', this.provincia);
    },

    callAlert(objetoAlerta) {
      return this.$store.commit('alert/setAlert', objetoAlerta);
    },

    close() {
      this.dialog = false;
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
    }
  }
};
</script>