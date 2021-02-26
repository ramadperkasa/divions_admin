<template>
  <div>
    <v-card-text>
      <div class="mb-4">
        <span class="title">Form Vacancy -</span>
        <span class="subtitle">Informasi Lainnya</span>
      </div>
      <v-row>
        <v-col cols="3">
          <select-image v-model="image"></select-image>
          <v-btn block text color="info" @click="dialog = true">
            <v-icon left>
              {{ $route.params.id ? 'mdi-image-edit' : 'mdi-image-plus' }}
            </v-icon>
            {{ $route.params.id ? 'Edit' : 'Tambah' }} gambar
          </v-btn>
          <small class="error--text">{{
            errors.image ? errors.image[0] : ''
          }}</small>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col md="11">
              <v-select
                label="Kategori Vacancy *"
                v-model="kategori_vacancy"
                :items="selectKategoriVacancy"
                :error="errors.kategori_vacancy ? true : false"
                :error-messages="
                  errors.kategori_vacancy ? errors.kategori_vacancy[0] : ''
                "
                :loading="isLoadingKategoriVacancy"
                :disabled="isLoadingKategoriVacancy"
                clearable
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="1">
              <v-row>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="fetchKategoriVacancy()">
                      <v-icon v-if="isLoadingKategoriVacancy"
                        >mdi-spin mdi-refresh</v-icon
                      >
                      <v-icon v-else>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>Refresh</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="setDialogKategoriVacancy()">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Tambah</span>
                </v-tooltip>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="11">
              <v-select
                label="Sub Kategori Vacancy *"
                v-model="kategori_sub_vacancy_id"
                :items="selectSubKategoriVacancy"
                :error="errors.kategori_sub_vacancy_id ? true : false"
                :error-messages="
                  errors.kategori_sub_vacancy_id
                    ? errors.kategori_sub_vacancy_id[0]
                    : ''
                "
                :disabled="!kategori_vacancy"
                clearable
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="1">
              <v-row>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="fetchSubKategoriVacancy()">
                      <v-icon v-if="isLoadingKategoriVacancy"
                        >mdi-spin mdi-refresh</v-icon
                      >
                      <v-icon v-else>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>Refresh</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      icon
                      @click="setDialogSubKategoriVacancy()"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Tambah</span>
                </v-tooltip>
              </v-row>
            </v-col>
          </v-row>
          <v-select
          v-if="$store.state.app.pilihBrand"
            label="Pilih Brand"
            v-model="brand_id"
            hint="Untuk menampilkan kontak, jika tidak diisi maka akan mengambil kontak PT DSN"
            :items="selectBrand"
            :error="errors.brand_id ? true : false"
            :error-messages="errors.brand_id ? errors.brand_id[0] : ''"
            :loading="isLoadingBrand"
            :disabled="isLoadingBrand"
            clearable
            outlined
            dense
          ></v-select>
          <v-menu
            v-model="datePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="tgl_expired"
                label="Tanggal Kedaluarsa Vacancy *"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="tgl_expired"
              @input="datePicker = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
    <upload
      :media="true"
      v-model="dialog"
      :defaultImage="image"
      @upload="value => (image = value)"
      :youtube="true"
      @close="dialog = false"
    ></upload>
    <dialog-sub-kategori-vacancy
      @update="fetchSubKategoriVacancy()"
    ></dialog-sub-kategori-vacancy>
  </div>
</template>

