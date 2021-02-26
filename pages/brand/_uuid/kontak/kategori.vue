<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb
            page=" Kontak /"
            current_page="Kategori Kontak"
          ></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-newspaper</v-icon>
          <v-toolbar-title>Daftar Kategori Kontak</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <search-data
              v-model="search"
              @search="f => (search = f)"
            ></search-data>
          </v-col>
          <v-divider class="ml-1 mr-1" inset vertical></v-divider>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="fetch()">
                <v-icon v-if="isLoading">mdi-spin mdi-refresh</v-icon>
                <v-icon v-else>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
          <v-divider vertical inset></v-divider>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="table.model = !table.model">
                <v-icon>mdi-format-list-checks</v-icon>
              </v-btn>
            </template>
            <span>Seleksi Data</span>
          </v-tooltip>
          <v-tooltip bottom v-if="table.model">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                :disabled="tableItems.length == 0"
                @click="setDialogDestroys({ item: tableItems, status: true })"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
            <span>Hapus Data yang Terseleksi</span>
          </v-tooltip>
          <v-divider vertical inset></v-divider>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="addItem()">
                <v-icon>mdi-tab-plus</v-icon>
              </v-btn>
            </template>
            <span>Tambah Data</span>
          </v-tooltip>
          <v-divider class="ml-1 mr-1" inset vertical></v-divider>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="$router.push('/')">
                <v-icon color="primary">mdi-close-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>Keluar</span>
          </v-tooltip>
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
            <template v-slot:item.ishide="{ item }">
              <ishide :item="item"></ishide>
            </template>
            <template v-slot:item.reorder="props">
              <reorder :props="props"></reorder>
            </template>
            <template v-slot:item.action="{ item }">
              <action hide :item="item" edit destroy></action>
            </template>
          </v-data-table>
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
          <v-text-field
            label="Nama Kategori Kontak *"
            v-model="form.nama"
            :error="errors.nama ? true : false"
            :error-messages="errors.nama ? errors.nama[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-textarea
            label="Keterangan"
            v-model="form.keterangan"
            :error="errors.keterangan ? true : false"
            :error-messages="errors.keterangan ? errors.keterangan[0] : ''"
            outlined
            dense
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <dialog-footer
          @close="dialog.form.model = false"
          :btn_new="btn_new"
        ></dialog-footer>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/kontak/kategori.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import Reorder from '~/components/reorder.vue'
import Action from '~/components/action.vue'

export default {
  middleware: ['authenticated', 'brand'],
  head() {
    return {
      title: 'Kontak: Kategori Kontak'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'kategori-kontak')])

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
        _id: '',
        id: '',
        nama: '',
        keterangan: '',
        nama_en: '',
        keterangan_en: '',
        ishide: '',
        reorder: '',
        newStore: true
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
        const { page, itemsPerPage, sortBy, sortDesc } = this.options
        this.setOptions({ page, itemsPerPage, sortBy, sortDesc })

        var result = this.getData(this.search)

        result.finally(() => {
          this.isLoading = false
        })
      })
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
    Action
  }
}
</script>
