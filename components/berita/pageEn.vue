<template>
  <div>
    <v-card-text>
      <div class="mb-4">
        <span class="title">Form Berita - </span>
        <span class="subtitle">Pengaturan Berita Bahasa Inggris</span>
      </div>
      <v-text-field
        label="Judul Berita en"
        v-model="judul_en"
        :error="errors.judul_en ? true : false"
        :error-messages="errors.judul_en ? errors.judul_en[0] : ''"
        outlined
        :hint="$store.state.app.hint"
        dense
      ></v-text-field>
      <v-textarea
        label="Sinopsis en"
        v-model="sinopsis_en"
        :error="errors.sinopsis_en ? true : false"
        :error-messages="errors.sinopsis_en ? errors.sinopsis_en[0] : ''"
        outlined
        :hint="$store.state.app.hint"
        dense
      ></v-textarea>
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
        return this.$store.state.berita.form.judul_en
      },
      set(value) {
        this.$store.commit('berita/setJudulEn', value)
      }
    },
    isi_berita_en: {
      get() {
        return this.$store.state.berita.form.isi_berita_en
      },
      set(value) {
        this.$store.commit('berita/setIsiBeritaEn', value)
      }
    },
    sinopsis_en: {
      get() {
        return this.$store.state.berita.form.sinopsis_en
      },
      set(value) {
        this.$store.commit('berita/setSinopsisEn', value)
      }
    }
  },
  components: {
    Texteditor
  }
}
</script>

<style lang="stylus" scoped></style>