<script>
import selectImage from '~/components/select-image.vue'
import DialogSubKategoriVacancy from '~/components/dialog-sub-kategori-vacancy.vue'
import upload from '~/components/dialog-upload.vue'
import Texteditor from '~/components/texteditor.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dialog: false,
      datePicker: false,
      support_images: [
        'webm',
        'mpg',
        'mp2',
        'mpeg',
        'mpe',
        'mpv',
        'mp4',
        'm4p',
        'm4v',
        'avi',
        'wmv',
        'mov',
        'qt',
        'flv',
        'swf',
        'avchd'
      ],
      isLoadingKategoriVacancy: false,
      isLoadingSubKategoriVacancy: false,
      form: {
        id: '',
        kategori_sub_vacancy_id: '',
        tgl_publikasi: '',
        cover_image: '',
        judul: '',
        sinopsis: '',
        isi_vacancy: '',
        judul_en: '',
        sinopsis_en: '',
        isi_vacancy_en: '',
        komentar: '',
        komentar_auto: '',
        rated: '',
        meta_tag: '',
        total_view: '',
        last_view: '',
        ishide: '',
        reorder: '',
        slug: ''
      },
      isLoadingKategoriVacancy: false,
      isLoadingBrand: false,
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      }
    }
  },
  mounted() {
    this.fetchKategoriVacancy()
    this.fetchBrand()
  },
  watch: {
    kategori_vacancy(val) {
      this.kategori_sub_vacancy_id = ''
      if (val) {
        this.fetchSubKategoriVacancy(val)
        if (this.edit) {
          this.kategori_sub_vacancy_id = this.edit

          this.edit = ''
        }
      }
    }
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      selectBrand: state => state.global.items.brand,
      selectKategoriVacancy: state => state.global.items.kategoriVacancy,
      selectSubKategoriVacancy: state => state.global.items.subKategoriVacancy
    }),

    kategori_sub_vacancy_id: {
      get() {
        return this.$store.state.vacancy.form.kategori_sub_vacancy_id
      },
      set(value) {
        this.$store.commit('vacancy/setKategoriSubVacancy', value)
      }
    },
    edit: {
      get() {
        return this.$store.state.vacancy.form.edit
      },
      set(value) {
        this.$store.commit('vacancy/setEdit', value)
      }
    },
    kategori_vacancy: {
      get() {
        return this.$store.state.vacancy.form.kategori_vacancy
      },
      set(value) {
        this.$store.commit('vacancy/setKategoriVacancy', value)
      }
    },
    brand_id: {
      get() {
        return this.$store.state.vacancy.form.brand
      },
      set(value) {
        this.$store.commit('vacancy/setBrandId', value)
      }
    },
    tgl_expired: {
      get() {
        return this.$store.state.vacancy.form.tgl_expired
      },
      set(value) {
        this.$store.commit('vacancy/setTglExpired', value)
      }
    },
    meta_tag: {
      get() {
        return this.$store.state.vacancy.form.meta_tag
      },
      set(value) {
        this.$store.commit('vacancy/setMetaTag', value)
      }
    },
    image: {
      get() {
        return this.$store.state.vacancy.form.cover_image
      },
      set(value) {
        this.$store.commit('vacancy/setCoverImage', value)
      }
    }
  },
  methods: {
    setDialogKategoriVacancy() {
      this.$store.commit('kategoriVacancy/setModel', true)
    },
    setDialogSubKategoriVacancy() {
      this.$store.commit('subKategoriVacancy/setModel', true)
    },
    fetchSubKategoriVacancy(val) {
      this.isLoadingSubKategoriVacancy = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getDataId', {
          nama: 'vacancy-sub-kategori',
          id: this.kategori_vacancy
        })

        result.finally(() => {
          this.isLoadingSubKategoriVacancy = false
        })
      })
      this.isLoadingSubKategoriVacancy = false
    },
    fetchKategoriVacancy() {
      this.isLoadingKategoriVacancy = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'vacancy-kategori'
        })

        result.finally(() => {
          this.isLoadingKategoriVacancy = false
        })
      })
      this.isLoadingKategoriVacancy = false
    },
    fetchBrand() {
      this.isLoadingBrand = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'brand'
        })

        result.finally(() => {
          this.isLoadingBrand = false
        })
      })
      this.isLoadingBrand = false
    },
    setDialogSubKategoriVacancy() {
      this.$store.commit('subKategoriVacancy/setModel', true)
    }
  },
  components: {
    DialogSubKategoriVacancy,
    Texteditor,
    upload,
    selectImage
  }
}
</script>

<style lang="stylus" scoped></style>
