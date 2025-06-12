<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-toolbar color="primary" dark>
              <v-toolbar-title>PC: {{ pc.nombre || 'Cargando...' }} </v-toolbar-title>
            </v-toolbar>            
            <v-card-text style="background-color: #FFF9C4">
              <v-simple-table style="background-color: #FFF9C4">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td>IP: {{ pc.ip || '-' }}</td>
                    </tr>
                    <tr>
                      <td>Numero: {{ pc.numero || '-' }}</td>
                    </tr>
                    <tr>
                      <!-- Corregido: Validación anidada para jc -->
                      <td v-if="pc.jc">JC: {{ pc.jc.nombre }}</td>
                      <td v-else>JC: No asignado</td>
                    </tr> 
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Autorización para mostrar contraseñas</v-toolbar-title>
            </v-toolbar>
            <v-card-text style="background-color: #FFF9C4">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select 
                      v-model="causa"
                      :items="states"
                      label="Causa"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select 
                      v-model="supervisor"
                      :items="usuariosFiltrados"
                      item-text="email"
                      item-value="email"
                      label="Autoriza"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>  
            </v-card-text>
            
            <v-card-actions style="background-color: #FFF9C4">
              <v-row>
                <v-col cols="12">
                  <v-btn 
                    v-if="user.rol.id !== 8" 
                    color="primary" 
                    @click="AutorizaPWD"
                    :disabled="!supervisor || supervisor === ''"
                  >
                    <v-icon dark left>{{candado}}</v-icon>
                    {{registro_boton}}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>  
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card>
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Seguridad</v-toolbar-title>
            </v-toolbar>            
            <v-card-text style="background-color: #FFF9C4">
              <p ALIGN="left" :hidden="!showBoton">Incidencia reportada</p>
              <v-simple-table style="background-color: #FFF9C4">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td>Admin: </td>
                      <td> 
                        <v-text-field 
                          disabled
                          v-model="admin"
                          :type="show ? 'text' : 'password'"
                        ></v-text-field>
                      </td>
                    </tr>
                    <tr>
                      <td>Setup: </td>
                      <td>
                        <v-text-field
                          disabled
                          v-model="setup"
                          :type="show ? 'text' : 'password'"
                        ></v-text-field>
                      </td>
                    </tr>               
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>  
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { decrypt } from '../helpers/crypto.helper'

export default {
  name: 'PCDetalle',
  props: {
    pcID: {
      type: String,
      required: true
    }
  },
  data: () => ({
    pc: {
      jc: {} // Estructura inicial para evitar errores
    },
    show: false,
    showBoton: false,
    states: ['Mantenimiento', 'Supervisión'],
    causa: 'Mantenimiento',
    supervisor: null,
    admin: '',
    setup: '',
    editedItem: {
      nombrejc: '',
      nombrepc: '',
      inventario: '',
      admin: '',
      tecnico: '',
      supervisor: '',
      causa: '',
    }
  }),
  computed: {
    user() {
      return this.$store.state.auth.user || {};
    },
    usuarioSupervisor() {
      return this.$store.state.usuarios.list || [];
    },
    // Filtrar supervisores válidos
    usuariosFiltrados() {
      return this.usuarioSupervisor.filter(u => 
        u.email && u.email !== this.user.email
      );
    },
    arregloAdmin() {
      return this.$store.state.usuarios.admin || [];
    },
    candado() {
      return this.showBoton ? 'mdi-eye-off' : 'mdi-notebook-plus';
    },
    registro_boton() {
      return this.showBoton ? 'Ocultar' : 'Registrar';
    }    
  },
  async created() { 
    await this.$store.dispatch('usuarios/getByRol', 6);
    await this.getPC();
  },
  methods: {
    callAlert(objetoAlerta) {
      return this.$store.commit('alert/setAlert', objetoAlerta)
    },
    
    async getPC() {
      try {
        // CORRECCIÓN: Usar prop pcID en lugar de $route.params.id
        const { data } = await this.$axios.get(`/api/pcs/${this.pcID}`);
        
        // Inicializar propiedades críticas
        this.pc = {
          ...data,
          jc: data.jc || {}
        };

        // Decrypt con validación
        this.admin = data.pwd ? decrypt(data.pwd) : '';
        this.setup = data.setupPwd ? decrypt(data.setupPwd) : '';
        
        // Cargar usuarios para JC
        if (this.pc.jc && this.pc.jc.id) {
          await this.$store.dispatch('usuarios/getByIdJovenClubAndNombreRol', {
            jcId: this.pc.jc.id,
            rolId: 6
          });
        }
      } catch (error) {
        console.error('Error cargando PC:', error);
        this.callAlert({
          status: true, 
          message: 'Error cargando datos de la computadora', 
          color: 'error'
        });
      }
    },
    
    AutorizaPWD() {
      // Validación mejorada
      if (!this.supervisor || !this.supervisor.email) {
        this.callAlert({
          status: true, 
          message: 'Seleccione un supervisor válido', 
          color: '#FF6F00'
        });
        return;
      }
      
      if (!this.showBoton) {
        this.editedItem = {
          nombrejc: this.pc.jc ? this.pc.jc.nombre : 'No asignado',
          nombrepc: this.pc.nombre,
          inventario: this.pc.numero,
          admin: this.arregloAdmin.length,
          tecnico: this.user.email,
          supervisor: this.supervisor.email,
          causa: this.causa
        };
        
        this.save();
      } else {
        this.showBoton = !this.showBoton;
        this.show = !this.show;
      }
    },
    
    async save() {
  try {
    // Validaciones previas
    if (!this.pc || !this.pc.id) {
      throw new Error('Datos de PC no válidos');
    }

    const payload = {
      nombrejc: this.pc.jc ? String(this.pc.jc.nombre) : 'No asignado',
      nombrepc: String(this.pc.nombre),
      inventario: String(this.pc.numero),
      admin: false,
      tecnico: String(this.user.email),
      supervisor: String(this.supervisor.email),
      causa: String(this.causa),
      computadora_id: Number(this.pcID)
    };

    // Guardar acceso
    const response = await this.$axios.post("/api/accesos", payload);

    if (response.data) {
      this.showBoton = true;
      this.show = true;
      
      this.callAlert({
        status: true,
        message: 'Acceso registrado correctamente',
        color: 'success'
      });

      // Enviar notificación por email
      await this.$axios.post(`mail/notification`, payload);
    }

  } catch (error) {
    console.error('Error en save():', error);
    this.callAlert({
      status: true,
      message: `Error: ${error.response?.data?.message || error.message}`,
      color: 'error'
    });
  }
}
  }
}
</script>