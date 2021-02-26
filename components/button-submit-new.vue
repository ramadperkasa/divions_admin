<template>
  <v-btn
    icons-and-text
    @click="submit()"
    
    class="ma-2"
    color="primary"
    :disabled="isClick || isClickNew"
    :loading="isClick || isClickNew"
  >
    <v-icon left>mdi-content-save-move-outline</v-icon>Simpan Baru
  </v-btn>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['setIsClickNew']),

    submit() {
      this.setIsClickNew(true)
    }
  },

  computed: {
    ...mapState({
      isClickNew: state => state.isClickNew,
      isClick: state => state.isClick
    })
  }
}
</script>
