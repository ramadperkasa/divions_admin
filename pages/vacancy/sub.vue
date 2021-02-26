<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb
            page=" Vacancy /"
            current_page="Sub Kategori"
          ></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-account-details-outline</v-icon>
          <v-toolbar-title>Daftar Sub Kategori Vacancy</v-toolbar-title>
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
            <template v-slot:item.parent_id="{ item }">
              {{ item.kategori_vacancy ? item.kategori_vacancy.nama : '' }}
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
                edit
                hide
                destroy
                :child="['vacancy_count']"
              ></action>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="dialog.form.model"
      scrollable
      persistent
      max-width="1000px"
    >
      <v-card>
        <dialog-header :isEdit="isEdit" @close="closeDialog()"></dialog-header>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="10">
              <v-select
                label="Pilih Kategori Vacancy *"
                :items="selectKategoriVacancy"
                :loading="isLoadingKategori"
                :disabled="isLoadingKategori"
                v-model="form.parent_id"
                :error="errors.parent_id ? true : false"
                :error-messages="errors.parent_id ? errors.parent_id[0] : ''"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-row>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="fetchKategori()">
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
                    <v-btn v-on="on" icon @click="setDialogKategoriModel()">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Tambah</span>
                </v-tooltip>
              </v-row>
            </v-col>
          </v-row>
          <v-text-field
            label="Nama Sub Kategori Vacancy *"
            v-model="form.nama"
            :error="errors.nama ? true : false"
            :error-messages="errors.nama ? errors.nama[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-if="Array.isArray($store.state.app.lang)"
            :hint="$store.state.app.hint"
            label="Nama Sub Kategori Vacancy en"
            v-model="form.nama_en"
            :error="errors.nama_en ? true : false"
            :error-messages="errors.nama_en ? errors.nama_en[0] : ''"
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
          <v-textarea
            v-if="Array.isArray($store.state.app.lang)"
            :hint="$store.state.app.hint"
            label="Keterangan en"
            v-model="form.keterangan_en"
            :error="errors.keterangan_en ? true : false"
            :error-messages="
              errors.keterangan_en ? errors.keterangan_en[0] : ''
            "
            outlined
            dense
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <dialog-footer
          @close="dialog.form.model = false"
          :btn_new="btn_new"
          :child="['vacancy_count']"
        ></dialog-footer>
      </v-card>
    </v-dialog>
    <dialog-kategori-vacancy
      @update="fetchKategori()"
    ></dialog-kategori-vacancy>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/vacancy/sub.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import DialogKategoriVacancy from '~/components/dialog-kategori-vacancy.vue'
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
      title: 'Vacancy: Sub Kategori Vacancy'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'vacancy-sub-kategori')])

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
        nama: '',
        keterangan: '',
        parent_id: '',
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
      isLoadingKategori: false
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)
    this.fetchKategori()
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
    setDialogKategoriModel() {
      this.$store.commit('kategoriVacancy/setModel', true)
    },
    fetchKategori() {
      this.isLoadingKategori = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'vacancy-kategori'
        })

        result.finally(() => {
          this.isLoadingKategori = false
        })
      })
      this.isLoadingKategori = false
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
      selectKategoriVacancy: state => state.global.items.kategoriVacancy
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
    Action,
    DialogKategoriVacancy
  }
}
</script>
