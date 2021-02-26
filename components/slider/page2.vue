<template>
  <div>
    <div v-if="tipe_link == 4 && step == 2">
      <center>
        <h2>Berikut berita yang anda pilih :</h2>
      </center>
      <div class="pt-2"></div>
      <v-card
        class="mx-auto"
        max-width="344"
        :loading="isLoadingBerita"
        :disabled="isLoadingBerita"
      >
        <iframe
          width="100%"
          height="200px"
          v-if="
            berita ? (berita.image ? berita.image.type == 2 : false) : false
          "
          :src="`https://www.youtube.com/embed/` + berita.image.image"
          frameborder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>

        <v-img
          v-if="
            berita ? (berita.image ? berita.image.type == 0 : false) : false
          "
          :src="
            berita
              ? berita.image
                ? env + berita.image.image
                : '/no-image.svg'
              : '/no-image.svg'
          "
          height="200px"
        ></v-img>

        <v-card-title>{{
          berita ? (berita.judul ? berita.judul : '') : ''
        }}</v-card-title>
        <v-card-subtitle>{{
          berita
            ? berita.kategori
              ? 'Kategori : ' + berita.kategori.nama
              : false
            : false
        }}</v-card-subtitle>
        <v-card-actions>
          <v-btn text color="primary" outlined @click="dialogNews = true">
            <v-icon left>mdi-pencil</v-icon>Ubah Berita
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>
            <v-card-text>{{ berita ? berita.sinopsis : false }}</v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
      <div class="pb-5"></div>
    </div>
    <div v-else>
      <v-card-text>
        <div class="mb-4">
          <span class="title">Slider -</span>
          <span class="subtitle">Informasi Lainnya</span>
        </div>
        <v-row>
          <v-col cols="3">
            <select-image
              v-model="image_url"
              :isEdit="$route.params.id"
            ></select-image>
            <v-btn block text color="info" @click="dialog = true">
              <v-icon left>{{
                $route.params.id ? 'mdi-image-edit' : 'mdi-image-plus'
              }}</v-icon>
              {{ $route.params.id ? 'Edit' : 'Tambah' }} gambar
            </v-btn>
            <small class="error--text ">
              {{ errors.image_url ? errors.image_url[0] : '' }}
            </small>
          </v-col>
          <v-col cols="9">
            <v-row>
              <v-col>
                <v-select
                  v-if="tipe_link == 1"
                  label="Internal *"
                  v-model="url"
                  :items="select.internal"
                  :error="errors.url ? true : false"
                  :error-messages="errors.url ? errors.url[0] : ''"
                  outlined
                  clearable
                  dense
                ></v-select>

                <v-text-field
                  v-if="tipe_link == 2"
                  label="Link"
                  v-model="url"
                  :error="errors.url ? true : false"
                  :error-messages="errors.url ? errors.url[0] : ''"
                  outlined
                  dense
                ></v-text-field>

                <v-row v-if="tipe_link == 3">
                  <v-col cols="9" style="padding:0px">
                    <v-select
                      label="Halaman *"
                      v-model="block_template_id"
                      :items="selectPage"
                      :error="errors.block_template_id ? true : false"
                      :error-messages="
                        errors.block_template_id
                          ? errors.block_template_id[0]
                          : ''
                      "
                      outlined
                      clearable
                      dense
                    />
                  </v-col>
                  <v-col style="padding:0px" cols="3">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon @click="fetchPage()">
                          <v-icon v-if="isLoadingPage"
                            >mdi-spin mdi-refresh</v-icon
                          >
                          <v-icon v-else>mdi-refresh</v-icon>
                        </v-btn>
                      </template>
                      <span>Refresh</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon @click="setDialogPageModel()">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Tambah</span>
                    </v-tooltip>
                  </v-col>
                  <v-col md="4">
                    <v-select
                      v-model="tipe"
                      :items="selects.tipe"
                      label="Pilih Tipe"
                      outlined
                      dense
                      hint="Contoh : /Home"
                    ></v-select>
                  </v-col>
                  <v-col md="8" v-if="tipe == 1">
                    <v-text-field
                      label="Link *"
                      v-model="url"
                      hint="Contoh : /Home"
                      :error="errors.url ? true : false"
                      :error-messages="errors.url ? errors.url[0] : ''"
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col md="4" v-if="tipe == 2">
                    <v-combobox
                      label="Link *"
                      hint="Contoh : /Home"
                      :items="selects.links"
                      v-model="url"
                      :error="errors.url ? true : false"
                      :error-messages="errors.url ? errors.url[0] : ''"
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col md="4" v-if="tipe == 2">
                    <v-select
                      label="Pilih Komponent *"
                      v-model="block_template_detail_content_id"
                      :items="selects.block"
                      :error="
                        errors.block_template_detail_content_id ? true : false
                      "
                      :error-messages="
                        errors.block_template_detail_content_id
                          ? errors.block_template_detail_content_id[0]
                          : ''
                      "
                      outlined
                      dense
                    />
                  </v-col>
                  <!-- <v-col md="12">
                    <v-text-field
                      label="Link *"
                      v-model="url"
                      hint="Contoh : /Home"
                      :error="errors.url ? true : false"
                      :error-messages="errors.url ? errors.url[0] : ''"
                      outlined
                      dense
                    />
                  </v-col> -->
                </v-row>
                <v-row v-if="tipe_link == 5">
                  <v-col cols="12" style="padding:0px">
                    <v-select
                      label="Pilih Produk *"
                      v-model="brand_id"
                      :items="selectBrand"
                      :error="errors.brand_id ? true : false"
                      :error-messages="
                        errors.brand_id ? errors.brand_id[0] : ''
                      "
                      @input="fetchProduct(brand_id)"
                      outlined
                      clearable
                      dense
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" style="padding:0px">
                    <v-select
                      :loading="isLoadingProduct"
                      label="Pilih Produk Detail *"
                      v-model="product_id"
                      :items="selectProduct"
                      :error="errors.product_id ? true : false"
                      :error-messages="
                        errors.product_id ? errors.product_id[0] : ''
                      "
                      outlined
                      clearable
                      dense
                    >
                      <template v-slot:item="data">
                        <template>
                          <v-list-item-avatar>
                            <v-img
                              :src="env + small(data.item.cover_image)"
                            ></v-img>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-html="
                                data.item.code_product + ' - ' + data.item.text
                              "
                            ></v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
    <upload
      :media="true"
      v-model="dialog"
      :defaultImage="image_url"
      @upload="value => (image_url = value)"
      @close="dialog = false"
    ></upload>

    <upload
      :news="true"
      v-model="dialogNews"
      @upload="value => (berita_id = value)"
      @close="dialogNews = false"
    ></upload>

    <dialog-page @update="fetchPage()"></dialog-page>
  </div>
