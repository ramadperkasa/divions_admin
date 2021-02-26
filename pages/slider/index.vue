<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb current_page="Slider"></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-page-layout-sidebar-right</v-icon>
          <v-toolbar-title>Daftar Slider</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <search-data
              v-model="search"
              @search="f => (search = f)"
            ></search-data>
          </v-col>
          <refresh v-model="isLoading" @click="fetch()"></refresh>
          <destroy
            v-model="table.model"
            :item="tableItems"
            @click.native="table.model = !table.model"
          ></destroy>
          <v-menu offset-y>
            <template v-slot:activator="{ on: menu }">
              <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn v-on="{ ...tooltip, ...menu }" icon>
                    <v-icon>mdi-tab-plus</v-icon>
                  </v-btn>
                </template>
                <span>Tambah Data</span>
              </v-tooltip>
            </template>
            <v-list dense>
              <v-list-item
                @click="
                  $store.commit('setClearForm')
                  $store.commit('app/setActionSlider', true)
                  $router.push('/slider/form/')
                "
              >
                <v-list-item-title>Buat Slider dengan link</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  $store.commit('setClearForm')
                  $store.commit('app/setActionSlider', false)
                  $router.push('/slider/form/')
                "
              >
                <v-list-item-title>Buat Slider tanpa link</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

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
            <template v-slot:item.tipe_link="{ item }">
              {{ viewJenisLink(item) }}
            </template>
            <template v-slot:item.image_url="{ item }">
              <table-image
                v-if="item.berita"
                v-model="item.berita.cover_image"
                :type="item.berita.type_img"
              ></table-image>
              <table-image
                v-else
                v-model="item.image_url"
                :type="item.type_img"
              ></table-image>
            </template>
            <template v-slot:item.ishide="{ item }">
              <ishide :item="item"></ishide>
            </template>
            <template v-slot:item.reorder="props">
              <reorder :props="props"></reorder>
            </template>
            <template v-slot:item.action="{ item }">
              <action
                :item="item"
                destroy
                hide
                :edit="{ status: true, link: '/slider/form/' + item.id }"
              ></action>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog.form.model" scrollable persistent max-width="65%">
      <v-card>
        <dialog-header :isEdit="isEdit" @close="closeDialog()"></dialog-header>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <!-- <v-img
                v-if="isEdit == false"
                :src="
                  form.image
                    ? process.env.API_URL + form.image
                    : 'no-image.svg'
                "
              ></v-img>
              <v-img
                v-else
                :src="
                  form.image
                    ? process.env.API_URL + form.image
                    : 'no-image.svg'
                "
              ></v-img>-->
              <v-btn
                block
                outlined
                class="mb-3"
                :color="form.image_url == '' ? 'info' : 'success'"
                @click="dialog.image.model = true"
              >
                <v-icon left>{{
                  isEdit ? 'mdi-image-edit' : 'mdi-image-plus'
                }}</v-icon>
                {{
                  form.image_url == ''
                    ? 'Tambah gambar slider'
                    : 'Gambar telah terpilih'
                }}
              </v-btn>
              <small class="error--text">{{
                errors.image_url ? errors.image_url[0] : ''
              }}</small>
              <br />
              <v-text-field
                label="Nama Slider *"
                v-model="form.title"
                :error="errors.title ? true : false"
                :error-messages="errors.title ? errors.title[0] : ''"
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

    <!-- <dialog-upload
      :news="true"
      v-model="dialog.image.model"
      @upload="value => form.image_url = value"
      @close="dialog.image.model = false"
    ></dialog-upload> -->
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/slider/index.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import DialogUpload from '~/components/dialog-upload.vue'
import Reorder from '~/components/reorder.vue'
import Action from '~/components/action.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'
import destroy from '~/components/destroy.vue'

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Slider: List Slider'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'slider')])

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
        },
        foto: {
          item: ''
        },
        image: {
          model: false
        },
        news: {
          model: false
        }
      },
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      },
      env: process.env.API_URL,
      btn_new: true,
      form: {
        id: '',
        title: '',
        image_url: '',
        ishide: '',
        reorder: '',
        newStore: true
      },
      select: {
        tipe_link: [
          {
            value: 1,
            text: 'Internal'
          },
          {
            value: 2,
            text: 'External'
          },
          {
            value: 3,
            text: 'Halaman'
          },
          {
            value: 4,
            text: 'Berita'
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
      isLoading: false
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)
    this.fetchSlider()
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
      'setModelDialogItem'
    ]),

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
    },
    viewJenisLink(item) {
      try {
        return this.select.tipe_link.find(f => {
          return f.value == item.tipe_link
        }).text
      } catch (error) {
        return ' - '
      }
    },

    async fetchSlider() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('global/getDataId', {
          nama: 'slider',
          id: this.$route.params.id
        })
      })
    },
    // dialogUpload() {
    //   this.$store.commit('upload/setModel', true)
    // },
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
    openImage(item) {
      this.src = process.env.API_URL + item.image_url
      this.types = item.type
      return new Promise((resolve, reject) => {
        this.setModelDialogItem(true)
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
    'form.image_url'(newValue) {
      if (newValue) {
        this.store(this.form)
      }
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
      footerProps: state => state.footerProps
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
    Ishide,
    Reorder,
    DialogUpload,
    Action,
    refresh,
    create,
    exit,
    destroy
  }
}
</script>
