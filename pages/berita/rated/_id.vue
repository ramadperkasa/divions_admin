<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb
            page=" Berita /"
            current_page="Rated"
          ></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-star</v-icon>
          <v-toolbar-title>Daftar Rated</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <search-data
              v-model="search"
              @search="f => (search = f)"
            ></search-data>
          </v-col>
          <refresh
            v-model="isLoading"
            @click="
              fetch()
              funcAvg()
            "
          ></refresh>
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
          <v-row>
            <v-col cols="9">
              <span> Berita : {{ judul }}</span>
            </v-col>
            <v-col cols="3">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    Overall Rating :

                    <v-icon
                      v-on="on"
                      color="amber"
                      v-for="index in intAvg"
                      :key="index"
                      >mdi-star</v-icon
                    >

                    <v-icon color="amber" v-if="!isInt()" v-on="on"
                      >mdi-star-half</v-icon
                    >
                  </span>
                </template>
                <span>Rating : {{ avg }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
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
            <template v-slot:item.nama="{ item }">
              {{ item.user ? item.user.name : '' }}
            </template>
            <template v-slot:item.email="{ item }">
              {{ item.user ? item.user.email : '' }}
            </template>
            <template v-slot:item.foto="{ item }">
              <table-image
                v-model="item.image"
                :type="0"
                :external="true"
              ></table-image>
            </template>
            <template v-slot:item.updated_at="{ item }">
              {{ item.updated_at ? item.updated_at.substring(0, 10) : '' }}
            </template>
            <template v-slot:item.action="{ item }">
              <action :item="item" hide :duplicate="false"></action>
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
            label="Nama Rated *"
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
import datatable from '@/datatable/berita/rated.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import Reorder from '~/components/reorder.vue'
import Action from '~/components/action.vue'
import destroy from '~/components/destroy.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Berita: Rated'
    }
  },

  async fetch({ store, route }) {
    await Promise.all([
      store.commit('setUrl', 'rated'),
      store.commit('setParentId', route.params.id)
    ])

    return
  },

  data() {
    return {
      avg: '',
      judul: '',
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
      isLoading: false,
      intAvg: 0
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)
    this.$axios
      .post('/api/web/berita/get-id', {
        id: this.$route.params.id
      })
      .then(response => {
        this.judul = response.data.data.judul
      })
      .catch(error => {})
      .finally(() => {})
    this.funcAvg()
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
    isInt() {
      return this.avg % 1 === 0
    },
    funcAvg() {
      this.$axios
        .post('/api/web/rated/sum-avg', {
          id: this.$route.params.id
        })
        .then(response => {
          this.avg = response.data.data
        })
        .catch(error => {})
        .finally(() => {})
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
    avg(newValue) {
      this.intAvg = Math.floor(newValue)
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
    create,
    exit,
    Reorder,
    destroy,
    refresh,
    Action
  }
}
</script>
