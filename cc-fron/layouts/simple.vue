<template>

  <v-app >
    <v-main :style="backgroundDiv">
        <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data:() =>({
  backgroundDiv : {
        backgroundImage : 'url(' + require('../assets/fondopc.jpg') + ')',
        backgroundRepeat : 'no-repeat',
        backgroundSize : '100% 100%'
  }  
  }), 
  
};
</script>
//color azul #0D47A1 marillo #FFC107 color bey #FFFF90  style="background-color: #FFFF90"
<style>
</style>
