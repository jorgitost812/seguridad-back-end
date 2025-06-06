<template>
  <v-card :to="vinculo" 
    class="mx-auto"
    max-width="300"
    outlined
    rounded
    elevation="6"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-1">{{subtitulo}}</div>
        <div class="text-overline mb-1">{{subtitulo1}}</div>
        <v-list-item-title class="text-h5 mb-1">{{titulo}}: {{valor}}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-avatar title  size="50">
        <v-icon x-large>{{icono}}</v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-actions>

    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      titulo: String,
      subtitulo: String,
      subtitulo1: String,
      valor: Number,
      icono: String,
      vinculo: String
    }
  }
</script>
