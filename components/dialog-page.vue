<template>
  <v-dialog v-model="model" scrollable persistent max-width="90%">
    <v-card>
     <dialog-header  :isEdit="false" @close="model = false"></dialog-header>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Judul *"
              v-model="form.judul"
              :error="errors.judul ? true : false"
              :error-messages="errors.judul ? errors.judul[0] : ''"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              label="Meta Tag"
              v-model="form.meta_tag"
              :error="errors.meta_tag ? true : false"
              :error-messages="errors.meta_tag ? errors.meta_tag[0] : ''"
              outlined
              dense
            ></v-text-field>
            <texteditor v-model="form.konten"></texteditor>
            <small class="error--text">
              {{
              errors.konten ? errors.konten[0] : ''
              }}
            </small>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="model = false"
        >
          <v-icon>mdi-arrow-left</v-icon>Kembali</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submit"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan
        </v-btn>
        <v-btn
          
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submitNew"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan Baru
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Texteditor from '~/components/texteditor.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        id: '',
        judul: '',
        konten: '',
        meta_tag: '',
        total_view: '',
        last_view: '',
        slug: ''
      }
    }
  },
  components: {
    Texteditor
  },
  watch: {
    model(newValue) {
      if (newValue == true) {
        this.$store.commit('page/setClearForm')
        this.form.nama_page = ''
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('page/setIsErrors', '')
      }
    }
  },
  methods: {
    ...mapActions('page', ['storeData']),
    ...mapMutations('page', ['setLoading']),
    submit() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
          this.model = false
        })
      })
    },
    submitNew() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
        })
      })
    }
  },
  computed: {
    ...mapState('page', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    model: {
      get() {
        return this.$store.state.page.model
      },
      set(model) {
        this.$store.commit('page/setModel', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.page.loading
      },
      set(loading) {
        this.$store.commit('page/setloading', loading)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
