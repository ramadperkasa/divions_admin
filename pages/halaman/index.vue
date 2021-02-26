<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb current_page="Halaman"></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-page-next-outline</v-icon>
          <v-toolbar-title>Daftar Halaman</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <search-data v-model="search" @search=" f => search = f"></search-data>
          </v-col>
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
              {{
              lists.data.indexOf(item) + lists.from
              }}
            </template>
            <template v-slot:item.image="{ item }">
              <v-img
                :src="process.env.API_URL + item.image"
                :lazy-src="process.env.API_URL + item.image"
                @click="
                  dialog.foto.item = item
                  setModelDialogItem(true)
                "
                aspect-ratio="1"
                height="40"
                width="50"
                class="grey lighten-2 ma-1 hover--image"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </template>
            <template v-slot:item.ishide="{ item }">
              <ishide :item="item"></ishide>
            </template>
            <template v-slot:item.reorder="props">
              <reorder :props="props"></reorder>
            </template>
            <template v-slot:item.action="{ item }">
              <action :item="item" edit destroy viewContent="konten" :child="['menu_count','menu_sub_count']"></action>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog.form.model" fullscreen persistent scrollable>
      <v-card>
        <dialog-header  :isEdit="isEdit" @close="closeDialog()"></dialog-header>
        
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Judul *"
                v-model="form.judul"
                :error="errors.judul ? true : false"
                :error-messages="errors.judul ? errors.judul[0] : ''"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                label="Meta Tag"
                v-model="form.meta_tag"
                :error="errors.meta_tag ? true : false"
                :error-messages="errors.meta_tag ? errors.meta_tag[0] : ''"
                outlined
                dense
              ></v-text-field>
              <texteditor v-model="form.konten"></texteditor>
              <small class="error--text">
                {{
                errors.konten ? errors.konten[0] : ''
                }}
              </small>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
       <dialog-footer  @close="dialog.form.model = false" :btn_new="btn_new" :child="['menu_count','menu_sub_count']"></dialog-footer>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/halaman/index.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import Reorder from '~/components/reorder.vue'
import Texteditor from '~/components/texteditor.vue'
import Action from '~/components/action.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'
import destroy from '~/components/destroy.vue'

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Halaman'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'halaman')])

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
        }
      },
      btn_new: true,
      form: {
        id: '',
        judul: '',
        konten: '',
        meta_tag: '',
        total_view: '',
        last_view: '',
        slug: '',
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
    dialogUpload() {
      this.$store.commit('upload/setModel', true)
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
    Texteditor,
    Action,
    refresh,
    create,
    exit,
    destroy
  }
}
</script>
