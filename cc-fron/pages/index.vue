<template>
  <div class="text-center pa-10">
    <v-progress-circular indeterminate color="#0D47A1"></v-progress-circular>
    <p class="mt-4">Redirigiendo...</p>
  </div>
</template>

<script>
export default {
  async mounted() {
    await this.$nextTick()
    if (this.$auth.loggedIn) {
      this.$router.replace('/dashboard')
    } else {
      this.$router.replace('/login')
    }
  }
}
</script>