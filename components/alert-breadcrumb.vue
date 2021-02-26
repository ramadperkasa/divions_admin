<template>
  <v-alert v-model="alert" icon="mdi-school" dense border="left" dismissible>
    {{ this.page }}
    <strong>{{ this.current_page }}</strong>
  </v-alert>
</template>
<script>
export default {
  props: ['page', 'current_page'],
  data() {
    return {
      alert: true
    }
  },
  watch: {}
}
</script>
