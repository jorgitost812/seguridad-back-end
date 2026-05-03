<template>
    <div>
      <v-container v-if="pcLoaded">
        <PCDetalles :pcID="$route.params.id" />
      </v-container>
      <v-container v-else class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4">Cargando detalles de la PC...</p>
      </v-container>
    </div>
  </template>
  
  <script>
  import PCDetalles from '@/components/PCDetalle.vue'
  
  export default {
    layout: 'default',
    components: { PCDetalles },
    data: () => ({ pcLoaded: false }),
    async mounted() {
      this.pcLoaded = true;
    }
  }
  </script>