<template>
  <v-dialog v-model="model" scrollable persistent max-width="700px">
    <v-card>
      <dialog-header :isEdit="false" @close="model = false"></dialog-header>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field
          label="Nama Kategori *"
          v-model="form.nama"
          :error="errors.nama ? true : false"
          :error-messages="errors.nama ? errors.nama[0] : ''"
          outlined
          dense
        ></v-text-field>
        <v-text-field
          v-if="Array.isArray($store.state.app.lang)"
          :hint="$store.state.app.hint"
          label="Nama Kategori en"
          v-model="form.nama_en"
          :error="errors.nama_en ? true : false"
          :error-messages="errors.nama_en ? errors.nama_en[0] : ''"
          outlined
          dense
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="model = false"
          ><v-icon>mdi-arrow-left</v-icon>Kembali</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submit"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan</v-btn
        >
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
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        id: '',
        nama: '',
        nama_en: '',
        ishide: '',
        reorder: ''
      }
    }
  },
  watch: {
    model(newValue) {
      if (newValue == true) {
        this.$store.commit('kategorigallery/setClearForm')
        this.form.nama = ''
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('kategorigallery/setIsErrors', '')
      }
    }
  },
  methods: {
    ...mapActions('kategorigallery', ['storeData']),
    ...mapMutations('kategorigallery', ['setLoading']),
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
    ...mapState('kategorigallery', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    model: {
      get() {
        return this.$store.state.kategorigallery.model
      },
      set(model) {
        this.$store.commit('kategorigallery/setModel', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.kategorigallery.loading
      },
      set(loading) {
        this.$store.commit('kategorigallery/setloading', loading)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
