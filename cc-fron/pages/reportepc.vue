<template>
  <div>
    <v-data-table
      style="background-color: #fff9c4"
      :headers="headers"
      :items="accessos"
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
                <!--<v-icon small @click="pdf(json)"></v-icon> -->
                <v-icon small @click.prevent="pdf()">mdi-file-outline</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
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

              <!-- <v-spacer></v-spacer>  -->
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Filtro</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nombrejc"
                        label="Nombre JC"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nombrepc"
                        label="Nombre PC"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.inventario"
                        label="Inventario"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.admin"
                        label="Administrador JC"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.supervisor"
                        label="Supervisor"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        type="text"
                        v-model="editedItem.tecnico"
                        label="Técnico"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select v-model="causa" :items="states" label="Causa">
                      </v-select>
                    </v-col>
                    <!-- <v-col cols="12" sm="6" md="4">
                      <datepicker
                        :bootstrap-styling="true"
                        class="form-control"
                        :open-date=null
                        :format="customFormatter"
                        v-model="event_at"
                      >
                      </datepicker>
                    </v-col> -->
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="initialize"
                  >Buscar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- <template v-slot:item.createdAt="{ item }" >
      {{lee_fecha(item.createdAt)}}
    </template>
    <template v-slot:item.actions= "{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template> -->
    </v-data-table>
  </div>
</template>

<script>
// { text: 'Id', value: 'id'},
import pdf from "vue-pdf";
import download from "downloadjs";
//import Datepicker from 'vuejs-datepicker'
export default {
  data: () => ({
    usuarioActivo: "",
    dialog: false,
    dialogDelete: false,
    jcx: 0,
    municipio: null,
    provincia: 1,
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
      {
        text: "NombreJc",
        align: "start",
        sortable: false,
        value: "nombrejc",
        width: "4%",
      },
      {
        text: "NombrePC",
        align: "start",
        sortable: false,
        value: "nombrepc",
        width: "4%",
      },
      {
        text: "Técnico",
        align: "start",
        sortable: false,
        value: "tecnico",
        width: "15%",
      },
      {
        text: "Supervisor",
        align: "start",
        sortable: false,
        value: "supervisor",
        width: "15%",
      },
      {
        text: "Causa",
        align: "start",
        sortable: false,
        value: "causa",
        width: "12%",
      },
      {
        text: "AdminJC",
        align: "start",
        sortable: false,
        value: "admin",
        width: "15%",
      },
      {
        text: "Fecha |--| hora",
        align: "start",
        sortable: false,
        value: "createdAt",
        width: "25%",
      },
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
    },
    defaultItem: {
      nombrejc: "",
      nombrepc: "",
      causa: "",
      tecnico: "",
      admin: "",
      supervisor: "",
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
          this.editedItem.jc = this.jcx;
          this.initialize();
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

  created() {
    //this.$store.dispatch("provincias/getProvincias");
    this.$store.dispatch("roles/getRoles");
    //this.$store.dispatch("municipios/getMunByProvincia", this.user['jc']['municipio']['provincia']['id']);

    this.$store.dispatch('provincias/getProvincias');
    this.provincia = this.user.jc.municipio.provincia.id;
    this.$store.dispatch('municipios/getMunByProvincia', this.provincia);
    this.municipio = this.user.jc.municipio.id;
    this.$store.dispatch('jcs/getJcsByMunicipios',this.municipio);
    this.jcx = this.user.jc.id; 

    //this.$store.dispatch('filtro/getFiltro/');
    this.jcx = this.user.jc.id; 
    this.initialize();
  },

  methods: {
    callAlert(objetoAlerta) {
      return this.$store.commit("alert/setAlert", objetoAlerta);
    },

    async initialize (){

      try {
        const {data} = await this.$axios.get(`api/accesos`);

        this.accessos = [];
        if(this.jcs.length > 0)
        {
        const selectedJC = await this.jcs.find(x => x.id === this.jcx)
        let filter = {
          nombrejc: selectedJC.nombre
        }

          await this.filtrarPorJC(filter)

        }

      } catch (error) {
        console.log(error);
      }
    },

    async filtrarPorJC(filter) {
      try {
        const { data } = await this.$axios.get('api/accesos/by/' + JSON.stringify(filter));
        this.accessos = data;
      } catch (error) {
        console.log(error);
      }
    },

    async filter() {
      //alert(`api/accesos/by/`+JSON.stringify(this.editedItem));//this.json

      try {
        this.dialog = false;

        const {
          nombrejc,
          nombrepc,
          causa,
          tecnico,
          admin,
          supervisor,
          inventario,
        } = this.editedItem;
        this.jsonX = this.editedItem;

        let filter = {
          nombrejc,
          nombrepc,
          causa,
          tecnico,
          admin,
          inventario,
          supervisor,
        };

        const { data } = await this.$axios.get('api/accesos/by/' + JSON.stringify(filter));

        this.accessos = data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async pdf() {
      await this.$axios
        .get(`api/accesos/export/pdf/` + JSON.stringify(this.jsonX), {
          responseType: "blob",
        })
        .then((result) => {
          const content = result.headers["content-type"];
          download(result.data, "Reporte.pdf", content);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async actualizaJC() {
      this.$store.dispatch("jcs/getJcsByMunicipio", this.municipio);
    },
    async actualizaMun() {
      this.$store.dispatch("municipios/getMunByProvincia", this.provincia);
    },
    lee_fecha(val) {
      var date = new Date(val);
      return (
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
      //date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      //getHours()+":"+getMinutes()+":"+getSeconds()
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
      await this.$axios.delete(
        `api/municipios/${this.items[this.editedIndex].id}`
      );
      this.callAlert({
        status: true,
        message: "Se elimino satifactoriamente",
        color: "primary",
      });
      this.initialize();
      this.closeDelete();
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
    },
  },
};
</script>
