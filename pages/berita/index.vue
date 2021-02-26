<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb current_page="Berita"></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-newspaper</v-icon>
          <v-toolbar-title>Daftar Berita</v-toolbar-title>
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
            @click.native="
              $router.push('/berita/form')
              $store.commit('berita/setStep', 1)
            "
          ></create>
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
            <template v-slot:item.no="{ item }">
              {{ lists.data.indexOf(item) + lists.from }}
            </template>
            <template v-slot:item.judul="{ item }">
              <span class="text-elps-1">{{ item.judul }}</span>
            </template>
            <template v-slot:item.rating="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    @click="$router.push('/berita/rated/' + item.id)"
                    v-on="on"
                    style="cursor:pointer"
                    color="amber"
                    >mdi-star</v-icon
                  >
                </template>
                <span>Lihat Detail Rating Berita ini</span>
              </v-tooltip>
            </template>
            <template v-slot:item.id_kategori="{ item }">
              <span class="text-elps-1">
                {{ item.kategori ? item.kategori.nama : '' }}
              </span>
            </template>
            <template v-slot:item.posted_by="{ item }">
              <span class="text-elps-1">
                {{ item.admin ? item.admin.nama_singkat : '' }}
              </span>
            </template>
            <template v-slot:item.cover_image="{ item }">
              <table-image
                v-model="item.cover_image"
                :type="item.type_img"
              ></table-image>
            </template>
            <template v-slot:item.status="{ item }">
              <span v-if="item.status == 0" class="error--text">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="isLoadingStatus"
                      :loading="isLoadingStatus"
                      @click="publish(item)"
                      v-on="on"
                      icon
                    >
                      <v-icon color="error">mdi-web-clock</v-icon>
                    </v-btn>
                  </template>

                  <span> Belum di Publish</span>
                </v-tooltip>
              </span>
              <span v-else class="success--text">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="isLoadingStatus"
                      :loading="isLoadingStatus"
                      @click="publish(item)"
                      v-on="on"
                      icon
                    >
                      <v-icon color="success">mdi-web</v-icon>
                    </v-btn>
                  </template>

                  <span>Sudah Publish</span>
                </v-tooltip>
              </span>
            </template>
            <template v-slot:item.published_at="{ item }">
              {{
                item.published_at ? item.published_at.substring(0, 10) : ' - '
              }}
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
                view
                hide
                :edit="{ status: true, link: '/berita/form/' + item.id }"
                destroy
                :postSocmed="$store.app.postToSocmed ? true : false"
                :child="['slider_count', 'komentar_count', 'rated_count']"
              ></action>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <post-to-socmed
        v-model="dialogPost"
        :form="itemPost"
        :slugs="itemPost.slug"
        @close="dialogPost = false"
      ></post-to-socmed>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import postToSocmed from '~/components/postToSocmed.vue'
import destroy from '~/components/destroy.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'
import datatable from '@/datatable/berita/index.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import Reorder from '~/components/reorder.vue'
import Action from '~/components/action.vue'

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Berita: Berita'
    }
  },

  async fetch({ store, route }) {
    await Promise.all([store.commit('setUrl', 'berita')])

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
      process: {
        env: {
          API_URL: process.env.API_URL
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
      isLoadingStatus: false,
      dialogPost: false,
      itemPost: []
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
    },
    store(data) {
      this.storeData(data)
    },
    publish(item) {
      this.isLoadingStatus = true
      this.$axios
        .post('/api/web/berita/publish', {
          id: item.id
        })
        .then(response => {
          this.$store.commit('setSnackbar', true)
          if (response.status) {
            if (response.data.statusPublish != 0) {
              this.$store.commit('setText', 'Data Berhasil Dijadikan Draft!')
            } else {
              this.$store.commit('setText', 'Data Berhasil Di Publish!')
              if (item.ishide == 0) {
                this.dialogPost = false
                this.itemPost = item
              }
            }
            this.fetch()
          } else {
            this.$store.commit('setText', response.status)
          }
        })
        .catch(error => {
          this.$store.commit('setSnackbar', true)
          this.$store.commit('setText', error.response.status)
        })
        .finally(() => {
          this.isLoadingStatus = false
        })
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
      this.src = process.env.API_URL + item.cover_image
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
    create,
    exit,
    Reorder,
    destroy,
    refresh,
    Action,
    postToSocmed
  }
}
</script>