</template>

<script>
import selectImage from '~/components/select-image.vue'
import upload from '~/components/dialog-upload.vue'
import DialogPage from '~/components/dialog-page.vue'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      show: false,
      dialog: false,
      dialogNews: false,
      isLoadingPage: false,
      isLoadingBerita: false,
      isLoadingBrand: false,
      isLoadingProduct: false,
      env: process.env.API_URL,
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
      selects: {
        links: [],
        block: [],
        tipe: [
          {
            value: 1,
            text: 'Membuat Link Baru'
          },
          {
            value: 2,
            text: 'Menggunakan Hastag'
          }
        ]
      },
      form: {
        link: '',
        block_template_id: ''
      },
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      }
    }
  },
  mounted() {
    this.fetchPage()
  },
  watch: {
    block_template_id(val) {
      this.$axios
        .get('/api/web/menu/get-existing-links')
        .then(response => {
          this.selects.links = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {})

      this.$axios
        .get('/api/web/block-template-detail/get-hastag', {
          params: {
            block_template_id: val
          }
        })
        .then(response => {
          this.selects.block = response.data.data.map(f => {
            return {
              ...f,
              ...{
                text: f.hastag
              }
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {})
    },
    tipe_link(val) {
      if (val == '5') {
        this.fetchBrand()
      }
    },
    'form.link'(value) {
      if (this.tipe_link == 3) {
        this.link = '/page/' + value
      }
    },

    url() {
      if (this.tipe_link == 3 && this.url.charAt(0) != '/') {
        this.url = '/' + this.url
      }
    },

    step(value) {
      if (this.tipe_link == 4 && value == 2) {
        this.dialogNews = true
      }
    },

    berita_id(val) {
      if (val) {
        this.fecthBerita(val)
      }
    }
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      selectProduct: state => state.global.items.produk,
      selectBrand: state => state.global.items.brand,
      selectPage: state => state.global.items.layout,
      select: state => state.slider.select,
      step: state => state.slider.step,
      berita: state => state.global.items.berita
    }),
    block_template_detail_content_id: {
      get() {
        return this.$store.state.slider.form.block_template_detail_content_id
      },
      set(value) {
        this.$store.commit('slider/setBlockTemplateDetailContentId', value)
      }
    },
    tipe: {
      get() {
        return this.$store.state.slider.form.tipe
      },
      set(value) {
        this.$store.commit('slider/setTipe', value)
      }
    },
    berita_id: {
      get() {
        return this.$store.state.slider.form.berita_id
      },
      set(value) {
        this.$store.commit('slider/setBeritaId', value)
      }
    },
    url: {
      get() {
        return this.$store.state.slider.form.url
      },
      set(value) {
        this.$store.commit('slider/setUrl', value)
      }
    },
    block_template_id: {
      get() {
        return this.$store.state.slider.form.block_template_id
      },
      set(value) {
        this.$store.commit('slider/setBlockTemplateId', value)
      }
    },

    judul: {
      get() {
        return this.$store.state.slider.form.judul
      },
      set(value) {
        this.$store.commit('slider/setJudul', value)
      }
    },
    brand_id: {
      get() {
        return this.$store.state.slider.form.brand_id
      },
      set(value) {
        this.$store.commit('slider/setBrandId', value)
      }
    },
    product_id: {
      get() {
        return this.$store.state.slider.form.product_id
      },
      set(value) {
        this.$store.commit('slider/setProductId', value)
      }
    },
    sub_judul: {
      get() {
        return this.$store.state.slider.form.sub_judul
      },
      set(value) {
        this.$store.commit('slider/setSubJudul', value)
      }
    },
    deskripsi: {
      get() {
        return this.$store.state.slider.form.deskripsi
      },
      set(value) {
        this.$store.commit('slider/setDeskripsi', value)
      }
    },
    aksi_link: {
      get() {
        return this.$store.state.slider.form.aksi_link
      },
      set(value) {
        this.$store.commit('slider/setAksiLink', value)
      }
    },
    tipe_page: {
      get() {
        return this.$store.state.slider.form.tipe_page
      },
      set(value) {
        this.$store.commit('slider/setTipePage', value)
      }
    },
    tipe_link: {
      get() {
        return this.$store.state.slider.form.tipe_link
      },
      set(value) {
        this.$store.commit('slider/setTipeLink', value)
      }
    },
    image_url: {
      get() {
        return this.$store.state.slider.form.image_url
      },
      set(value) {
        this.$store.commit('slider/setImageUrl', value)
      }
    }
  },
  methods: {
    small(val) {
      let ext = val.split('.').pop()
      let filename = val
        .split('.')
        .slice(0, -1)
        .join('.')

      return filename + '_small' + '.' + ext
    },
    fetchPage() {
      this.isLoadingPage = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'setting-layout'
        })
        result.finally(() => {
          this.isLoadingPage = false
        })
      })
    },
    async fetchBrand() {
      this.isLoadingBrand = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'brand'
        })

        result.finally(() => {
          this.isLoadingBrand = false
        })
      })
    },
    async fetchProduct(val) {
      this.isLoadingProduct = true
      return new Promise((resolve, reject) => {
        this.$axios
          .get('/api/web/product/get', {
            params: {
              brand_id: val
            }
          })
          .then(response => {
            this.$store.commit('global/setItems', {
              nama: 'product',
              data: response.data.data
            })
          })
          .catch(error => {
            this.$store.commit('setSnackbar', true)
            this.$store.commit('setText', error.response.status)
          })
          .finally(() => {
            this.isLoadingProduct = false
          })
      })
    },
    async fecthBerita(val) {
      this.isLoadingBerita = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getDataId', {
          nama: 'berita',
          id: val
        })

        result.finally(() => {
          this.isLoadingBerita = false
        })
      })
    },
    setDialogPageModel() {
      this.$store.commit('page/setModel', true)
    }
  },
  components: {
    upload,
    selectImage,
    DialogPage
  }
}
</script>

<style lang="stylus" scoped></style>
