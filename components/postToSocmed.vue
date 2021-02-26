<template>
  <v-dialog v-model="$attrs.value" persistent max-width="430">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title class="headline"
        >Ingin broadcast ke social media ?</v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        Pilih social media yang akan di broadcast :
        <v-row>
          <v-checkbox
            v-model="socmed.facebook"
            class="mx-2"
            label="Facebook"
          ></v-checkbox>
          <v-checkbox
            v-model="socmed.twitter"
            class="mx-2"
            label="Twitter"
          ></v-checkbox>
          <v-checkbox
            v-model="socmed.telegram"
            class="mx-2"
            label="Telegram"
          ></v-checkbox>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close()">Batal</v-btn>
        <v-btn color="primary" text @click="postToSocmed()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['loading', 'form', 'slugs'],
  data() {
    return {
      dialog: false,
      socmed: {
        facebook: false,
        twitter: false,
        telegram: false
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
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
          this.close()
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
  computed: {
    ...mapState({
      forms: state => state.berita.form,
      errors: state => state.errors,
      slug: state => state.slug
    })
  },
  watch: {
    'socmed.facebook'() {
      if (this.socmed.facebook) {
        let slug = this.slugs ? this.slugs : this.slug

        let posting = window.open(
          'https://facebook.com/sharer/sharer.php?u=http://demo.news.dipointer.com/id/page-news/' +
            slug,
          '_blank',
          'toolbar=yes,scrollbars=yes,resizable=yes,top=130,left=500, right=500,width=400,height=400'
        )
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
