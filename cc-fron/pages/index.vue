<template>
  <div></div>
</template>

<script>
export default {
  async asyncData({ redirect }) {
    // Server‑side and client‑side redirect from '/' to '/login'
    return redirect('/login')
  }
}
</script>