<template >
  <v-row align="center" justify="center">
    <v-col cols="12" sm="6" md="4">
      <v-card elevation="12">
        <v-toolbar color="accent">
          <v-toolbar-title> Cambio de Contraseña </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text style="background-color: #fff9c4">
          <v-form>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <pre class="font-weight-bold" v-once>
  Nombre: {{ user.nombre }} {{ user.apellidos }}</pre>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  v-model="password"
                  label="Contrasena"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Confirmar contraseña"
                  type="password"
                  v-model="passwordc"
                  required
                ></v-text-field>
              </v-col>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click.prevent="save"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    password: "",
    passwordc: "",
  }),
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },

  methods: {
    callAlert(objetoAlerta) {
      return this.$store.commit("alert/setAlert", objetoAlerta);
    },
    async save() {
      if (this.password === this.passwordc) {
        try {
          const payload = {
            password: this.password,
          };
          console.log(payload);
          await this.$axios.put(`api/usuarios/${this.user.id}`, payload);
          this.callAlert({
            status: true,
            message: "Se modificó satifactoriamente",
            color: "primary",
          });
        } catch (error) {
          this.callAlert({
            status: true,
            message: "No se modificó",
            color: "error",
          });
        }
      } else {
        this.callAlert({
          status: true,
          message: "No coincide  la contraseña",
          color: "error",
        });
      }
    },
  },
};
</script>