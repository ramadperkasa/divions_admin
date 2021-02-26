<template>
  <div>
    <v-card :loading="isLoading" :disabled="isLoading">
      <v-card-title> <v-icon left>mdi-pencil</v-icon>Produk </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <select-image v-model="form.cover_image"></select-image>
            <v-btn block text color="info" @click="dialogImage = true">
              <v-icon left>mdi-image-plus</v-icon>Tambah Foto Produk
            </v-btn>
            <small class="error--text">{{
              errors.cover_image ? errors.cover_image[0] : ''
            }}</small>
            <br />
          </v-col>
          <v-col cols="9">
            <!-- <small-text-editor
              label="Judul Produk"
              v-model="form.nama"
              :isText="true"
            ></small-text-editor>
            <small class="error--text">{{
              errors.nama ? errors.nama[0] : ''
            }}</small> -->

            <v-row>
              <v-col cols="3" class="no-p">
                <v-text-field
                  label="Kode Produk"
                  v-model="form.code_product"
                  :error="errors.code_product ? true : false"
                  :error-messages="
                    errors.code_product ? errors.code_product[0] : ''
                  "
                  counter="10"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="9" class="no-p">
                <v-text-field
                  label="Judul Produk"
                  v-model="form.nama"
                  :error="errors.nama ? true : false"
                  :error-messages="errors.nama ? errors.nama[0] : ''"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <small-text-editor
              label="Sub Judul Produk"
              v-model="form.subtitle"
              :isText="true"
            ></small-text-editor>
            <small class="error--text">{{
              errors.subtitle ? errors.subtitle[0] : ''
            }}</small>
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
              v-if="$store.state.app.hargaProduk"
              label="Harga Produk "
              prefix="Rp."
              v-model="form.harga"
              :error="errors.harga ? true : false"
              :error-messages="errors.harga ? errors.harga[0] : ''"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <texteditor
          label="Deksripsi Produk"
          v-model="form.deskripsi"
        ></texteditor>
        <small class="error--text">{{
          errors.deskripsi ? errors.deskripsi[0] : ''
        }}</small>

        <v-simple-table disabled class="no-height no-style" fixed-header>
          <template v-slot:default>
            <thead>
              <tr>
                <th width="40%">Gambar</th>
                <th width="40%">Nama Varian</th>
                <th width="10%"></th>
              </tr>
              <tr v-for="(val, index) in form.warna.length" :key="index">
                <td class="pt-3">
                  <v-col cols="12" class="no-p">
                    <v-row>
                      <v-col cols="10" class="no-p">
                        <v-btn
                          block
                          text
                          color="info"
                          @click="form.warna[index]['variant_model'] = true"
                        >
                          <v-row
                            v-if="form.warna[index]['image_id']"
                            justify="center"
                            align="center"
                          >
                            <table-image
                              v-model="form.warna[index]['image_id']"
                              type="0"
                            ></table-image>
                            <span>Edit Foto Produk</span>
                          </v-row>
                          <div v-else>
                            <v-icon left>mdi-image-plus</v-icon>Tambah Foto
                            Produk
                          </div>
                        </v-btn>
                        <dialog-upload
                          v-model="form.warna[index]['variant_model']"
                          :defaultImage="form.warna[index]['image_id']"
                          @upload="
                            value => (form.warna[index]['image_id'] = value)
                          "
                          @close="form.warna[index]['variant_model'] = false"
                          :media="true"
                        ></dialog-upload>
                      </v-col>
                      <v-col cols="2" class="no-p"> </v-col>
                    </v-row>
                  </v-col>
                </td>
                <td>
                  <v-row>
                    <v-col cols="10" class="no-p">
                      <v-select
                        :loading="isLoadingWarna"
                        :disabled="isLoadingWarna"
                        :items="selectWarna"
                        class="pt-3"
                        label="Nama Varian"
                        type="number"
                        v-model="form.warna[index].warna_id"
                        :error="errors.warna_id ? true : false"
                        :error-messages="
                          errors.warna_id ? errors.warna_id[0] : ''
                        "
                        outlined
                        dense
                      >
                        <template v-slot:item="data">
                          <template>
                            <v-list-item-content>
                              <v-list-item-title
                                v-html="
                                  `<v-row>
                                    <div style='background-color:#` +
                                    data.item.code_hex +
                                    `;width:12px;height:12px'><span class='ml-4'>` +
                                    data.item.text +
                                    `</span></div>


                                    </v-row>`
                                "
                              ></v-list-item-title>
                              <v-list-item-subtitle>
                                {{
                                  '#' +
                                    data.item.code_hex +
                                    ' - ' +
                                    data.item.nama_singkat
                                }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="2" class="mt-3 no-p">
                      <v-row>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon @click="fetchWarna()">
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
                              @click="setDialogWarnaModel()"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                          <span>Tambah</span>
                        </v-tooltip>
                      </v-row>
                    </v-col>
                  </v-row>
                </td>
                <td>
                  <v-btn color="primary" icon class="mb-3" @click="minus(index)"
                    ><v-icon>mdi-minus</v-icon></v-btn
                  >
                </td>
              </tr>
            </thead>
          </template>
        </v-simple-table>
        <v-btn class="my-3" color="primary" small @click="pushTable()"
          ><v-icon small left>mdi-plus</v-icon>Tambah Variant</v-btn
        >

        <v-row>
          <v-col cols="12">
            <v-card outlined>
              <v-card-subtitle>Produk Detail</v-card-subtitle>
              <v-card-text>
                <v-col cols="12">
                  <template v-for="(item, index) in form.detail.length">
                    <v-row :key="index">
                      <v-col cols="11">
                        <v-text-field
                          v-model="form.detail[index].title"
                          label="Judul"
                          outlined
                          dense
                        ></v-text-field>
                        <texteditor
                          v-model="form.detail[index].content"
                        ></texteditor>
                      </v-col>
                      <v-col cols="1" class="d-flex align-center">
                        <v-btn-toggle dense rounded>
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-on="on"
                                icon
                                @click="
                                  form.detail.length == 1
                                    ? confirm(
                                        'Detail Produk tidak boleh kurang dari 1'
                                      )
                                    : destroyDetail(index)
                                "
                              >
                                <v-icon small>mdi-playlist-minus</v-icon>
                              </v-btn>
                            </template>
                            <span>Kurangi Block</span>
                          </v-tooltip>

                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-on="on"
                                icon
                                @click="
                                  dialog.reorder.index = index
                                  dialog.reorder.posisi = 0
                                  dialog.reorder.model = true
                                  dialog.reorder.child = false
                                "
                              >
                                {{ form.detail[index].reorder }}
                              </v-btn>
                            </template>
                            <span>Urutkan</span>
                          </v-tooltip>
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-on="on"
                                icon
                                @click="
                                  form.detail[index].ishide == 0
                                    ? (form.detail[index].ishide = 1)
                                    : (form.detail[index].ishide = 0)
                                "
                              >
                                <v-icon
                                  v-if="form.detail[index].ishide == 0"
                                  small
                                  >mdi-eye</v-icon
                                >
                                <v-icon v-else small color="error"
                                  >mdi-eye-off</v-icon
                                >
                              </v-btn>
                            </template>
                            <span>{{
                              form.detail[index].ishide == 0
                                ? 'Tidak Disembunyikan'
                                : 'Disembunyikan'
                            }}</span>
                          </v-tooltip>
                        </v-btn-toggle>
                      </v-col>
                    </v-row>
                    <v-divider
                      v-if="index + 1 != form.detail.length"
                      :key="'div' + index"
                    ></v-divider>
                  </template>

                  <v-btn color="primary" block outlined @click="countDetail()">
                    <v-icon small left>mdi-plus</v-icon>Tambah Produk Detail
                  </v-btn>
                </v-col>
              </v-card-text>
            </v-card>
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
    <v-dialog v-model="dialog.reorder.model" flat persistent max-width="300px">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="10">
              <v-text-field
                label="Urutkan"
                v-model="setReorder"
                required
                type="number"
                number
                @keyup.enter="dialog.reorder.model = false"
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn icon @click="dialog.reorder.model = false"
                ><v-icon>mdi-send</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <dialog-upload
      v-model="dialogImage"
      :defaultImage="form.cover_image"
      @upload="value => (form.cover_image = value)"
      @close="dialogImage = false"
      :media="true"
    ></dialog-upload>
    <dialog-produk-kategori
      @update="fetchProdukKategori()"
    ></dialog-produk-kategori>
    <dialog-warna @update="fetchWarna()"></dialog-warna>
  </div>
</template>

<script>
import selectImage from '~/components/select-image.vue'
import Texteditor from '~/components/texteditor.vue'
import DialogUpload from '~/components/dialog-upload-brand.vue'
import dialogProdukKategori from '~/components/dialog-kategori-produk.vue'
import dialogWarna from '~/components/dialog-warna.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  middleware: ['authenticated', 'brand'],
  layout: 'default-brand',
  head() {
    return {
      title: 'Produk: Form'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'product')])

    return
  },
  data() {
    return {
      dialogImage: false,
      dialogImages: false,
      isLoadingWarna: false,
      isLoadingKategori: false,
      isLoading: false,
      isLoadingPage: false,
      dialog: {
        reorder: {
          model: false,
          posisi: 2,
          index: 0,
          child: false
        }
      },
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
      first: true,
      form: {
        code_product: '',
        description: '',
        produk_kategori_id: '',
        url: '',
        logo_id: '',
        ishide: '',
        reorder: '',
        brand_id: '',
        subtitle: '',
        id: '',
        _id: '',
        nama: '',
        nama_en: '',
        deskripsi: '',
        cover_image: '',
        harga: '',
        ishide: '',
        reorder: '',
        created_at: '',
        updated_at: '',
        deleted_at: '',
        status: '',
        keterangan: '',
        images: [],
        warna: [
          {
            id: '',
            warna_id: '',
            produk_id: '',
            brand_id: this.$route.params.uuid,
            variant_model: false,
            image_id: ''
          }
        ],
        detail: [
          {
            title: '',
            content: '',
            reorder: '1',
            ishide: '0'
          }
        ]
      }
    }
  },
  watch: {
    product: {
      handler(newValue) {
        if (this.first) {
          var self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = newValue[key]
          })
          // this.countDetail()
          this.form.detail = []
          newValue.brand_produk_detail.forEach(element => {
            this.form.detail.push({
              title: element.title,
              content: element.content,
              reorder: element.reorder,
              ishide: element.ishide
            })
          })
          this.form.warna = []
          if (newValue.brand_produk_warna) {
            if (newValue.brand_produk_warna.length > 0) {
              newValue.brand_produk_warna.forEach(elements => {
                this.form.warna.push({
                  id: elements.id,
                  warna_id: elements.warna_id,
                  produk_id: elements.product_id,
                  brand_id: elements.brand_id,
                  variant_model: false,
                  image_id: elements.image_url
                })
              })
            } else {
              this.form.warna = [
                {
                  id: '',
                  warna_id: '',
                  produk_id: '',
                  brand_id: this.$route.params.uuid,
                  variant_model: false,
                  image_id: ''
                }
              ]
            }
          } else {
            this.form.warna = [
              {
                id: '',
                warna_id: '',
                produk_id: '',
                brand_id: this.$route.params.uuid,
                variant_model: false,
                image_id: ''
              }
            ]
          }
          this.first = false
        }
      },
      deep: true
    },

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
    this.fetchProdukKategori()
    this.fetch()
    this.fetchWarna()
    this.form.detail = [
      {
        title: '',
        content: '',
        reorder: '1',
        ishide: '0'
      }
    ]
  },
  methods: {
    ...mapActions('global', ['getDataId']),

    ...mapActions(['storeData']),

    async fetch() {
      this.isLoading = true

      return new Promise((resolve, reject) => {
        let data = this.getDataId({ nama: 'produk', id: this.$route.params.id })

        data.finally(() => {
          this.isLoading = false
        })
      })
    },

    confirm() {
      if (confirm('Anda yakin akan kembali, data yang terisi akan hilang ?')) {
        this.$router.push('/brand/' + this.$store.state.app.app + '/product')
      }
    },

    fetch() {
      this.isLoadingPage = true

      return new Promise((resolve, reject) => {
        var data = this.getDataId({
          nama: 'product',
          id: this.$route.params.id
        })

        data.finally(() => {
          this.isLoadingPage = false
        })
      })
    },
    minus(item) {
      if (this.form.warna.length > 1) {
        this.form.warna.splice(item, 1)
      } else if (this.form.warna.length == 1) {
        this.form.warna = [
          {
            id: '',
            warna_id: '',
            produk_id: '',
            brand_id: this.$route.params.uuid,
            image_id: '',
            variant_model: false
          }
        ]
      }
    },
    pushTable() {
      this.form.warna.push({
        id: '',
        warna_id: '',
        produk_id: '',
        brand_id: this.$route.params.uuid,
        image_id: '',
        variant_model: false
      })
    },
    setDialogWarnaModel() {
      this.$store.commit('warna/setModel', true)
    },
    fetchWarna() {
      this.isLoadingWarna = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'warna'
        })
        result.finally(() => {
          this.isLoadingWarna = false
        })
      })
    },
    countDetail() {
      this.form.detail.push({
        id: '',
        title: '',
        content: '',
        reorder:
          eval(this.form.detail[eval(this.form.detail.length - 1)]['reorder']) +
          1,
        ishide: '0'
      })
    },
    destroyDetail(item) {
      this.form.detail.splice(item, 1)
    },

    store() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        var data = this.storeData(this.form)
        data
          .then(() => {
            this.$router.push(
              '/brand/' + this.$store.state.app.app + '/product'
            )
          })
          .catch(() => {})
          .finally(() => {
            this.isLoading = false
          })
      })
    },
    setDialogProdukKategoriModel() {
      this.$store.commit('kategoriProduk/setModel', true)
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
    }
  },
  components: {
    'dialog-produk-kategori': dialogProdukKategori,
    'dialog-warna': dialogWarna,
    DialogUpload,
    selectImage,
    Texteditor
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      product: state => state.global.items.produk,
      selectProdukKategori: state => state.global.items.produkKategori,
      selectWarna: state => state.global.items.warna
    }),
    setReorder: {
      get() {
        let index = this.dialog.reorder.index

        return this.form.detail[index]['reorder']
      },
      set(value) {
        let index = this.dialog.reorder.index
        return (this.form.detail[index]['reorder'] = value)
      }
    }
  }
}
</script>
