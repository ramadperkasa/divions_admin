<template>
  <div>
    <v-card>
      <v-card-title> <v-icon left>mdi-pencil</v-icon>Produk</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <select-image v-model="form.image"></select-image>
            <v-btn block text color="info" @click="dialogImage = true">
              <v-icon left>mdi-image-plus</v-icon>
              Tambah Logo
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
            <v-row>
              <v-col cols="10">
                <v-select
                  label="Kategori Produk *"
                  :items="selectProdukKategori"
                  v-model="form.produk_kategori_id"
                  :loading="isLoadingKategori"
                  :error="errors.produk_kategori_id ? true : false"
                  :error-messages="
                    errors.produk_kategori_id
                      ? errors.produk_kategori_id[0]
                      : ''
                  "
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-row>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon @click="fetchProdukKategori()">
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
                        @click="setDialogProdukKategoriModel()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Tambah</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
            <v-text-field
              label="Alamat Website Produk *"
              v-model="form.url"
              :error="errors.url ? true : false"
              :error-messages="errors.url ? errors.url[0] : ''"
              outlined
              dense
            ></v-text-field>
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
      :defaultImage="form.image"
      @upload="value => (form.image = value)"
      @close="dialogImage = false"
      :media="true"
    ></dialog-upload>
    <dialog-brand-kategori
      @update="fetchProdukKategori()"
    ></dialog-brand-kategori>
  </div>
</template>

<script>
import selectImage from '~/components/select-image.vue'
import DialogUpload from '~/components/dialog-upload.vue'
import dialogProdukKategori from '~/components/dialog-kategori-brand.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  middleware: 'authenticated',
  layout: 'default-brand',
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
        description: '',
        produk_kategori_id: '',
        url: '',
        logo_id: '',
        ishide: '',
        reorder: '',
        brand_id: '',
        id: '',
        _id: '',
        nama: '',
        nama_en: '',
        deskripsi: '',
        harga: '',
        ishide: '',
        reorder: '',
        created_at: '',
        updated_at: '',
        deleted_at: '',
        status: '',
        keterangan: '',
        images: []
      }
    }
  },
  watch: {
    errors: {
      handler(newValue) {
        if (!newValue) {
          this.isLoading = false
        }
      },
      deep: true
    }
  },
  mounted() {
    this.fetchProdukKategori()
  },
  methods: {
    ...mapActions(['storeData']),
    confirm() {
      if (confirm('Anda yakin akan kembali, data yang terisi akan hilang ?')) {
        this.$router.push('/product')
      }
    },
    store() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        var data = this.storeData(this.form)
        data
          .then(() => {
            this.$router.push('/product')
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
    setDialogProdukKategoriModel() {
      this.$store.commit('brandKategori/setModel', true)
    },
    fetchProdukKategori() {
      this.isLoadingKategori = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'product-kategori'
        })
        result.finally(() => {
          this.isLoadingKategori = false
        })
      })
      this.isLoadingKategori = false
    }
  },
  components: {
    'dialog-brand-kategori': dialogProdukKategori,
    DialogUpload,
    selectImage
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      selectProdukKategori: state => state.global.items.brandKategori
    })
  }
}
</script>
