<template>
  <PCDetalles :pcID="$route.params.id"/>
</template>

<script>
import PCDetalles from '../../components/PCDetalle.vue'
export default {
  name: 'PC',
  components: {
    PCDetalles
  }
}
</script>

<style>

</style>