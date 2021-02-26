<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb
            page=" Uploads /"
            current_page="List Upload Product"
          ></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-upload-multiple-outline</v-icon>
          <v-toolbar-title>Daftar Upload Product</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <search-data
              v-model="search"
              @search="f => (search = f)"
            ></search-data>
          </v-col>
          <v-divider class="ml-1 mr-1" inset vertical></v-divider>
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                @click="
                  grid = true
                  list = false
                "
              >
                <v-icon :color="grid ? 'primary' : ''">mdi-view-grid</v-icon>
              </v-btn>
            </template>
            <span>Grid View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                @click="
                  grid = false
                  list = true
                "
              >
                <v-icon :color="list ? 'primary' : ''">mdi-view-list</v-icon>
              </v-btn>
            </template>
            <span>List View</span>
          </v-tooltip> -->
          <refresh v-model="isLoading" @click="fetch()"></refresh>
          <destroy
            v-model="table.model"
            :item="tableItems"
            @click.native="table.model = !table.model"
          ></destroy>
          <create @click.native="addItem()"></create>
          <exit
            @click.native="$router.push('/brand/' + $store.state.app.app + '/')"
          ></exit>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table
            v-if="list"
            :headers="headers"
            :items="lists.data"
            class="elevation-1"
            :server-items-length="total"
            :options.sync="options"
            :search="search"
            :loading="isLoading"
            multi-sort
            loading-text="Memuat data... Harap tunggu sebentar"
            no-data-text="Tidak ada data"
            no-results-text="Data tidak ditemukan"
            :items-per-page="10"
            :show-select="table.model"
            v-model="tableItems"
            :footer-props="footerProps"
          >
            <template v-slot:item.no="{ item }">
              {{ lists.data.indexOf(item) + lists.from }}
            </template>
            <template v-slot:item.folder_id="{ item }">
              {{ item.folder ? item.folder.nama_folder : '' }}
            </template>
            <template v-slot:item.image="{ item }">
              <video
                width="50"
                height="60"
                v-if="item.type == 1"
                :src="process.env.API_URL + item.image"
                :type="type"
                @click="openImage(item)"
                class="grey lighten-2 ma-1 hover--image"
              >
                Browser kamu ga support untuk menjalankan video ini
              </video>
              <v-img
                :src="
                  item.type == 0
                    ? process.env.API_URL + item.image
                    : item.type == 2
                    ? 'https://img.youtube.com/vi/' + item.image + '/0.jpg'
                    : false
                "
                :lazy-src="process.env.API_URL + item.image"
                @click="openImage(item)"
                v-else
                aspect-ratio="1"
                height="40"
                width="50"
                class="grey lighten-2 ma-1 hover--image"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </template>
            <template v-slot:item.type="{ item }">
              {{ item.type == 0 ? 'Foto' : 'Video' }}
            </template>
            <template v-slot:item.action="{ item }">
              <action :item="item" edit destroy></action>
            </template>
          </v-data-table>
          <template v-else>
            <template v-if="lists.data ? lists.data.length > 0 : ''">
              <v-row>
                <v-col
                  cols="3"
                  v-for="(item, index) in lists.data"
                  :key="index"
                  class="d-flex child-flex"
                >
                  <v-card
                    flat
                    max-width="285"
                    max-height="200"
                    tile
                    class="d-flex hover--image"
                    :loading="isLoading"
                  >
                    <v-menu absolute offset-y style="max-width: 600px">
                      <template v-slot:activator="{ on }">
                        <video
                          width="100%"
                          height="100%"
                          v-if="item.type == 1"
                          v-on="on"
                          :src="process.env.API_URL + item.image"
                          :type="type"
                        >
                          Browser kamu ga support untuk menjalankan video ini
                        </video>
                        <v-img
                          v-else
                          v-on="on"
                          :src="process.env.API_URL + item.image"
                          :lazy-src="process.env.API_URL + item.image"
                          aspect-ratio="4:3"
                          width="100%"
                          height="100%"
                          class="grey lighten-2"
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </template>
                      <v-list dense>
                        <v-list-item
                          @click="openImage(item)"
                          v-if="
                            $auth.user.all_permissions.includes(
                              'read-' + $route.name
                            )
                          "
                        >
                          <v-list-item-title>
                            <v-icon small left>mdi-eye</v-icon>Lihat Gambar
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="setIsClickEdit({ item, status: true })"
                          v-if="
                            $auth.user.all_permissions.includes(
                              'edit-' + $route.name
                            )
                          "
                        >
                          <v-list-item-title>
                            <v-icon small left>mdi-pencil</v-icon>Edit Gambar
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="$store.state.delete"
                          @click="
                            setDialogDestroy({ id: item.id, status: true })
                          "
                        >
                          <v-list-item-title>
                            <v-icon small left>mdi-trash-can-outline</v-icon
                            >Hapus Gambar
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card>
                </v-col>
              </v-row>
              <div class="text-right mt-5">
                <v-pagination
                  v-model="options.page"
                  :length="lists.last_page"
                ></v-pagination>
              </div>
            </template>
            <template v-else>{{
              isLoading ? 'Tunggu...' : 'Tidak ada data'
            }}</template>
          </template>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="dialog.form.model"
      scrollable
      persistent
      max-width="700px"
    >
      <v-card>
        <dialog-header :isEdit="isEdit" @close="closeDialog()"></dialog-header>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <template v-if="form.type == 0">
                <v-img
                  v-if="isEdit == false"
                  :src="form.image ? form.image : '/no-image.svg'"
                ></v-img>
                <v-img
                  v-else
                  :src="
                    form.image
                      ? process.env.API_URL + form.image
                      : '/no-image.svg'
                  "
                ></v-img>
              </template>
              <template v-else-if="form.type == 1">
                <video width="207" height="125" controls v-if="isEdit == false">
                  <source :src="form.seeVideo" :type="type" />
                  Browser kamu ga support untuk menjalankan video ini
                </video>
                <video width="207" height="125" controls v-else>
                  <source
                    :src="process.env.API_URL + form.image"
                    :type="type"
                  />
                  Browser kamu ga support untuk menjalankan video ini
                </video>
              </template>
              <template v-else-if="form.type == 2">
                <iframe
                  width="100%"
                  height="200px"
                  :src="`https://www.youtube.com/embed/` + form.image"
                  frameborder="0"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </template>
              <template v-else>
                <v-img src="/no-image.svg"></v-img>
              </template>

              <v-btn
                @click.prevent="dialog.upload = true"
                block
                text
                color="info"
              >
                <v-icon left>mdi-plus</v-icon>Tambah gambar
              </v-btn>
              <!-- <v-btn @click.prevent="file" block text color="info">
                <v-icon left>mdi-plus</v-icon>Tambah gambar
              </v-btn>-->
              <input
                type="file"
                style="display: none;"
                accept="video/*, image/*"
                ref="fileInput"
                @change="fileSelected"
              />
            </v-col>
            <v-col cols="8">
              <v-text-field
                label="Nama Foto *"
                v-model="form.description"
                :error="errors.description ? true : false"
                :error-messages="
                  errors.description ? errors.description[0] : ''
                "
                outlined
                dense
              ></v-text-field>
              <v-row>
                <v-col cols="10">
                  <v-select
                    label="Nama Folder Product"
                    :items="selectFolder"
                    v-model="form.folder_id"
                    :loading="isLoadingFolder"
                    :disabled="isLoadingFolder"
                    :error="errors.folder_id ? true : false"
                    :error-messages="
                      errors.folder_id ? errors.folder_id[0] : ''
                    "
                    outlined
                    clearable
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="2">
                  <v-row>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon @click="fetchFolder()">
                          <v-icon v-if="isLoadingFolder"
                            >mdi-spin mdi-refresh</v-icon
                          >
                          <v-icon v-else>mdi-refresh</v-icon>
                        </v-btn>
                      </template>
                      <span>Refresh</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon @click="setDialogFolderModel()">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Tambah</span>
                    </v-tooltip>
                  </v-row>
                </v-col>
              </v-row>

              <v-text-field
                label="Tipe"
                readonly
                v-model="form.jenis"
                :error="errors.jenis ? true : false"
                :error-messages="errors.jenis ? errors.jenis[0] : ''"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <dialog-footer
          @close="dialog.form.model = false"
          :btn_new="btn_new"
        ></dialog-footer>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.crop.model" width="800" persistent>
      <v-card>
        <v-card-title>
          Potong Foto
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog.crop.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <vue-croppie
            ref="croppieRef"
            :enableOrientation="true"
            :boundary="{ width: 450, height: 300 }"
          ></vue-croppie>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="
              dialog.upload = false
              dialog.crop.model = false
              form.isOrigin = false
            "
          >
            <v-icon left>mdi-image-auto-adjust</v-icon>Pakai Ukuran Original
          </v-btn>
          <v-btn color="primary" @click="crop()">
            <v-icon left>mdi-crop</v-icon>Potong Foto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- +                    Start Bagian Dialog                        + -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <dialog-folder @update="fetchFolder()"></dialog-folder>

    <v-dialog v-model="dialog.upload" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title
          >Pilih Upload</v-card-title
        >

        <v-card-text>
          <center>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  fab
                  large
                  dark
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                  @click.prevent="file"
                >
                  <v-icon>mdi-image</v-icon>
                </v-btn>
              </template>
              <span>Gallery Lokal</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="error"
                  fab
                  large
                  dark
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="dialog.youtube = true"
                >
                  <v-icon>mdi-youtube</v-icon>
                </v-btn>
              </template>
              <span>Embed Youtube</span>
            </v-tooltip>
          </center>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog.upload = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <upload
      v-model="dialog.youtube"
      @upload="value => setUploadYoutube(value)"
      :youtube="true"
      :uploads="true"
      @close="dialog.youtube = false"
    ></upload>
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- +                      End Bagian Dialog                        + -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/brands/uploads/index.json'
import dialogFolder from '~/components/dialog-folder-brand.vue'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Action from '~/components/action.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'
import destroy from '~/components/destroy.vue'
import upload from '~/components/dialog-upload.vue'
export default {
  middleware: ['authenticated', 'brand'],
  layout: 'default-brand',
  head() {
    return {
      title: 'Uploads: Uploads Product'
    }
  },
  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'brand-upload')])
    return
  },
  data() {
    return {
      model: false,
      grid: false,
      list: true,
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      },
      dialog: {
        form: {
          model: false,
          item: '',
          loading: false
        },
        alert: {
          model: false,
          item: '',
          loading: false
        },
        foto: {
          model: false,
          item: '',
          loading: false
        },
        crop: {
          model: false
        },
        detail: {
          model: false
        },
        upload: false,
        youtube: false
      },
      btn_new: true,
      form: {
        _id: '',
        id: '',
        description: '',
        description_en: '',
        image: '',
        type: '',
        folder_id: '',
        ishide: '',
        reorder: '',
        newStore: true,
        seeVideo: '',
        jenis: ''
      },
      image: '',
      type: '',
      selectedFiles: '',
      isEdit: false,
      table: {
        model: false,
        items: []
      },
      coba: [],
      options: {},
      search: '',
      isLoading: false,
      isLoadingFolder: false
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)

    this.fetchFolder()
  },
  methods: {
    ...mapMutations([
      'setOptions',
      'setDialogDestroys',
      'setCode',
      'setUrl',
      'setSubUrl',
      'setStoreDefault',
      'setIsClickEdit',
      'setDialogDestroy',
      'setModelDialogItem'
    ]),

    setUploadYoutube(value) {
      this.form.image = value.embed
      this.form.type = value.type
      this.form.jenis = value.jenis
      this.dialog.upload = false
    },

    ...mapActions(['getData', 'storeData']),
    fetch() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        const { page, itemsPerPage, sortBy, sortDesc } = this.options
        this.setOptions({ page, itemsPerPage, sortBy, sortDesc })

        var result = this.getData(this.search)

        result.finally(() => {
          this.isLoading = false
        })
      })
      this.isLoading = false
    },

    setDialogFolderModel() {
      this.$store.commit('folderbrand/setModel', true)
    },

    fetchFolder() {
      this.isLoadingFolder = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'brand-folder'
        })

        result.finally(() => {
          this.isLoadingFolder = false
        })
      })
      this.isLoadingFolder = false
    },
    fileSelected(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      if (URL != null) {
        this.form.seeVideo = URL.createObjectURL(files[0])
        var reader = new FileReader()
        reader.onload = e => {
          this.form.image = e.target.result
        }
        reader.readAsDataURL(files[0])
      }
      this.dialog.upload = false
      if (files[0].type.substring(0, 5) == 'image') {
        this.dialog.crop.model = true
        setTimeout(() => {
          var reader = new FileReader()
          reader.onload = e => {
            this.$refs.croppieRef.bind({
              url: e.target.result
            })
          }
          reader.readAsDataURL(files[0])
        }, 500)
      } else {
        if (URL != null) {
          this.form.seeVideo = URL.createObjectURL(files[0])
          var reader = new FileReader()
          reader.onload = e => {
            this.form.image = e.target.result
          }
          reader.readAsDataURL(files[0])
        }
      }
      this.form.jenis = files[0].type
      this.form.type = files[0].type.substring(0, 5) == 'video' ? 1 : 0
      const input = this.$refs.fileInput
      input.type = 'text'
      input.type = 'file'
    },
    openImage(item) {
      this.src = process.env.API_URL + item.image
      this.types = item.type
      this.setModelDialogItem(true)
    },
    crop() {
      let options = {
        size: { width: 450, height: 300 },
        format: 'png'
      }
      this.$refs.croppieRef.result(options, output => {
        this.form.image = this.croppieImage = output
      })
      this.dialog.crop.model = false
      this.dialog.upload = false
    },
    file() {
      this.$refs.fileInput.click()
    },
    store(data) {
      this.storeData(data)
    },
    addItem() {
      this.dialog.form.model = true
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
      this.setStoreDefault()
      this.isEdit = false
      this.btn_new = true
    },
    clearItem() {
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
    },
    closeDialog() {
      this.dialog.form.model = false
      this.setIsClickEdit({ item: {}, status: false })
    }
  },

  watch: {
    'dialog.form.model'(val) {
      if (val) {
        this.$store.commit('setIsClickCancel', false)
      }
    },

    options: {
      handler() {
        this.fetch()
      },
      deep: true
    },

    isClick(newValue) {
      if (newValue == true) {
        this.store(this.form)
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.clearItem()
        this.$store.commit('setIsErrors', '')
      }
    },

    isClickEdit(newValue) {
      if (newValue == true) {
        this.dialog.form.model = true

        let self = this
        Object.keys(this.form).forEach(function(key) {
          self.form[key] = self.itemEdit[key]
        })
        this.isEdit = true
        this.btn_new = false
      }
    },

    isClickNew(newValue) {
      if (newValue == true) {
        this.form.newStore = true
        this.store(this.form)
      }
    },

    isClickCancel(newValue) {
      if (newValue) {
        this.form.newStore = true
        this.closeDialog()
      }
    },

    isSuccess(newValue) {
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
      this.closeDialog()
    },

    isSuccessNew(newValue) {
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
    },

    search(newValue, oldValue) {
      const { itemPerPage } = this.options
      this.options.page = 1

      this.setOptions({ page: 1, itemPerPage })
      this.getData(newValue)
    }
  },

  computed: {
    ...mapState({
      lists: state => state.lists,
      total: state => state.total,
      errors: state => state.errors,
      itemEdit: state => state.itemEdit,
      isErrors: state => state.isErrors,
      isClickEdit: state => state.isClickEdit,
      isClick: state => state.isClick,
      isClickNew: state => state.isClickNew,
      isClickCancel: state => state.isClickCancel,
      isSuccess: state => state.isSuccess,
      isSuccessNew: state => state.isSuccessNew,
      footerProps: state => state.footerProps,
      selectFolder: state => state.global.items.produkKategoriBrand
    }),
    tableItems: {
      get() {
        return this.$store.state.tableItems
      },
      set(tableItems) {
        this.$store.commit('setTableItems', tableItems)
      }
    },
    src: {
      get() {
        return this.$store.state.src
      },
      set(value) {
        this.$store.commit('setSrc', value)
      }
    },
    types: {
      get() {
        return this.$store.state.type
      },
      set(value) {
        this.$store.commit('setType', value)
      }
    },

    headers() {
      return datatable['headers']
    }
  },
  components: {
    ButtonCancel,
    ButtonSubmit,
    ButtonSubmitNew,
    AlertBreadcrumb,

    dialogFolder,
    Action,
    refresh,
    create,
    exit,
    destroy,
    upload
  }
}
</script>
