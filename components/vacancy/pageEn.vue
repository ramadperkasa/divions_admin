<template>
  <div>
    <v-card-text>
      <div class="mb-4">
        <span class="title">Form Vacancy - </span>
        <span class="subtitle">Pengaturan Vacancy Bahasa Inggris</span>
      </div>
      <v-text-field
        label="Judul Vacancy en "
        v-model="judul_en"
        :error="errors.judul_en ? true : false"
        :error-messages="errors.judul_en ? errors.judul_en[0] : ''"
        outlined
        hint="Form ini digunakan untuk tampilan bahasa inggris"
        dense
      ></v-text-field>
      <texteditor v-model="isi_berita_en"></texteditor>
      <small class="error--text">{{
        errors.isi_berita_en ? errors.isi_berita_en[0] : ''
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
    judul_en: {
      get() {
        return this.$store.state.vacancy.form.judul_en
      },
      set(value) {
        this.$store.commit('vacancy/setJudulEn', value)
      }
    },
    isi_berita_en: {
      get() {
        return this.$store.state.vacancy.form.isi_berita_en
      },
      set(value) {
        this.$store.commit('vacancy/setIsiBeritaEn', value)
      }
    },
    sinopsis_en: {
      get() {
        return this.$store.state.vacancy.form.sinopsis_en
      },
      set(value) {
        this.$store.commit('vacancy/setSinopsisEn', value)
      }
    }
  },
  components: {
    Texteditor
  }
}
</script>

<style lang="stylus" scoped></style>
