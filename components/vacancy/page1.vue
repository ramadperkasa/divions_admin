<template>
  <div>
    <v-card-text>
      <div class="mb-4">
        <span class="title">Form Vacancy - </span>
        <span class="subtitle">Pengaturan Vacancy</span>
      </div>
      <v-text-field
        label="Judul Vacancy *"
        v-model="judul"
        :error="errors.judul ? true : false"
        :error-messages="errors.judul ? errors.judul[0] : ''"
        outlined
        dense
      ></v-text-field>
      <texteditor v-model="isi_berita"></texteditor>
      <small class="error--text">{{
        errors.isi_berita ? errors.isi_berita[0] : ''
      }}</small>
    </v-card-text>
  </div>
</template>

<script>
import Texteditor from '~/components/texteditor.vue'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      errors: state => state.errors
    }),
    judul: {
      get() {
        return this.$store.state.vacancy.form.judul
      },
      set(value) {
        this.$store.commit('vacancy/setJudul', value)
      }
    },
    isi_berita: {
      get() {
        return this.$store.state.vacancy.form.isi_berita
      },
      set(value) {
        this.$store.commit('vacancy/setIsiBerita', value)
      }
    },
    sinopsis: {
      get() {
        return this.$store.state.vacancy.form.sinopsis
      },
      set(value) {
        this.$store.commit('vacancy/setSinopsis', value)
      }
    }
  },
  components: {
    Texteditor
  }
}
</script>

<style lang="stylus" scoped></style>
