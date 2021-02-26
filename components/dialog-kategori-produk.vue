<template>
<div>

  <v-dialog v-model="model" scrollable persistent max-width="700px">
    <v-card>
      <dialog-header :isEdit="false" @close="model = false"></dialog-header>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
            <v-col cols="4">
              <select-image v-model="form.cover_image"></select-image>
              <v-btn block text color="info" @click="dialogImage = true">
                <v-icon left>mdi-image-plus</v-icon>Tambah Logo
              </v-btn>
              <small class="error--text">{{
                errors.cover_image ? errors.cover_image[0] : ''
              }}</small>
              <br />
            </v-col>
            <v-col cols="8">
              <v-text-field
                label="Nama Kategori Produk *"
                v-model="form.nama"
                :error="errors.nama ? true : false"
                :error-messages="errors.nama ? errors.nama[0] : ''"
                outlined
                dense
              ></v-text-field>
          
             <v-text-field
          label="Nama Kategori produk en"
          v-model="form.nama_en"
          :error="errors.nama_en ? true : false"
          :error-messages="errors.nama_en ? errors.nama_en[0] : ''"
          outlined
          v-if="Array.isArray($store.state.app.lang)"
          :hint="$store.state.app.hint"
          dense
        ></v-text-field>
           
              <v-textarea
                label="Deskripsi *"
                v-model="form.keterangan"
                :error="errors.keterangan ? true : false"
                :error-messages="errors.keterangan ? errors.keterangan[0] : ''"
                outlined
                dense
              ></v-textarea>
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
      <dialog-upload
      v-model="dialogImage"
      :defaultImage="form.cover_image"
      @upload="value => (form.cover_image = value)"
      @close="dialogImage = false"
      :media="true"
    ></dialog-upload>
</div>
  
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import selectImage from '~/components/select-image.vue'
import DialogUpload from '~/components/dialog-upload-brand.vue'
export default {
  data() {
    return {
      dialogImage: false,
      form: {
        _id: '',
        id: '',
        nama: '',
        cover_image: '',
        ishide: '',
        keterangan: '',
        reorder: '',
      }
    }
  },
  components: {
    selectImage,DialogUpload
  },
  watch: {
    model(newValue) {
      if (newValue == true) {
        this.$store.commit('kategoriProduk/setClearForm')
        this.form.nama = ''
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('kategoriProduk/setIsErrors', '')
      }
    }
  },
  methods: {
    ...mapActions('kategoriProduk', ['storeData']),
    ...mapMutations('kategoriProduk', ['setLoading']),
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
    ...mapState('kategoriProduk', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    model: {
      get() {
        return this.$store.state.kategoriProduk.model
      },
      set(model) {
        this.$store.commit('kategoriProduk/setModel', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.kategoriProduk.loading
      },
      set(loading) {
        this.$store.commit('kategoriProduk/setloading', loading)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
