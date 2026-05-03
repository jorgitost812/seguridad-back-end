<template>
    <div>
      <v-card class="mb-4 text-right" color="#FFF9C4" elevation="2">
        <v-card-text>
          <v-btn color="primary" dark @click="abrirDialogNuevo">
            <v-icon left>mdi-plus</v-icon>Agregar Instructor
          </v-btn>
        </v-card-text>
      </v-card>
  
      <v-data-table
        style="background-color: #FFF9C4"
        :headers="headers"
        :items="instructores"
        :loading="cargando"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editarInstructor(item)">mdi-pencil</v-icon>
          <v-icon small @click="eliminarInstructor(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
  
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>{{ dialogTitulo }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="form.nombre" label="Nombre" required></v-text-field>
            <v-text-field v-model="form.apellidos" label="Apellidos" required></v-text-field>
            <v-text-field v-model="form.email" label="Correo" type="email" required></v-text-field>
            <v-text-field v-model="form.password" label="Contraseña" type="password" placeholder="Dejar en blanco para no cambiar"></v-text-field>
            <v-checkbox v-model="form.grupo_municipal" label="G. Municipal"></v-checkbox>
            <v-select 
              :items="roles" 
              label="Rol" 
              item-text="nombre" 
              item-value="id" 
              v-model="form.rolId"
              required
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog=false">Cancelar</v-btn>
            <v-btn text @click="guardar">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="dialogEliminar" max-width="400px">
        <v-card>
          <v-card-title>¿Eliminar {{ instructorEliminar?.nombre }} {{ instructorEliminar?.apellidos }}?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogEliminar=false">Cancelar</v-btn>
            <v-btn text @click="confirmarEliminar">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'usuario',
    data: () => ({
      cargando: false,
      instructores: [],
      roles: [],
      dialog: false,
      dialogEliminar: false,
      dialogTitulo: '',
      editandoId: null,
      instructorEliminar: null,
      form: {
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        grupo_municipal: false,
        rolId: null
      },
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Apellidos", value: "apellidos" },
        { text: "Correo", value: "email" },
        { text: "Rol", value: "rol.nombre" },
        { text: "Acciones", value: "actions", sortable: false }
      ]
    }),
    computed: {
      user() { return this.$store.state.auth.user; },
      jcId() { return this.user?.jc?.id; }
    },
    async created() {
      await this.cargarRoles();
      await this.cargarInstructores();
    },
    methods: {
      async cargarRoles() {
        try {
          const { data } = await this.$axios.get('api/roles');
          this.roles = data;
        } catch (error) {
          console.error('Error cargando roles:', error);
        }
      },
      async cargarInstructores() {
        if (!this.jcId) return;
        this.cargando = true;
        try {
          const { data } = await this.$axios.get(`api/usuarios/by_joven_club/${this.jcId}`);
          this.instructores = data;
        } catch (error) {
          console.error('Error cargando instructores:', error);
        } finally {
          this.cargando = false;
        }
      },
      abrirDialogNuevo() {
        this.dialogTitulo = 'Agregar Instructor';
        this.editandoId = null;
        this.form = {
          nombre: '',
          apellidos: '',
          email: '',
          password: '',
          grupo_municipal: false,
          rolId: null
        };
        this.dialog = true;
      },
      editarInstructor(item) {
        console.log('Editando instructor:', item);
        this.dialogTitulo = 'Editar Instructor';
        this.editandoId = item.id;
        this.form = {
          nombre: item.nombre || '',
          apellidos: item.apellidos || '',
          email: item.email || '',
          password: '', // No mostrar la contraseña existente
          grupo_municipal: item.grupo_municipal || false,
          rolId: item.rol?.id || null
        };
        this.dialog = true;
      },
      eliminarInstructor(item) {
        this.instructorEliminar = item;
        this.dialogEliminar = true;
      },
      async guardar() {
        // Validar campos obligatorios
        if (!this.form.nombre || !this.form.apellidos || !this.form.email || !this.form.rolId) {
          this.$store.commit('alert/setAlert', {
            status: true,
            message: 'Nombre, apellidos, email y rol son obligatorios',
            color: 'error'
          });
          return;
        }
  
        try {
          const datos = {
            nombre: this.form.nombre.trim(),
            apellidos: this.form.apellidos.trim(),
            email: this.form.email.trim(),
            grupo_municipal: this.form.grupo_municipal,
            rolId: this.form.rolId,
            jcId: this.jcId  // Enviamos el JC del administrador
          };
  
          // Solo incluir password si se proporcionó una nueva
          if (this.form.password && this.form.password.trim() !== '') {
            datos.password = this.form.password;
            datos.confirmPassword = this.form.password;
          }
  
          console.log('Guardando instructor:', datos);
  
          if (this.editandoId) {
            // EDITAR
            await this.$axios.put(`api/usuarios/${this.editandoId}`, datos);
            this.$store.commit('alert/setAlert', {
              status: true,
              message: 'Instructor actualizado correctamente',
              color: 'success'
            });
          } else {
            // CREAR NUEVO
            if (!datos.password) {
              this.$store.commit('alert/setAlert', {
                status: true,
                message: 'La contraseña es obligatoria para nuevos instructores',
                color: 'error'
              });
              return;
            }
            await this.$axios.post('api/usuarios', datos);
            this.$store.commit('alert/setAlert', {
              status: true,
              message: 'Instructor agregado correctamente',
              color: 'success'
            });
          }
          
          this.dialog = false;
          await this.cargarInstructores();
        } catch (error) {
          console.error('Error guardando instructor:', error);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: error.response?.data?.message || 'Error al guardar el instructor',
            color: 'error'
          });
        }
      },
      async confirmarEliminar() {
        try {
          await this.$axios.delete(`api/usuarios/${this.instructorEliminar.id}`);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: 'Instructor eliminado correctamente',
            color: 'success'
          });
          this.dialogEliminar = false;
          await this.cargarInstructores();
        } catch (error) {
          console.error('Error eliminando instructor:', error);
          this.$store.commit('alert/setAlert', {
            status: true,
            message: error.response?.data?.message || 'Error al eliminar el instructor',
            color: 'error'
          });
        }
      }
    }
  };
  </script>