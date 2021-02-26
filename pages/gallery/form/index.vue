<template>
  <div>
    <v-card>
      <v-card-title> <v-icon left>mdi-pencil</v-icon>Gallery </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <select-image v-model="form.image" :isEdit="false"></select-image>
            <v-btn block text color="info" @click="dialogImage = true">
              <v-icon left>mdi-image-plus</v-icon>
              Tambah gambar
            </v-btn>
            <small class="error--text">
              {{ errors.image ? errors.image[0] : '' }}
            </small>
            <br />
          </v-col>
          <v-col cols="9">
            <v-text-field
              label="Judul Gallery *"
              v-model="form.judul"
              :error="errors.judul ? true : false"
              :error-messages="errors.judul ? errors.judul[0] : ''"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-if="Array.isArray($store.state.app.lang)"
              :hint="$store.state.app.hint"
              label="Judul Gallery en"
              v-model="form.judul_en"
              :error="errors.judul_en ? true : false"
              :error-messages="errors.judul_en ? errors.judul_en[0] : ''"
              outlined
              dense
            ></v-text-field>
            <v-row>
              <v-col cols="10">
                <v-select
                  label="Kategori *"
                  :items="selectKategoriGallery"
                  v-model="form.id_kategori"
                  :loading="isLoadingKategori"
                  :error="errors.id_kategori ? true : false"
                  :error-messages="
                    errors.id_kategori ? errors.id_kategori[0] : ''
                  "
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-row>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon @click="fetchKategoriGallery()">
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
                        @click="setDialogKategoriGalleryModel()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Tambah</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
            <v-btn outlined color="primary" @click="dialogImages = true" block>
              <v-icon v-if="form.images.length == 0">mdi-plus</v-icon>
              {{
                form.images.length > 0
                  ? form.images.length + ' Foto Telah Dipilih'
                  : 'Pilih Foto untuk Gallery'
              }}
            </v-btn>
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
      :youtube="true"
    ></dialog-upload>
    <dialog-upload
      :media="true"
      :youtube="true"
      v-model="dialogImages"
      :multiple="true"
      :defaultImage="form.images"
      @upload="value => (form.images = value)"
      @close="dialogImages = false"
    ></dialog-upload>
    <dialog-kategori-gallery
      @update="fetchKategoriGallery()"
    ></dialog-kategori-gallery>
  </div>
</template>

<script>
import selectImage from '~/components/select-image.vue'
import DialogUpload from '~/components/dialog-upload.vue'
import dialogKategoriGallery from '~/components/dialog-kategori-gallery.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Gallery: Form'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'gallery')])

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
        id_kategori: '',
        image: '',
        tgl_publish: '',
        judul: '',
        ishide: '',
        reorder: '',
        images: []
      }
    }
  },
  watch: {
    errors: {
      handler(newValue) {
        if (newValue) {
          this.isLoading = false
        }
      },
      deep: true
    }
  },
  mounted() {
    this.fetchKategoriGallery()
  },
  methods: {
    ...mapActions(['storeData']),
    confirm() {
      if (confirm('Anda yakin akan kembali, data yang terisi akan hilang ?')) {
        this.$router.push('/gallery')
      }
    },
    store() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        var data = this.storeData(this.form)
        data
          .then(() => {
            this.$router.push('/gallery')
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
    setDialogKategoriGalleryModel() {
      this.$store.commit('kategorigallery/setModel', true)
    },
    fetchKategoriGallery() {
      this.isLoadingKategori = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'kategori-gallery'
        })

        result.finally(() => {
          this.isLoadingKategori = false
        })
      })
      this.isLoadingKategori = false
    }
  },
  components: {
    'dialog-kategori-gallery': dialogKategoriGallery,
    DialogUpload,
    selectImage
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      selectKategoriGallery: state => state.global.items.kategoriGallery
    })
  }
}
</script>
