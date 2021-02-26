<template>
  <v-btn
    icons-and-text
    @click="submit()"
    class="ma-2"
    color="primary"
    :disabled="isClick || isClickNew"
    :loading="isClick || isClickNew"
  >
    <v-icon left>mdi-arrow-left</v-icon> Kembali
  </v-btn>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['setIsClickCancel']),

    submit() {
      this.setIsClickCancel(true)
    }
  },

  computed: {
    ...mapState({
      isClick: state => state.isClick,
      isClickNew: state => state.isClickNew
    })
  }
}
</script>
