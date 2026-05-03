<template>
  <div>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>PC: {{ pc?.nombre || 'Cargando...' }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text style="background-color: #FFF9C4">
        <v-simple-table>
          <tbody>
            <tr><th>IP:</th><td>{{ pc?.ip || '-' }}</td></tr>
            <tr><th>Número:</th><td>{{ pc?.numero || '-' }}</td></tr>
            <tr><th>Joven Club:</th><td>{{ pc?.jc?.nombre || 'No asignado' }}</td></tr>
          </tbody>
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
                v-model="supervisorSeleccionado"
                :items="supervisores"
                item-text="email"
                item-value="email"
                label="Autoriza"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>  
      </v-card-text>
      
      <v-card-actions style="background-color: #FFF9C4">
        <v-row>
          <v-col cols="12">
            <v-btn 
              color="primary" 
              @click="AutorizaPWD"
              :disabled="!supervisorSeleccionado"
            >
              <v-icon dark left>mdi-notebook-plus</v-icon>
              Registrar Acceso
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>  
    </v-card>
    
    <!-- Sección de contraseñas - se muestra SOLO después de registrar -->
    <v-card class="mt-4" v-if="mostrarContrasenas">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Contraseñas</v-toolbar-title>
      </v-toolbar>
      <v-card-text style="background-color: #FFF9C4">
        <v-simple-table>
          <tbody>
            <tr>
              <th><strong>Admin:</strong></th>
              <td>
                <v-text-field 
                  :value="admin"
                  :type="showAdmin ? 'text' : 'password'"
                  :append-icon="showAdmin ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showAdmin = !showAdmin"
                  readonly
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th><strong>Setup:</strong></th>
              <td>
                <v-text-field
                  :value="setup"
                  :type="showSetup ? 'text' : 'password'"
                  :append-icon="showSetup ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showSetup = !showSetup"
                  readonly
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    
    <v-btn class="mt-4" color="grey" dark block @click="$router.push('/supervisor')">
      Volver
    </v-btn>
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
    pc: null,
    showAdmin: false,
    showSetup: false,
    mostrarContrasenas: false,  // ← NUEVO: controla si se muestran las contraseñas
    states: ['Mantenimiento', 'Supervisión'],
    causa: 'Mantenimiento',
    supervisorSeleccionado: null,
    admin: '',
    setup: '',
    supervisores: [
      { email: 'supervisor1@example.com' },
      { email: 'supervisor2@example.com' }
    ]
  }),
  computed: {
    user() {
      return this.$store.state.auth.user || {};
    }
  },
  async mounted() {
    console.log('[PCDetalle] mounted - pcID:', this.pcID);
    await this.getPC();
  },
  methods: {
    callAlert(objetoAlerta) {
      this.$store.commit('alert/setAlert', objetoAlerta);
    },
    
    async getPC() {
      try {
        const { data } = await this.$axios.get(`/api/pcs/${this.pcID}`);
        console.log('[PCDetalle] PC cargada:', data);
        this.pc = data;
        
        if (data.pwd && data.pwd.iv && data.pwd.content) {
          this.admin = decrypt(data.pwd);
        }
        if (data.setupPwd && data.setupPwd.iv && data.setupPwd.content) {
          this.setup = decrypt(data.setupPwd);
        }
      } catch (error) {
        console.error('[PCDetalle] Error cargando PC:', error);
        this.callAlert({
          status: true, 
          message: 'Error cargando datos de la computadora', 
          color: 'error'
        });
      }
    },
    
    async AutorizaPWD() {
      if (!this.supervisorSeleccionado) {
        this.callAlert({
          status: true, 
          message: 'Seleccione un supervisor', 
          color: 'warning'
        });
        return;
      }
      
      try {
        const payload = {
          nombrejc: this.pc?.jc?.nombre || 'No asignado',
          nombrepc: String(this.pc?.nombre || ''),
          inventario: String(this.pc?.numero || ''),
          admin: false,
          tecnico: String(this.user?.email || ''),
          supervisor: String(this.supervisorSeleccionado),
          causa: String(this.causa),
          computadora_id: Number(this.pcID),
        };
        
        console.log('[PCDetalle] Enviando payload:', payload);
        await this.$axios.post('/api/accesos', payload);
        
        // ✅ DESPUÉS DE REGISTRAR, MOSTRAR LAS CONTRASEÑAS
        this.mostrarContrasenas = true;
        
        this.callAlert({
          status: true,
          message: 'Acceso registrado correctamente. Contraseñas desbloqueadas.',
          color: 'success',
        });
      } catch (error) {
        console.error('[PCDetalle] Error:', error);
        this.callAlert({
          status: true,
          message: error.response?.data?.message || 'Error al guardar acceso',
          color: 'error',
        });
      }
    }
  }
}
</script>