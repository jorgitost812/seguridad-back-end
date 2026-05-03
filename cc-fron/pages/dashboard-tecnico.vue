<template>
    <div>
      <!-- Título de bienvenida -->
      <v-card class="mb-4 text-center" style="background-color: #FFF9C4" elevation="2">
        <v-card-text>
          <h2 class="text-h5 font-weight-bold">Bienvenido {{ user?.nombre || '' }} ({{ user?.rol?.nombre || '' }})</h2>
        </v-card-text>
      </v-card>
  
      <!-- Botón para agregar nueva computadora -->
      <v-card class="mb-4" style="background-color: #FFF9C4" elevation="2">
        <v-card-text class="text-right">
          <v-btn color="primary" dark @click="abrirDialogNuevo">
            <v-icon left>mdi-plus</v-icon>
            Agregar Computadora
          </v-btn>
        </v-card-text>
      </v-card>
  
      <!-- Tabla de Computadoras -->
      <v-data-table
        style="background-color: #FFF9C4"
        :headers="headers"
        :items="computadoras"
        :items-per-page="20"
        sort-by="nombre"
        class="elevation-1"
        :loading="cargando"
      >
        <template v-slot:top>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Computadoras del Joven Club</v-toolbar-title>
          </v-toolbar>
        </template>
  
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editarComputadora(item)">mdi-pencil</v-icon>
          <v-icon small @click="eliminarComputadora(item)">mdi-delete</v-icon>
        </template>
  
        <template v-slot:no-data>
          <div class="text-center pa-4">
            No hay computadoras disponibles para este Joven Club
          </div>
        </template>
      </v-data-table>
  
      <!-- Diálogo para Agregar/Editar Computadora -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitulo }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formComputadora.numero"
                    label="N. Inventario"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formComputadora.nombre"
                    label="Nombre de la Computadora"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formComputadora.ip"
                    label="IP"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formComputadora.setup"
                    label="Pass Setup"
                    type="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formComputadora.admin"
                    label="Pass Admin"
                    type="password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cerrarDialog">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="guardarComputadora">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Diálogo de confirmación de eliminación -->
      <v-dialog v-model="dialogEliminar" max-width="400px">
        <v-card>
          <v-card-title class="text-h5">¿Estás seguro?</v-card-title>
          <v-card-text>
            ¿Deseas eliminar la computadora <strong>{{ computadoraAEliminar?.nombre }}</strong>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogEliminar = false">Cancelar</v-btn>
            <v-btn color="red darken-1" text @click="confirmarEliminar">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { encrypt } from '@/helpers/crypto.helper';
  
  export default {
    layout: 'usuario',
  
    data: () => ({
      cargando: false,
      computadoras: [],
      dialog: false,
      dialogEliminar: false,
      dialogTitulo: '',
      editandoId: null,
      computadoraAEliminar: null,
      formComputadora: {
        numero: '',
        nombre: '',
        ip: '',
        setup: '',
        admin: ''
      },
      headers: [
        { text: "Nombre", align: "start", sortable: true, value: "nombre", width: '25%' },
        { text: "Inventario", value: "numero", width: '20%' },
        { text: "IP", value: "ip", width: '20%' },
        { text: "Acciones", value: "actions", sortable: false, width: '15%' }
      ]
    }),
  
    computed: {
      user() {
        return this.$store.state.auth.user;
      },
      jcId() {
        return this.user?.jc?.id;
      }
    },
  
    async created() {
      console.log('=== dashboard-tecnico created ===');
      console.log('JC ID:', this.jcId);
      await this.cargarComputadoras();
    },
  
    methods: {
      async cargarComputadoras() {
        if (!this.jcId) {
          console.error('Usuario no tiene Joven Club asignado');
          this.computadoras = [];
          return;
        }
  
        this.cargando = true;
        try {
          const url = `api/pcs/by_joven_club/${this.jcId}`;
          console.log('Haciendo petición a:', url);
          const { data } = await this.$axios.get(url);
          console.log('Respuesta de la API:', data);
          this.computadoras = data;
        } catch (error) {
          console.error('Error cargando computadoras:', error);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: `Error al cargar las computadoras: ${error.message}`,
            color: 'error'
          });
          this.computadoras = [];
        } finally {
          this.cargando = false;
        }
      },
  
      abrirDialogNuevo() {
        this.dialogTitulo = 'Agregar Computadora';
        this.editandoId = null;
        this.formComputadora = {
          numero: '',
          nombre: '',
          ip: '',
          setup: '',
          admin: ''
        };
        this.dialog = true;
      },
  
      editarComputadora(item) {
        this.dialogTitulo = 'Editar Computadora';
        this.editandoId = item.id;
        this.formComputadora = {
          numero: item.numero,
          nombre: item.nombre,
          ip: item.ip,
          setup: '',
          admin: ''
        };
        this.dialog = true;
      },
  
      eliminarComputadora(item) {
        this.computadoraAEliminar = item;
        this.dialogEliminar = true;
      },
  
      async guardarComputadora() {
        if (!this.formComputadora.nombre || !this.formComputadora.numero) {
          this.$store.commit('alert/setAlert', {
            status: true,
            message: 'Nombre y número de inventario son obligatorios',
            color: 'error'
          });
          return;
        }
  
        try {
          // Payload CORRECTO según lo que espera el backend
          const datos = {
            nombre: this.formComputadora.nombre,
            numero: this.formComputadora.numero,
            ip: this.formComputadora.ip || '',
            admin: this.formComputadora.admin || '',
            setup: this.formComputadora.setup || ''
          };
  
          console.log('Enviando datos a API:', datos);
  
          if (this.editandoId) {
            await this.$axios.put(`api/pcs/${this.editandoId}`, datos);
            this.$store.commit('alert/setAlert', {
              status: true,
              message: 'Computadora actualizada correctamente',
              color: 'success'
            });
          } else {
            await this.$axios.post('api/pcs', datos);
            this.$store.commit('alert/setAlert', {
              status: true,
              message: 'Computadora agregada correctamente',
              color: 'success'
            });
          }
          
          this.cerrarDialog();
          await this.cargarComputadoras();
        } catch (error) {
          console.error('Error guardando computadora:', error);
          console.error('Detalles del error:', error.response?.data);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: `Error al guardar: ${error.response?.data?.message || error.message}`,
            color: 'error'
          });
        }
      },
  
      async confirmarEliminar() {
        try {
          await this.$axios.delete(`api/pcs/${this.computadoraAEliminar.id}`);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: 'Computadora eliminada correctamente',
            color: 'success'
          });
          this.dialogEliminar = false;
          await this.cargarComputadoras();
        } catch (error) {
          console.error('Error eliminando computadora:', error);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: `Error al eliminar: ${error.response?.data?.message || error.message}`,
            color: 'error'
          });
        }
      },
  
      cerrarDialog() {
        this.dialog = false;
        this.formComputadora = {
          numero: '',
          nombre: '',
          ip: '',
          setup: '',
          admin: ''
        };
        this.editandoId = null;
      }
    }
  };
  </script>