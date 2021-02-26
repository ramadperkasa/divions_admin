<template>
  <div>
    <v-card-text>
      <div class="mb-4">
        <span class="title">Form Berita - </span>
        <span class="subtitle">Pengaturan Berita</span>
      </div>
      <v-text-field
        label="Judul Berita *"
        v-model="judul"
        :error="errors.judul ? true : false"
        :error-messages="errors.judul ? errors.judul[0] : ''"
        outlined
        dense
      ></v-text-field>
      <v-textarea
        label="Sinopsis *"
        v-model="sinopsis"
        :error="errors.sinopsis ? true : false"
        :error-messages="errors.sinopsis ? errors.sinopsis[0] : ''"
        outlined
        dense
      ></v-textarea>
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
        return this.$store.state.berita.form.judul
      },
      set(value) {
        this.$store.commit('berita/setJudul', value)
      }
    },
    isi_berita: {
      get() {
        return this.$store.state.berita.form.isi_berita
      },
      set(value) {
        this.$store.commit('berita/setIsiBerita', value)
      }
    },
    sinopsis: {
      get() {
        return this.$store.state.berita.form.sinopsis
      },
      set(value) {
        this.$store.commit('berita/setSinopsis', value)
      }
    }
  },
  components: {
    Texteditor
  }
}
</script>

<style lang="stylus" scoped></style>
