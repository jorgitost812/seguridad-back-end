<template>
  <v-snackbar
    v-model="alerta.status"
    :color="alerta.color"
    centered
    top
    timeout="9999999"
   >
    {{ alerta.message }}

    <template v-slot:action="{ attrs }">
      <v-btn color="yellow" text v-bind="attrs" @click="closeSnackbar">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>

export default {
  name: "MiAlerta",
  
  //props: ["snackbar", "y", "x", "mode", "timeout", "color", "close", "text"],
  computed: {
    alerta: {
      get() {
         return this.$store.state.alert;
      },
      set() {
        return this.$store.commit("alert/clearAlert");
      }
    },
  },
 
  created () {
        //myVar=setTimeout(function(){ closeSnackbar; }, 33000);
    },
  methods: {
    closeSnackbar() {
         return this.$store.commit("alert/clearAlert");
      },
    
  },
  
};
</script>

<style>
</style>