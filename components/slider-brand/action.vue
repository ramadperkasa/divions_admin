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
        v-if="$store.state.app.actionSlider"
        :loading="loading"
        :disabled="loading"
        color="primary"
        @click="step == 2 ? store() : step++"
      >
        {{ step == 2 ? 'Submit' : 'Selanjutnya' }}
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
      <v-btn
        v-else
        :loading="loading"
        :disabled="loading"
        color="primary"
        @click="step == 1 ? store() : step++"
      >
        {{ step == 1 ? 'Submit' : 'Selanjutnya' }}
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="alert" max-width="350">
      <v-card>
        <v-card-title class="headline">
          <span>Belum Bisa Melanjutkan</span></v-card-title
        >

        <v-card-text>
          Silahkan pilih <strong>Jenis Link</strong> terlebih dahulu untuk
          melanjutkan
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="alert = false">
            Oke
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  head() {
    return {
      title: 'Slider: Form Slider'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'slider-brand')])

    return
  },
  data() {
    return {
      dialog: false,
      alert: false,
      loading: false
    }
  },
  methods: {
    ...mapActions(['storeData']),
    confirm() {
      if (confirm('Anda yakin akan kembali, data yang terisi akan hilang ?')) {
        this.$router.push('/brand/' + this.$store.state.app.app + '/slider')
      }
    },
    // next(val){
    //   if(this.form.tipe_link){
    //     this.step++
    //   }else{
    //     this.alert = true
    //   }
    // },
    store() {
      this.$store.commit(
        'slider/setSliderAction',
        this.$store.state.app.actionSlider
      )
      this.loading = true
      return new Promise((resolve, reject) => {
        var data = this.storeData(this.form)
        data
          .then(() => {
            this.$router.push('/brand/' + this.$store.state.app.app + '/slider')

            this.step = 1
          })
          .finally(() => {
            this.loading = false
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
    },
    step(val) {
      if (val == 2 && !this.tipe_link) {
        this.alert = true
        this.step = 1
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.slider.form,
      errors: state => state.errors,
      slug: state => state.slug
    }),
    step: {
      get() {
        return this.$store.state.slider.step
      },
      set(value) {
        this.$store.commit('slider/setStep', value)
      }
    },
    tipe_link: {
      get() {
        return this.$store.state.slider.form.tipe_link
      },
      set(value) {
        this.$store.commit('slider/setTipeLink', value)
      }
    }
  }
}
</script>
