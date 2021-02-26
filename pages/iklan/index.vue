<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb page=" Iklan /" current_page="Daftar Iklan"></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-google-ads</v-icon>
          <v-toolbar-title>Daftar Iklan</v-toolbar-title>
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
            <template v-slot:item.foto_iklan="{ item }">
              <v-img
                :src="env + item.foto_iklan"
                :lazy-src="env + item.foto_iklan"
                @click="openImage(item)"
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
            <template
              v-slot:item.type="{ item }"
            >{{item.type == 0 ? '855 x 86,33 px' : '265,5 x 218,75 px'}}</template>
            <template
              v-slot:item.priority="{ item }"
            >{{item.priority == 0 ? 'Platinum' : item.priority == 1 ? 'Gold' : 'Bronze'}}</template>
            <template v-slot:item.ishide="{ item }">
              <ishide :item="item"></ishide>
            </template>
            <template v-slot:item.reorder="props">
              <reorder :props="props"></reorder>
            </template>
            <template v-slot:item.action="{ item }">
              <action :item="item" edit destroy></action>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog.form.model" scrollable persistent max-width="900px">
      <v-card>
        <dialog-header  :isEdit="isEdit" @close="closeDialog()"></dialog-header>
        <v-divider></v-divider>
        <v-card-text>
          <v-select
            label="Dimensi *"
            :items="type"
            v-model="form.type"
            :error="errors.type ? true : false"
            :error-messages="errors.type ? errors.type[0] : ''"
            outlined
            clearable
            dense
          ></v-select>
          <v-card
            outlined
            :disabled="form.type === '' || form.type === undefined ? true : false"
            flat
          >
            <v-card-text>
              <!-- <v-img v-if="form.foto_iklan == '' || form.foto_iklan == null" src="no-image.svg"></v-img> -->
              <v-row>
                <v-col cols="3"></v-col>
                <v-col cols="6" class="d-flex justify-center">
                  <v-img
                    width="45%"
                    v-if="form.foto_iklan"
                    :src="
                    form.foto_iklan < 400
                      ? env + form.foto_iklan
                      : form.foto_iklan
                  "
                  ></v-img>
                </v-col>
                <v-col cols="3"></v-col>
              </v-row>

              <v-btn @click.prevent="file" class="mb-3" outlined block text color="info">
                <v-icon left>mdi-plus</v-icon>Tambah gambar
              </v-btn>
              <span
                class="error--text"
                v-if="errors.foto_iklan"
              >{{errors.foto_iklan ? errors.foto_iklan[0] : ''}}</span>

              <input
                type="file"
                style="display: none;"
                accept="video/*, image/*"
                ref="fileInput"
                @change="fileSelected"
              />
              <v-text-field
                label="Nama Iklan *"
                v-model="form.nama"
                :error="errors.nama ? true : false"
                :error-messages="errors.nama ? errors.nama[0] : ''"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                label="URL *"
                v-model="form.url"
                :error="errors.url ? true : false"
                :error-messages="errors.url ? errors.url[0] : ''"
                outlined
                dense
              ></v-text-field>
              <v-select
                label="Prioritas *"
                :items="priority"
                v-model="form.priority"
                :error="errors.priority ? true : false"
                :error-messages="errors.priority ? errors.priority[0] : ''"
                outlined
                clearable
                dense
              ></v-select>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
       <dialog-footer  @close="dialog.form.model = false" :btn_new="btn_new"></dialog-footer>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.crop.model" v-if="form.type == 0" width="1200" persistent>
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
          <div style="overflow-x:scroll">
            <vue-croppie
              ref="croppieRef"
              :enableOrientation="true"
              :boundary="{  width:  855 ,
          height:  86.33  }"
              :viewport="{ width:  855 ,
          height:  86.33  , 'type':'square' }"
            ></vue-croppie>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="crop()">
            <v-icon left>mdi-crop</v-icon>Potong Foto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.crop.model" v-else width="1200" persistent>
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
          <div style="overflow-x:scroll">
            <vue-croppie
              ref="croppaRef"
              :enableOrientation="true"
              :boundary="{  width:  262.5,
          height:  218.75 }"
              :viewport="{ width:  262.5,
          height:  218.75, 'type':'square' }"
            ></vue-croppie>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="crop()">
            <v-icon left>mdi-crop</v-icon>Potong Foto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/iklan/index.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
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
      title: 'Iklan: Daftar Iklan'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'iklan')])

    return
  },

  data() {
    return {
      env: process.env.API_URL,
      dialog: {
        crop: {
          model: false
        },
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
      type: [
        {
          value: 0,
          text: '855 x 86,33 px'
        },
        {
          value: 1,
          text: '262.5 x 218,75 px'
        }
      ],
      priority: [
        {
          value: 0,
          text: 'Platinum'
        },
        {
          value: 1,
          text: 'Gold'
        },
        {
          value: 2,
          text: 'Bronze'
        }
      ],
      btn_new: true,
      form: {
        id: '',
        nama: '',
        url: '',
        foto_iklan: '',
        type: '',
        ishide: '',
        reorder: '',
        priority: '',
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
    fileSelected(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      this.dialog.crop.model = true
      setTimeout(() => {
        var reader = new FileReader()
        reader.onload = e => {
          if (this.form.type == 0) {
            this.$refs.croppieRef.bind({
              url: e.target.result
            })
          } else {
            this.$refs.croppaRef.bind({
              url: e.target.result
            })
          }
        }
        reader.readAsDataURL(files[0])
      }, 1000)
      const input = this.$refs.fileInput
      input.type = 'text'
      input.type = 'file'
    },
    openImage(item) {
      this.src = process.env.API_URL + item.foto_iklan
      this.types = item.type
      this.setModelDialogItem(true)
    },
    crop() {
      let options = {
        size: {
          width: this.form.type == 0 ? 855 : 262.5,
          height: this.form.type == 0 ? 86.33 : 218.75
        },
        format: 'png'
      }
      if (this.form.type == 0) {
        this.$refs.croppieRef.result(options, output => {
          this.form.foto_iklan = this.croppieImage = output
        })
      } else {
        this.$refs.croppaRef.result(options, output => {
          this.form.foto_iklan = this.croppieImage = output
        })
      }
      this.dialog.crop.model = false
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
    'form.type'() {
      if (!this.isEdit) {
        this.form.nama = ''
        this.form.url = ''
        this.form.priority = ''
        this.form.foto_iklan = ''
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
    Action,
    refresh,
    create,
    exit,
    destroy
  }
}
</script>
