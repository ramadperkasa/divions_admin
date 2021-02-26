<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb
            page=" Menu /"
            current_page="Sub Menu"
          ></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-menu-open</v-icon>
          <v-toolbar-title>Daftar Sub Menu</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <search-data
              v-model="search"
              @search="f => (search = f)"
            ></search-data>
          </v-col>
          <v-divider class="ml-1 mr-1" inset vertical></v-divider>
          <v-select
            :items="selectMenu"
            v-model="parent_id"
            label="Pilih Menu"
            clearable
            hide-details
          ></v-select>
          <refresh v-model="isLoading" @click="fetch()"></refresh>
          <destroy
            v-model="table.model"
            :item="tableItems"
            @click.native="table.model = !table.model"
          ></destroy>
          <create @click.native="addItem()"></create>
          <exit @click.native="$router.push('/')"></exit>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table
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
            <template v-slot:item.block_template_id="{ item }">{{
              item.page ? item.page : ''
            }}</template>
            <template v-slot:item.ishide="{ item }">
              <ishide :item="item"></ishide>
            </template>
            <template v-slot:item.reorder="props">
              <reorder :props="props"></reorder>
            </template>
            <template v-slot:item.action="{ item }">
              <action :item="item" hide edit destroy></action>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog.form.model" scrollable persistent max-width="80%">
      <v-card>
        <dialog-header :isEdit="isEdit" @close="closeDialog()"></dialog-header>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Nama Sub Menu *"
                v-model="form.title"
                :error="errors.title ? true : false"
                :error-messages="errors.title ? errors.title[0] : ''"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="Array.isArray($store.state.app.lang)">
              <v-text-field
                :hint="$store.state.app.hint"
                label="Nama Sub Menu en*"
                v-model="form.title_en"
                :error="errors.title_en ? true : false"
                :error-messages="errors.title_en ? errors.title_en[0] : ''"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="10" style="padding:0px">
                  <v-select
                    label="Pilih Menu *"
                    v-model="form.parent_id"
                    :items="selectMenu"
                    :error="errors.parent_id ? true : false"
                    :error-messages="
                      errors.parent_id ? errors.parent_id[0] : ''
                    "
                    clearable
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="2" style="padding:0px">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon @click="fetchMenu()">
                        <v-icon v-if="isLoadingMenu"
                          >mdi-spin mdi-refresh</v-icon
                        >
                        <v-icon v-else>mdi-refresh</v-icon>
                      </v-btn>
                    </template>
                    <span>Refresh</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon @click="setDialogMenuModel()">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Tambah</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col md="6">
              <v-select
                label="Pilih Jenis Link *"
                v-model="form.tipe_link"
                :items="select.link"
                :error="errors.tipe_link ? true : false"
                :error-messages="errors.tipe_link ? errors.tipe_link[0] : ''"
                outlined
                clearable
                dense
              ></v-select>
            </v-col>
            <v-col md="6" v-if="form.tipe_link == 4">
              <v-select
                label="Link *"
                v-model="form.url"
                :items="select.internal"
                :error="errors.url ? true : false"
                :error-messages="errors.url ? errors.url[0] : ''"
                outlined
                clearable
                dense
              ></v-select>
            </v-col>
            <v-col md="6" v-if="form.tipe_link == 2">
              <v-text-field
                label="Link *"
                v-model="form.url"
                :error="errors.url ? true : false"
                :error-messages="errors.url ? errors.url[0] : ''"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col md="6" v-if="form.tipe_link == 1">
              <v-row>
                <v-col cols="10" style="padding:0px">
                  <v-select
                    label="Halaman *"
                    v-model="form.block_template_id"
                    :items="selectPage"
                    :error="errors.block_template_id ? true : false"
                    :error-messages="
                      errors.block_template_id
                        ? errors.block_template_id[0]
                        : ''
                    "
                    outlined
                    dense
                    clearable
                  />
                </v-col>
                <v-col style="padding:0px" cols="2">
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
                      <v-btn
                        v-on="on"
                        icon
                        @click="setDialogSettingLayoutModel()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Tambah</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col md="5" v-if="form.tipe_link == 3">
              <v-select
                label="Kategori Berita *"
                v-model="form.kategori_id"
                :items="selectKategoriBerita"
                :error="errors.kategori_id ? true : false"
                :error-messages="
                  errors.kategori_id ? errors.kategori_id[0] : ''
                "
                clearable
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="1" v-if="form.tipe_link == 3">
              <v-row>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="fetchKategoriBerita()">
                      <v-icon v-if="isLoadingKategoriBerita"
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
                      @click="setDialogKategoriBeritaModel()"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Tambah</span>
                </v-tooltip>
              </v-row>
            </v-col>
            <v-col md="4" v-if="form.tipe_link == 1">
              <v-select
                v-model="form.tipe"
                :items="select.tipe"
                label="Pilih Tipe"
                outlined
                dense
                hint="Contoh : /Home"
              ></v-select>
            </v-col>
            <v-col md="8" v-if="form.tipe_link == 1 && form.tipe == 1">
              <v-text-field
                label="Link *"
                v-model="form.url"
                hint="Contoh : /Home"
                :error="errors.url ? true : false"
                :error-messages="errors.url ? errors.url[0] : ''"
                outlined
                dense
              />
            </v-col>
            <v-col md="4" v-if="form.tipe_link == 1 && form.tipe == 2">
              <v-combobox
                label="Link *"
                hint="Contoh : /Home"
                :items="select.links"
                v-model="form.url"
                :error="errors.url ? true : false"
                :error-messages="errors.url ? errors.url[0] : ''"
                outlined
                dense
              />
            </v-col>
            <v-col md="4" v-if="form.tipe_link == 1 && form.tipe == 2">
              <v-select
                label="Pilih Komponent *"
                v-model="form.block_template_detail_content_id"
                :items="select.block"
                :error="errors.block_template_detail_content_id ? true : false"
                :error-messages="
                  errors.block_template_detail_content_id
                    ? errors.block_template_detail_content_id[0]
                    : ''
                "
                outlined
                dense
              />
            </v-col>
            <!-- <v-col md="12" v-if="form.tipe_link == 1">
              <v-text-field
                label="Link *"
                v-model="form.url"
                hint="Contoh : /Home"
                :error="errors.url ? true : false"
                :error-messages="errors.url ? errors.url[0] : ''"
                outlined
                dense
              />
            </v-col> -->

            <!-- <v-col md="12" v-if="form.tipe_link == 3">
              <v-text-field
                label="Link *"
                v-model="form.url"
                :error="errors.url ? true : false"
                :error-messages="errors.url ? errors.url[0] : ''"
                outlined
                dense
              ></v-text-field>
               </v-col> -->
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <dialog-footer
          @close="dialog.form.model = false"
          :btn_new="btn_new"
        ></dialog-footer>
      </v-card>
    </v-dialog>
    <dialog-kategori-berita
      @update="fetchKategoriBerita()"
    ></dialog-kategori-berita>
    <dialog-page @update="fetchPage()"></dialog-page>
    <dialog-menu @update="fetchPage()"></dialog-menu>
    <dialog-setting-layout @update="fetchPage()"></dialog-setting-layout>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/menu/sub.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import DialogKategoriBerita from '~/components/dialog-kategori-berita.vue'
