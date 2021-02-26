<template>
  <div>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn text @click="step == 1 ? confirm() : step--">
        <v-icon left>mdi-arrow-left</v-icon>
        {{ step == 1 ? 'Batal' : 'Sebelumnya' }}
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn
        :loading="loading"
        :disabled="loading"
        color="primary"
        @click="step == 2 ? store() : step++"
      >
        {{ step == 2 ? 'Submit' : 'Selanjutnya' }}
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  head() {
    return {
      title: 'Vacancy: Form Vacancy'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'vacancy')])

    return
  },
  data() {
    return {
      dialog: false,
      loading: false,
      socmed: {
        facebook: false,
        twitter: false,
        telegram: false
      }
    }
  },
  methods: {
    ...mapActions(['storeData']),
    confirm() {
      if (confirm('Anda yakin akan kembali, data yang terisi akan hilang ?')) {
        this.$router.push('/vacancy')
      }
    },
    store() {
      this.loading = true
      return new Promise((resolve, reject) => {
        var data = this.storeData(this.form)
        data
          .then(() => {
            this.$router.push('/vacancy')
          })
          .finally(() => {
            this.loading = false
            this.step = 1
          })
      })
    }
  },
  watch: {
    errors: {
      handler(newValue) {
        this.loading = false
        this.dialog = false
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      form: state => state.vacancy.form,
      errors: state => state.errors,
      slug: state => state.slug
    }),
    step: {
      get() {
        return this.$store.state.vacancy.step
      },
      set(value) {
        this.$store.commit('vacancy/setStep', value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
