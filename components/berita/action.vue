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

    <post-to-socmed
      v-model="dialog"
      :form="form"
      :loading="loading"
      @close=";(dialog = false), (step = 1), $router.push('/berita')"
    ></post-to-socmed>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import postToSocmed from '~/components/postToSocmed.vue'
export default {
  head() {
    return {
      title: 'Berita: Form Berita'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'berita')])

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
        this.$router.push('/berita')
      }
    },
    store() {
      // var change = this.$store.state.berita.form.judul.toLowerCase().split(' ').join('-')
      this.loading = true
      // var sc = this.socmed
      // if (sc.facebook || sc.twitter || sc.telegram) {
      //   this.postToSocmed()
      // }
      return new Promise((resolve, reject) => {
        var data = this.storeData(this.form)
        data
          .then(() => {
            this.$router.push('/berita')
            this.step = 1
            // this.dialog = true
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    postToSocmed() {
      this.$axios
        .post('api/web/berita/socmed', { form: this.form, socmed: this.socmed })
        .then(response => {
          // this.table.items = response.data.agama
          this.$store.commit('setSnackbar', true)
          this.$store.commit(
            'setText',
            'Data Telah berhasil di Publish Melaui sosmed yang anda pilih'
          )
          this.$router.push('/berita')
        })
        .catch(() => {
          this.$store.commit('setSnackbar', true)
          this.$store.commit(
            'setText',
            'Terjadi Kesalahan coba beberapa saat lagi'
          )
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
    },

    'socmed.facebook'() {
      if (this.socmed.facebook) {
        let posting = window.open(
          'https://facebook.com/sharer/sharer.php?u=http://demo.news.dipointer.com/id/page-news/' +
            this.slug,
          '_blank',
          'toolbar=yes,scrollbars=yes,resizable=yes,top=130,left=500, right=500,width=400,height=400'
        )
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.berita.form,
      errors: state => state.errors,
      slug: state => state.slug
    }),
    step: {
      get() {
        return this.$store.state.berita.step
      },
      set(value) {
        this.$store.commit('berita/setStep', value)
      }
    }
  },

  components: {
    postToSocmed
  }
}
</script>

<style lang="stylus" scoped></style>