import DialogPage from '~/components/dialog-page.vue'
import DialogMenu from '~/components/dialog-menu.vue'
import Reorder from '~/components/reorder.vue'
import dialogSettingLayout from '~/components/dialog-setting-layout.vue'
import Action from '~/components/action.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'
import destroy from '~/components/destroy.vue'

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Menu: Sub Menu'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'menu-sub')])

    return
  },

  data() {
    return {
      dialog: {
        form: {
          model: false,
          item: '',
          loading: false
        },
        alert: {
          model: true,
          item: '',
          loading: false
        }
      },
      btn_new: true,
      form: {
        id: '',
        title: '',
        title_en: '',
        url: '',
        target: '_blank',
        ishide: 0,
        hastag: '',
        tipe: '',
        reorder: '',
        block_template_id: '',
        has_child: 1,
        tipe_link: 0,
        parent_id: '',
        isEdit: false,
        newStore: true
      },
      select: {
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
        ],
        subMenu: [
          {
            value: 1,
            text: 'Ya'
          },
          {
            value: 2,
            text: 'Tidak'
          }
        ],
        link: [
          {
            value: 1,
            text: 'Halaman'
          },
          {
            value: 4,
            text: 'Internal'
          },
          {
            value: 2,
            text: 'External'
          },
          {
            value: 3,
            text: 'Berita'
          }
        ],
        internal: [
          {
            value: '/news',
            text: '/news'
          },
          {
            value: '/brand',
            text: '/brand'
          },
          {
            value: '/vacancy',
            text: '/vacancy'
          }
          // {
          //   value: '/gallery',
          //   text: '/gallery'
          // },
        ],
        page: [],
        reorder: [],
        target: [
          {
            value: '_blank',
            text: 'Buka Halaman Baru'
          },
          {
            value: '_parent',
            text: 'Ganti Halaman'
          }
        ]
      },
      isEdit: false,
      table: {
        model: false,
        items: []
      },
      options: {},
      search: '',
      isLoading: false,
      isLoadingPage: false,
      isLoadingPage: false,
      isLoadingMenu: false,
      isLoadingKategoriBerita: false
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)

    this.fetchMenu()
    this.fetchPage()
    this.fetchBrand()
    this.fetchKategoriBerita()
  },
  methods: {
    ...mapMutations([
      'setOptions',
      'setDialogDestroys',
      'setCode',
      'setUrl',
      'setSubUrl',
      'setStoreDefault',
      'setIsClickEdit'
    ]),

    ...mapActions(['getData', 'storeData']),
    fetch() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        // const { page, itemsPerPage, sortBy, sortDesc } = this.options
        var option = this.options
        this.setOptions(option)

        var result = this.getData(this.search)

        result.finally(() => {
          this.isLoading = false
        })
      })
      this.isLoading = false
    },
    setDialogKategoriBeritaModel() {
      this.$store.commit('kategoriberita/setModel', true)
    },
    setDialogPageModel() {
      this.$store.commit('page/setModel', true)
    },
    setDialogMenuModel() {
      this.$store.commit('menu/setModel', true)
    },
    setDialogSettingLayoutModel() {
      this.$store.commit('settinglayout/setModel', true)
    },
    fetchBrand() {
      this.isLoadingBrand = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'brand'
        })

        result.finally(() => {
          this.isLoadingBrand = false
        })
      })
      this.isLoadingBrand = false
    },
    fetchMenu() {
      this.isLoadingMenu = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'menu'
        })

        result.finally(() => {
          this.isLoadingMenu = false
        })
      })
      this.isLoadingMenu = false
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
      this.isLoadingPage = false
    },
    fetchKategoriBerita() {
      this.isLoadingKategoriBerita = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'kategori-berita'
        })

        result.finally(() => {
          this.isLoadingKategoriBerita = false
        })
      })
      this.isLoadingKategoriBerita = false
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
    'form.block_template_id'(val) {
      this.$axios
        .get('/api/web/menu/get-existing-links')
        .then(response => {
          this.select.links = response.data.data
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
          this.select.block = response.data.data.map(f => {
            return {
              ...f,
              ...{
                value:
                  f.id +
                  ',' +
                  f.block_template_detail_id +
                  ',' +
                  f.block_template_id,
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
    'dialog.form.model'(val) {
      if (val) {
        this.$store.commit('setIsClickCancel', false)
      }
    },

    'form.tipe_link'(val) {
      if (val != null) {
        if (!this.isEdit) {
          this.form.url = ''
          this.form.block_template_id = ''
        }
      }
    },

    'form.brand_id'(val) {
      if (val) {
        this.form.url =
          '/brand/' +
          this.selectBrand.find(f => {
            return f.value == val
          }).slug
      }
    },

    'form.kategori_id'(val) {
      if (val) {
        this.form.url =
          '/news/' +
          this.selectKategoriBerita.filter(f => {
            return f.value == val
          })[0]['text']
      } else {
        this.form.url = ''
      }
    },
    'form.url'() {
      if (
        this.form.tipe_link == 1 && this.form.url
          ? this.form.url.charAt(0) != '/'
          : false
      ) {
        this.form.url = '/' + this.form.url
      }
    },
    options: {
      handler() {
        this.fetch()
      },
      deep: true
    },
    parent_id() {
      this.fetch()
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
        this.form.block_template_id = this.itemEdit.block_template_id
        this.form.url = this.itemEdit.url
        this.form.block_template_detail_content_id =
          this.itemEdit.block_template_detail_content_id +
          ',' +
          this.itemEdit.block_template_detail_id +
          ',' +
          this.itemEdit.block_template_id
        this.form.tipe = this.itemEdit.block_template_detail_content_id ? 2 : 1
        this.form.tipe_link = eval(this.itemEdit.tipe_link)
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
      selectBrand: state => state.global.items.brand,
      selectPage: state => state.global.items.layout,
      selectMenu: state => state.global.items.menu,
      selectKategoriBerita: state => state.global.items.kategoriBerita
    }),

    tableItems: {
      get() {
        return this.$store.state.tableItems
      },
      set(tableItems) {
        this.$store.commit('setTableItems', tableItems)
      }
    },

    parent_id: {
      get() {
        return this.$store.state.parent_id
      },
      set(parent_id) {
        this.$store.commit('setParentId', parent_id)
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
    Ishide,
    Reorder,
    DialogKategoriBerita,
    DialogPage,
    DialogMenu,
    Action,
    refresh,
    create,
    exit,
    destroy,
    dialogSettingLayout
  }
}
</script>
