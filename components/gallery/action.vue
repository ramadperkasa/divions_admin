<template>
  <div>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn text @click="step == 1 ? confirm() : step--"
        ><v-icon left>mdi-arrow-left</v-icon
        >{{ step == 1 ? 'Batal' : 'Kembali' }}</v-btn
      >
      <v-spacer></v-spacer>

      <v-btn color="primary" @click="step++">
        {{ step == 2 ? 'Submit' : 'Selanjutnya' }}
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  methods: {
    confirm() {
      if (confirm('Anda yakin akan kembali, data yang terisi akan hilang ?')) {
        this.$router.push('/gallery')
      }
    }
  },
  computed: {
    step: {
      get() {
        return this.$store.state.gallery.step
      },
      set(step) {
        this.$store.commit('gallery/setStep', step)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
