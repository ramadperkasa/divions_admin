<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb current_page="Broadcast"></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-page-layout-sidebar-right</v-icon>
          <v-toolbar-title>History Broadcast</v-toolbar-title>
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
          <create
            @click.native=";(dialog.form.model = true), (list.tableItems = [])"
          ></create>
          <!-- <create @click.native="dialog.image.model = true"></create> -->
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
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>

    <dialog-upload
      :news="true"
      v-model="dialog.image.model"
      :multiple="true"
      @upload="value => sendBroadcast(value)"
      @close="dialog.image.model = false"
    ></dialog-upload>

    <v-dialog
      v-model="dialog.form.model"
      scrollable
      persistent
      max-width="1000px"
    >
      <v-card>
        <v-card-header>Pilih Pelanggan</v-card-header>
        <v-card-text>
          <v-text-field
            v-model="list.search"
            append-icon="mdi-magnify"
            hide-details
            light
            placeholder="Cari data ..."
            class="form-search"
            @keyup.enter="searchSubscribe()"
          ></v-text-field>
          <v-data-table
            :headers="list.headers"
            :items="list.data.data"
            class="elevation-1"
            :server-items-length="list.total"
            :options.sync="list.option"
            :search="list.search"
            :loading="list.isLoading"
            multi-sort
            loading-text="Memuat data... Harap tunggu sebentar"
            no-data-text="Tidak ada data"
            no-results-text="Data tidak ditemukan"
            :items-per-page="10"
            :show-select="true"
            v-model="list.tableItems"
            :footer-props="footerProps"
          >
            <template v-slot:item.no="{ item }">
              {{ list.data.data.indexOf(item) + list.data.dataa.from }}
            </template>
          </v-data-table>
        </v-card-text>
        <!-- <h3>Pilih Pelanggan untuk broadcast berita</h3> -->

        <v-card-actions>
          <v-spacer></v-spacer>
          <button-cancel></button-cancel>
          <!-- <button-submit></button-submit> -->
          <v-btn
            outlined
            color="orange"
            @click=";(dialog.image.model = true), (pilihSemua = 1)"
          >
            Pilih Semua
          </v-btn>
          <v-btn
            outlined
            color="purple"
            v-if="list.tableItems.length > 0"
            @click=";(dialog.image.model = true), (pilihSemua = 0)"
          >
            Lanjut
          </v-btn>
          <!-- <button-submit-new v-if="btn_new"></button-submit-new> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/subscribe/broadcast.json'
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
      title: 'Broadcast'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'broadcast')])
    return
  },

  data() {
    return {
      list: {
        headers: [
          {
            text: '#',
            align: 'left',
            width: 15,
            sortable: false,
            value: 'no'
          },
          {
            text: 'Email',
            value: 'email',
            align: 'center'
          }
        ],

        data: {
          data: null,
          dataa: null
        },

        total: null,
        option: {},
        search: null,
        isLoading: false,
        tableItems: [],

        table: {
          model: true
        },

        footerProps: {
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-left-circle',
          lastIcon: 'mdi-arrow-right-circle',
          prevIcon: 'mdi-arrow-left-circle-outline',
          nextIcon: 'mdi-arrow-right-circle-outline',
          itemsPerPageOptions: [5, 10, 25, 50, 100]
        },

        dataBerita: [],

        search: ''
      },

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
      pilihSemua: null,
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
    this.fetchList()
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
      this.isLoading = false
    },
    // dialogUpload() {
    //   this.$store.commit('upload/setModel', true)
    // },

    fetchList() {
      const { page, itemsPerPage, sortBy, sortDesc } = this.list.option

      this.$axios
        .get('api/web/subscribe', {
          params: {
            itemsPerPage: this.list.option.itemsPerPage,
            sortBy: this.list.option.sortBy,
            sortDesc: this.list.option.sortDesc,
            page: this.list.option.page,
            search: this.list.search ? this.list.search : '',
            parent_id: this.list.option.parent_id
              ? this.list.option.parent_id
              : ''
          }
        })
        .then(response => {
          // this.table.items = response.data.agama
          this.list.data.data = response.data.data.data
          this.list.data.dataa = response.data.data
          this.list.total = response.data.data.total
        })
        .catch(() => {
          // this.alert.model = true
          // this.alert.text = 'Terjadi Kesalahan'
        })
        .finally(() => {
          // this.loading.table = false
        })
    },

    sendBroadcast(value) {
      this.$axios
        .post('api/web/broadcast/update-or-create', {
          broadcastNews: value,
          subscribe: this.list.tableItems,
          pilihSemua: this.pilihSemua
        })
        .then(response => {
          this.dialog.form.model = false
          this.$store.commit('setSnackbar', true)
          this.$store.commit('setText', 'Data Berhasil diBroadcast')
          this.fetch()
        })
        .catch(() => {})
        .finally(() => {})
    },

    searchSubscribe() {
      const itemPerPage = this.list.options
      this.list.option.page = 1

      this.list.option = { page: 1, itemPerPage }
      this.fetchList()
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

    'list.option': {
      handler() {
        this.fetchList()
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
