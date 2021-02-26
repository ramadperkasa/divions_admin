<template>
  <div class="text-center ma-2">
    <v-snackbar left v-model="show">
      {{ text }}
      <v-btn color="primary" text @click="clear()">Tutup</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      show: false
    }
  },

  methods: {
    ...mapMutations(['setSnackbar']),
    clear() {
      this.setSnackbar(false)
    }
  },

  computed: {
    ...mapState({
      showSnackbar: state => state.snackbar,
      text: state => state.text
    })
  },

  watch: {
    showSnackbar(val) {
      this.show = val
    },

    show(val) {
      if (!val) {
        this.clear()
      }
    }
  }
}
</script>
