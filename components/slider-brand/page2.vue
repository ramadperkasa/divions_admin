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
              : ''
            : ''
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
            <select-image v-model="image_url"></select-image>
            <v-btn block text color="info" @click="dialog = true">
              <v-icon left>{{
                $route.params.id ? 'mdi-image-edit' : 'mdi-image-plus'
              }}</v-icon>
              {{ $route.params.id ? 'Edit' : 'Tambah' }} gambar
            </v-btn>
            <small class="error--text">
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

                <v-row v-if="tipe_link == 5">
                  <v-col cols="12" style="padding:0px">
                    <v-select
                      label="Pilih Produk *"
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
      :youtube="true"
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
import upload from '~/components/dialog-upload-brand.vue'
import DialogPage from '~/components/dialog-page.vue'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      show: false,
      dialog: false,
      dialogNews: false,
      isLoadingBerita: false,
      isLoadingPage: false,
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
      form: {
        link: ''
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
    'form.link'(value) {
      if (this.tipe_link == 3) {
        this.link = '/page/' + value
      }
    },

    step(value) {
      if (this.tipe_link == 4 && value == 2) {
        this.dialogNews = true
      }
    },

    tipe_link(val) {
      if (val == '5') {
        this.fetchProduct()
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
      select: state => state.slider.select,
      step: state => state.slider.step,
      berita: state => state.global.items.berita
    }),
    berita_id: {
      get() {
        return this.$store.state.slider.form.berita_id
      },
      set(value) {
        this.$store.commit('slider/setBeritaId', value)
      }
    },
    link: {
      get() {
        return this.$store.state.slider.form.link
      },
      set(value) {
        this.$store.commit('slider/setLink', value)
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
    url: {
      get() {
        return this.$store.state.slider.form.url
      },
      set(value) {
        this.$store.commit('slider/setUrl', value)
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
    block_template_id: {
      get() {
        return this.$store.state.slider.form.block_template_id
      },
      set(value) {
        this.$store.commit('slider/setBlockTemplateId', value)
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
    async fetchProduct() {
      this.isLoadingProduct = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'product'
        })

        result.finally(() => {
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
