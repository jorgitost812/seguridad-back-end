<template>
  <v-container v-if="pcLoaded">
    <PCDetalles :pcID="$route.params.id"/>
  </v-container>
  <v-container v-else>
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-container>
</template>

<script>
import PCDetalles from '@/components/PCDetalle.vue'

export default {
  name: 'PCView',
  components: {
    PCDetalles
  },
  data: () => ({
    pcLoaded: false
  }),
  async mounted() {
    await this.$nextTick();
    this.pcLoaded = true;
  }
}
</script>