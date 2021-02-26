<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb page=" Kontak" current_page></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-contacts</v-icon>
          <v-toolbar-title>Daftar Kontak</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <search-data
              v-model="search"
              @search="f => (search = f)"
            ></search-data>
          </v-col>
          <v-divider class="ml-1 mr-1" inset vertical></v-divider>
          <refresh v-model="isLoading" @click="fetch()"></refresh>
          <destroy
            v-model="table.model"
            :item="tableItems"
            @click.native="table.model = !table.model"
          ></destroy>
          <create @click.native="addItem()"></create>
          <v-divider class="ml-1 mr-1" inset vertical></v-divider>
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
            <template v-slot:item.jenis="{ item }">{{
              item.jenis == 0
                ? 'Facebook'
                : item.jenis == 1
                ? 'Twitter'
                : item.jenis == 2
                ? 'Instagram'
                : item.jenis == 3
                ? 'Youtube'
                : item.jenis == 10
                ? 'Linkedin'
                : item.jenis == 4
                ? 'Telepon'
                : item.jenis == 5
                ? 'Handphone'
                : item.jenis == 6
                ? 'Lokasi'
                : item.jenis == 7
                ? 'Email'
                : item.jenis == 8
                ? 'WhatsApp'
                : item.jenis == 9
                ? 'Lainnya'
                : ''
            }}</template>

            <template v-slot:item.no="{ item }">{{
              lists.data.indexOf(item) + lists.from
            }}</template>
            <template v-slot:item.url="{ item }">
              <span class="text-elps-1">{{ item.url }}</span></template
            >
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
            label="Nama"
            v-model="form.nama"
            :error="errors.nama ? true : false"
            :error-messages="errors.nama ? errors.nama[0] : ''"
            outlined
            hint="Hanya dipakai untuk penamaan / judul tabel saja"
            dense
          ></v-text-field>
          <v-text-field
            label="Nama Kontak*"
            hint="Username atau Nickname kontak"
            v-model="form.isi"
            :error="errors.isi ? true : false"
            :error-messages="errors.isi ? errors.isi[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-select
            label="Jenis Kontak"
            :items="select"
            v-model="form.jenis"
            :error="errors.jenis ? true : false"
            :error-messages="errors.jenis ? errors.jenis[0] : ''"
            outlined
            clearable
            dense
          ></v-select>
          <v-text-field
            v-if="
              form.jenis != 6 &&
                form.jenis != 8 &&
                form.jenis != 4 &&
                form.jenis != 7 &&
                form.jenis != 5
            "
            label="URL *"
            :disabled="!form.jenis"
            v-model="form.url"
            :error="errors.url ? true : false"
            :error-messages="errors.url ? errors.url[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-row v-else-if="form.jenis == 8">
            <v-col cols="6">
              <v-text-field
                label="Nomor Whatsapp *"
                dense
                type="number"
                prefix="+62"
                v-model="form.kolom1"
                :error="errors.kolom1 ? true : false"
                :error-messages="errors.kolom1 ? errors.kolom1[0] : ''"
                outlined
              ></v-text-field
            ></v-col>
            <v-col cols="6">
              <v-text-field
                label="Text "
                dense
                v-model="form.kolom2"
                :error="errors.kolom2 ? true : false"
                :error-messages="errors.kolom2 ? errors.kolom2[0] : ''"
                outlined
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row v-else-if="form.jenis == 4">
            <v-col cols="12">
              <v-text-field
                label="No Telp *"
                dense
                type="number"
                prefix="+62"
                v-model="form.kolom1"
                :error="errors.kolom1 ? true : false"
                :error-messages="errors.kolom1 ? errors.kolom1[0] : ''"
                outlined
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row v-else-if="form.jenis == 7">
            <v-col cols="12">
              <v-text-field
                label="Email *"
                dense
                type="email"
                v-model="form.kolom1"
                :error="errors.kolom1 ? true : false"
                :error-messages="errors.kolom1 ? errors.kolom1[0] : ''"
                outlined
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row v-else-if="form.jenis == 5">
            <v-col cols="12">
              <v-text-field
                label="No HP *"
                dense
                type="number"
                prefix="+62"
                v-model="form.kolom1"
                :error="errors.kolom1 ? true : false"
                :error-messages="errors.kolom1 ? errors.kolom1[0] : ''"
                outlined
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="4">
              <v-text-field
                label="Latitude *"
                dense
                v-model="form.lat"
                :error="errors.lat ? true : false"
                :error-messages="errors.lat ? errors.lat[0] : ''"
                outlined
              ></v-text-field
            ></v-col>
            <v-col cols="4">
              <v-text-field
                label="Longitude *"
                v-model="form.long"
                :error="errors.long ? true : false"
                :error-messages="errors.long ? errors.long[0] : ''"
                outlined
                dense
              ></v-text-field
            ></v-col>
            <v-col cols="4">
              <v-btn color="primary" @click="dialogMaps()"
                ><v-icon>mdi-google-maps</v-icon> Lihat di Maps</v-btn
              >
            </v-col>
            <small
              class="ml-5 primary--text"
              @click="getKoor()"
              style="cursor:pointer"
              >Dapatkan Latitude & Longitude Disini</small
            >
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <dialog-footer
          @close="dialog.form.model = false"
          :btn_new="btn_new"
        ></dialog-footer>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.maps.model">
      <v-card>
        <v-card-title primary-title>
          Lihat Maps
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog.maps.model = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div style="width: 100%">
            <iframe
              width="100%"
              height="600"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              :src="
                `https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=` +
                  form.lat +
                  `,` +
                  form.long +
                  `+(Dipointer)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`
              "
            ></iframe>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/kontak/index.json'
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
      title: 'Kontak'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'kontak')])

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
        maps: {
          model: false
        }
      },
      btn_new: true,
      form: {
        id: '',
        nama: '',
        isi: '',
        url: '',
        lat: '',
        long: '',
        kolom1: '',
        kolom2: '',
        jenis: '',
        ishide: '',
        reorder: '',
        newStore: true
      },
      isEdit: false,
      table: {
        model: false,
        items: []
      },
      select: [
        {
          text: 'Facebook',
          value: '0'
        },
        {
          text: 'Twitter',
          value: '1'
        },
        {
          text: 'Instagram',
          value: '2'
        },
        {
          text: 'Youtube',
          value: '3'
        },
        {
          text: 'Linkedin',
          value: '10'
        },
        {
          text: 'Telephone',
          value: '4'
        },
        {
          text: 'Handphone',
          value: '5'
        },
        {
          text: 'Location',
          value: '6'
        },
        {
          text: 'Email',
          value: '7'
        },
        {
          text: 'Whatsapp',
          value: '8'
        },
        {
          text: 'Others',
          value: '9'
        }
      ],
      options: {},
      search: '',
      isLoading: false,
      isLoadingKategoriKontak: false
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)
  },
  methods: {
    fetchKontakKategori() {
      this.isLoadingFolder = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'kategori-kontak'
        })

        result.finally(() => {
          this.isLoadingKategoriKontak = false
        })
      })
      this.isLoadingKategoriKontak = false
    },

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
    getKoor() {
      window.open('https://www.latlong.net/', '_blank')
    },
    dialogMaps() {
      if (!this.form.lat && !this.form.long) {
        confirm('Silahkan Isi Latitude & Longitude untuk Melihat')
      } else {
        this.dialog.maps.model = true
      }
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
    'form.lat'() {
      this.form.url =
        `https://www.google.com/maps/@` +
        this.form.lat +
        `,` +
        this.form.long +
        `,15z`
    },
    'form.long'() {
      this.form.url =
        `https://www.google.com/maps/@` +
        this.form.lat +
        `,` +
        this.form.long +
        `,15z`
    },
    'form.kolom1'() {
      if (
        this.form.jenis == 8 ||
        this.form.jenis == 5 ||
        this.form.jenis == 4
      ) {
        if (this.form.kolom1.charAt(0) == '0') {
          this.form.kolom1 = this.form.kolom1.substring(1)
        } else if (this.form.kolom1.substring(0, 3) == '+62') {
          this.form.kolom1 = this.form.kolom1.substring(3)
        } else if (this.form.kolom1.substring(0, 2) == '62') {
          this.form.kolom1 = this.form.kolom1.substring(2)
        }
        if (this.form.jenis == 8) {
          this.form.url =
            `https://api.whatsapp.com/send?phone=+62` +
            this.form.kolom1 +
            `&text=` +
            this.form.kolom2
        }
      }
      if (this.form.jenis == 5 || this.form.jenis == 4) {
        this.form.url = `tel:+62` + this.form.kolom1
      }
      if (this.form.jenis == 7) {
        this.form.url = `mailto:` + this.form.kolom1
      }
    },
    'form.kolom2'() {
      if (this.form.jenis == 8) {
        this.form.url =
          `https://api.whatsapp.com/send?phone=+62` +
          this.form.kolom1 +
          `&text=` +
          this.form.kolom2
      }
    },
    'form.jenis'() {
      if (!this.isEdit) {
        this.form.url = ''
        this.form.lat = ''
        this.form.long = ''
        this.form.kolom1 = ''
        this.form.koloom2 = ''
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
      selectKategoriKontak: state => state.global.items.kategoriKontak
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
    Action,
    refresh,
    create,
    exit,
    destroy
  }
}
</script>
