<template>
  <v-dialog v-model="model" scrollable persistent max-width="75%">
    <v-card>
      <dialog-header :isEdit="false" @close="model = false"></dialog-header>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col md="12" xs="12">
            <v-text-field
              label="Nama Menu *"
              v-model="form.title"
              :error="errors.title ? true : false"
              :error-messages="errors.title ? errors.title[0] : ''"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col md="12" xs="12" v-if="Array.isArray($store.state.app.lang)">
            <v-text-field
              label="Nama Menu en"
              v-model="form.title_en"
              :error="errors.title_en ? true : false"
              :error-messages="errors.title_en ? errors.title_en[0] : ''"
              :hint="$store.state.app.hint"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col
            :md="
              form.has_child == 2 && form.tipe_link == 0
                ? '6'
                : form.tipe_link != 0
                ? '4'
                : '12'
            "
          >
            <v-select
              label="Mempunyai Sub Menu *"
              v-model="form.has_child"
              :items="select.subMenu"
              :error="errors.has_child ? true : false"
              :error-messages="errors.has_child ? errors.has_child[0] : ''"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col
            :md="
              form.has_child == 2 && form.tipe_link == 0
                ? '6'
                : form.tipe_link != 0
                ? '4'
                : '12'
            "
            v-if="form.has_child == 2"
          >
            <v-select
              label="Jenis Link *"
              v-model="form.tipe_link"
              :items="select.link"
              :error="errors.tipe_link ? true : false"
              :error-messages="errors.tipe_link ? errors.tipe_link[0] : ''"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col md="4" v-if="form.has_child == 2 && form.tipe_link == 1">
            <v-select
              label="Pilih Link *"
              v-model="form.url"
              :items="select.internal"
              :error="errors.url ? true : false"
              :error-messages="errors.url ? errors.url[0] : ''"
              outlined
              dense
            />
          </v-col>
          <v-col md="4" v-if="form.has_child == 2 && form.tipe_link == 2">
            <v-text-field
              label="Link *"
              v-model="form.url"
              :error="errors.url ? true : false"
              :error-messages="errors.url ? errors.url[0] : ''"
              outlined
              dense
            />
          </v-col>
          <v-col md="4" v-if="form.has_child == 2 && form.tipe_link == 3">
            <v-row>
              <v-col cols="9" style="padding:0px">
                <v-select
                  label="Halaman *"
                  v-model="form.page_id"
                  :items="selectPage"
                  :error="errors.page_id ? true : false"
                  :error-messages="errors.page_id ? errors.page_id[0] : ''"
                  outlined
                  dense
                />
              </v-col>
              <v-col style="padding:0px" cols="3">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="fetchPage()">
                      <v-icon v-if="isLoadingKategoriBerita"
                        >mdi-spin mdi-refresh</v-icon
                      >
                      <v-icon v-else>mdi-refresh</v-icon></v-btn
                    >
                  </template>
                  <span>Refresh</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="setDialogPageModel()"
                      ><v-icon>mdi-plus</v-icon></v-btn
                    >
                  </template>
                  <span>Tambah</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
          <v-col md="12">
            <v-select
              label="Aksi Link *"
              v-model="form.target"
              :items="select.target"
              :error="errors.target ? true : false"
              :error-messages="errors.target ? errors.target[0] : ''"
              outlined
              dense
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="model = false"
          ><v-icon>mdi-arrow-left</v-icon>Kembali</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submit"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan</v-btn
        >
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submitNew"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan Baru
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        id: '',
        title: '',
        title_en: '',
        url: '',
        target: '_blank',
        ishide: 0,
        reorder: '',
        page_id: '',
        has_child: 1,
        tipe_link: 0,
        isEdit: false,
        newStore: true
      },
      select: {
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
            text: 'Internal'
          },
          {
            value: 2,
            text: 'External'
          },
          {
            value: 3,
            text: 'Halaman'
          }
        ],
        internal: [
          {
            value: '/home',
            text: '/home'
          },
          {
            value: '/news',
            text: '/news'
          }
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
      }
    }
  },
  watch: {
    model(newValue) {
      if (newValue == true) {
        this.$store.commit('menu/setClearForm')
        this.form.nama_menu = ''
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('menu/setIsErrors', '')
      }
    }
  },
  mounted() {
    this.fetchPage()
  },
  methods: {
    ...mapActions('menu', ['storeData']),
    ...mapMutations('menu', ['setLoading']),
    submit() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
          this.model = false
        })
      })
    },
    setDialogPageModel() {
      this.$store.commit('page/setModel', true)
    },
    fetchPage() {
      this.isLoadingPage = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'halaman'
        })

        result.finally(() => {
          this.isLoadingPage = false
        })
      })
      this.isLoadingPage = false
    },
    submitNew() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
        })
      })
    }
  },
  computed: {
    ...mapState('menu', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    ...mapState({
      selectPage: state => state.global.items.page
    }),
    model: {
      get() {
        return this.$store.state.menu.model
      },
      set(model) {
        this.$store.commit('menu/setModel', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.menu.loading
      },
      set(loading) {
        this.$store.commit('menu/setloading', loading)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
