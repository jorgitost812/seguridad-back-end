<template>
  <v-snackbar
    v-model="status"
    right
    center
    timeout="3000"
    >
    {{ message }}

  </v-snackbar>
</template>


<script>
export default {
    props: {
        message: String,
        status: Boolean
    }
}
</script>
