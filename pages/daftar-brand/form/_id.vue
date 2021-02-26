<template>
  <div>
    <v-card >
      <v-card-title> <v-icon left>mdi-pencil</v-icon>Produk </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <select-image v-model="form.cover_image"></select-image>
            <v-btn block text color="info" @click="dialogImage = true">
              <v-icon left>mdi-image-edit</v-icon>
              Edit Cover
            </v-btn>
            <small class="error--text">
              {{ errors.image ? errors.image[0] : '' }}
            </small>
            <br />
          </v-col>
          <v-col cols="9">
            <v-text-field
              label="Nama Produk *"
              v-model="form.nama_brand"
              :error="errors.nama_brand ? true : false"
              :error-messages="errors.nama_brand ? errors.nama_brand[0] : ''"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-if="Array.isArray($store.state.app.lang)"
              :hint="$store.state.app.hint"
              label="Nama Produk en"
              v-model="form.nama_brand_en"
              :error="errors.nama_brand_en ? true : false"
              :error-messages="
                errors.nama_brand_en ? errors.nama_brand_en[0] : ''
              "
              outlined
              dense
            ></v-text-field>
            <v-row>
              <v-col cols="10">
                <v-select
                  label="Kategori Produk *"
                  :items="selectBrandKategori"
                  v-model="form.brand_kategori_id"
                  :loading="isLoadingKategori"
                  :error="errors.brand_kategori_id ? true : false"
                  :error-messages="
                    errors.brand_kategori_id ? errors.brand_kategori_id[0] : ''
                  "
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-row>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon @click="fetchBrandKategori()">
                        <v-icon v-if="isLoadingKategori"
                          >mdi-spin mdi-refresh</v-icon
                        >
                        <v-icon v-else>mdi-refresh</v-icon>
                      </v-btn>
                    </template>
                    <span>Refresh</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        icon
                        @click="setDialogBrandKategoriModel()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Tambah</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
            <v-textarea
            v-if="$store.state.urlBrand"
              label="Alamat Website Produk"
              v-model="form.url"
              :error="errors.url ? true : false"
              :error-messages="errors.url ? errors.url[0] : ''"
              outlined
              height="50px"
              dense
            ></v-textarea>
            <v-textarea
              label="Deskripsi Produk"
              v-model="form.description"
              :error="errors.description ? true : false"
              :error-messages="errors.description ? errors.description[0] : ''"
              outlined
              dense
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="confirm()">
          <v-icon left>mdi-arrow-left</v-icon>Kembali
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="store()" :loading="isLoading" color="primary">
          Submit
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <dialog-upload
      v-model="dialogImage"
      :defaultImage="form.cover_image"
      @upload="value => (form.cover_image = value)"
      @close="dialogImage = false"
      :media="true"
    ></dialog-upload>
    <dialog-brand-kategori
      @update="fetchBrandKategori()"
    ></dialog-brand-kategori>
  </div>
</template>

<script>
import selectImage from '~/components/select-image.vue'
import DialogUpload from '~/components/dialog-upload.vue'
import dialogBrandKategori from '~/components/dialog-kategori-brand.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Produk: Form'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'brand')])

    return
  },
  data() {
    return {
      dialogImage: false,
      dialogImages: false,
      isLoadingKategori: false,
      isLoading: false,
      isLoadingPage: false,
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      },
      support_images: [
        'webm',
        'mpg',
        'mp2',
        'mpeg',
        'mpe',
        'mpv',
        'mp4',
        'm4p',
        'm4v',
        'avi',
        'wmv',
        'mov',
        'qt',
        'flv',
        'swf',
        'avchd'
      ],
      form: {
        id: '',
        _id: '',
        nama_brand: '',
        nama_brand_en: '',
        description: '',
        brand_kategori_id: '',
        url: '',
        image: '',
        logo_id: '',
        ishide: '',
        cover_image: '',
        reorder: '',
        images: []
      }
    }
  },
  watch: {
    brands: {
      handler(newValue) {
        var self = this
        Object.keys(this.form).forEach(function(key) {
          self.form[key] = newValue[key]
        })
        this.form.cover_image = newValue.cover_image
        this.form.brand_kategori_id = newValue.brand_kategori_id
        // self.form.cover_image = 'newValue.cover_image',
      },
      deep: true
    },

    errors: {
      handler(newValue) {
        this.isLoading = false
      },
      deep: true
    }
  },
  mounted() {
    this.fetchBrandKategori()
    this.fetch()
  },
  methods: {
    ...mapActions('global', ['getDataId']),

    ...mapActions(['storeData']),
    confirm() {
      if (confirm('Anda yakin akan kembali, data yang terisi akan hilang ?')) {
        this.$router.push('/daftar-brand')
      }
    },

    fetch() {
      this.isLoadingPage = true

      return new Promise((resolve, reject) => {
        var data = this.getDataId({ nama: 'brand', id: this.$route.params.id })

        data.finally(() => {
          this.isLoadingPage = false
        })
      })
    },

    store() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        var data = this.storeData(this.form)
        data
          .then(() => {
            this.$router.push('/daftar-brand')
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
          })
          .finally(() => {
            this.isLoading = false
          })
      })
      this.isLoading = false
    },
    setDialogBrandKategoriModel() {
      this.$store.commit('brandKategori/setModel', true)
    },
    fetchBrandKategori() {
      this.isLoadingKategori = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'brand-kategori'
        })
        result.finally(() => {
          this.isLoadingKategori = false
        })
      })
      this.isLoadingKategori = false
    }
  },
  components: {
    'dialog-brand-kategori': dialogBrandKategori,
    DialogUpload,
    selectImage
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      brands: state => state.global.items.brand,
      selectBrandKategori: state => state.global.items.brandKategori
    })
  }
}
</script>
