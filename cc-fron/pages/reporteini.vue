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
        <v-toolbar-title  >Inicios de sesión</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small color="primary" fab v-bind="attrs" v-on="on">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
           
            <v-col cols="12" sm="6" md="4" >
              <v-select class="dark" :class="['mt-5','ml-16']" style="width: 60%;"  
                :items="provincias.data"
                label="Provincia"
                item-text="nombre"
                item-value="id"
                v-model="provincia">
              </v-select>
            </v-col>
            <v-spacer></v-spacer> 
          </template>
          
        </v-dialog>
        
      </v-toolbar>
         
    </template>
       
    <template v-slot:item.createdAt="{ item }" >
      {{fecha_hora(item.createdAt)}}
    </template>
  </v-data-table>
  </div>
</template>

<script>
// { text: 'Id', value: 'id'},
  export default {
    data: () => ({
      usuarioActivo: '',
      dialog: false,
      dialogDelete: false,
      provincia: 11,
      separa: '',
      fecha: '',
      hora: '',
      headers: [
       { text: 'Correo', align: 'start', sortable: false, value: 'email', width: '4%'},
       { text: 'Fecha  y  Hora', align: 'start', sortable: false, value: 'createdAt', width: '25%'},               
            
      ],
      items: [],
      Misprovincias: [],
      editedIndex: -1,
      editedItem: {
        email: '',
        
      },
      defaultItem: {
        email: '',
       
      },
    }),

    computed: {
    user() {
        return this.$store.state.auth.user;
    },
      roles() {
      return this.$store.state.roles.list;
    },
       provincias() {
        return this.$store.state.provincias.list;
      }
    },

    watch: {
      
      provincia: {
        handler: function(val) {
          this.initialize();
      },
        deep: true
      }
    },

    created () {
      this.initialize();
      this.$store.dispatch('provincias/getProvincias');
      this.$store.dispatch('roles/getRoles');
    },

    methods: {
      callAlert(objetoAlerta) {
        return this.$store.commit('alert/setAlert', objetoAlerta)
      },
      
      fecha_hora(val){
       var date = new Date(val);
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        //date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        //getHours()+":"+getMinutes()+":"+getSeconds()
      },
     
      async initialize () {
        try {
          const {data} = await this.$axios.get(`api/inisesion`)
          this.items = data;
        } catch(error) {
          console.log(error);
        }
      },
    },
  }
</script>
