<template>
  <div class="animated fadeIn">
  </div>
</template>

<script>
export default {
  components: {},
  name: 'dashboard',
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>
