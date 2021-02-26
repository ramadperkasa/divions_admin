<template>
  <div>
    <v-card-text>
      <div class="mb-4">
        <span class="title">Form Berita -</span>
        <span class="subtitle">Informasi Lainnya</span>
      </div>
      <v-row>
        <v-col cols="3">
          <select-image
            v-model="image"
            :isEdit="$route.params.id"
          ></select-image>
          <v-btn block text color="info" @click="dialog = true">
            <v-icon left>{{
              $route.params.id ? 'mdi-image-edit' : 'mdi-image-plus'
            }}</v-icon>
            {{ $route.params.id ? 'Edit' : 'Tambah' }} Cover Berita
          </v-btn>
          <small class="error--text">
            {{ errors.image ? errors.image[0] : '' }}
          </small>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col md="11">
              <v-select
                label="Kategori Berita *"
                v-model="id_kategori"
                :items="selectKategoriBerita"
                :error="errors.id_kategori ? true : false"
                :error-messages="
                  errors.id_kategori ? errors.id_kategori[0] : ''
                "
                clearable
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="1">
              <v-row>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="fetchKategoriBerita()">
                      <v-icon v-if="isLoadingKategoriBerita"
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
                      @click="setDialogKategoriBeritaModel()"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Tambah</span>
                </v-tooltip>
              </v-row>
            </v-col>
          </v-row>
          <!-- <v-select
                v-if="$route.params.id"
                label="Status Berita"
                v-model="status"
                :items="selectStatus"
                :error="errors.status ? true : false"
                :error-messages="
                  errors.status ? errors.status[0] : ''
                "
                clearable
                outlined
                dense
              ></v-select> -->
          <v-textarea
            label="Meta Tag (optional)"
            hint="beri tanda baca koma ( , ) untuk memisahkan tag"
            v-model="meta_tag"
            :error="errors.meta_tag ? true : false"
            :error-messages="errors.meta_tag ? errors.meta_tag[0] : ''"
            outlined
            dense
          ></v-textarea>
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
    <dialog-kategori-berita
      @update="fetchKategoriBerita()"
    ></dialog-kategori-berita>
  </div>
</template>

<script>
import selectImage from '~/components/select-image.vue'
import DialogKategoriBerita from '~/components/dialog-kategori-berita.vue'
import upload from '~/components/dialog-upload.vue'
import Texteditor from '~/components/texteditor.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dialog: false,
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
      selectStatus: [
        {
          value: '0',
          text: 'Jadikan Draft'
        },
        {
          value: '1',
          text: 'Publikasi Berita'
        }
      ],
      form: {
        id: '',
        id_kategori: '',
        tgl_publikasi: '',
        cover_image: '',
        judul: '',
        sinopsis: '',
        isi_berita: '',
        judul_en: '',
        sinopsis_en: '',
        isi_berita_en: '',
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
      isLoadingKategoriBerita: false,
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      }
    }
  },
  mounted() {
    this.fetchKategoriBerita()
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      selectKategoriBerita: state => state.global.items.kategoriBerita
    }),

    id_kategori: {
      get() {
        return this.$store.state.berita.form.id_kategori
      },
      set(value) {
        this.$store.commit('berita/setIdKategori', value)
      }
    },
    meta_tag: {
      get() {
        return this.$store.state.berita.form.meta_tag
      },
      set(value) {
        this.$store.commit('berita/setMetaTag', value)
      }
    },
    status: {
      get() {
        return this.$store.state.berita.form.status
      },
      set(value) {
        this.$store.commit('berita/setStatus', value)
      }
    },
    image: {
      get() {
        return this.$store.state.berita.form.cover_image
      },
      set(value) {
        this.$store.commit('berita/setCoverImage', value)
      }
    }
  },
  methods: {
    fetchKategoriBerita() {
      this.isLoadingKategoriBerita = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'kategori-berita'
        })

        result.finally(() => {
          this.isLoadingKategoriBerita = false
        })
      })
      this.isLoadingKategoriBerita = false
    },
    setDialogKategoriBeritaModel() {
      this.$store.commit('kategoriberita/setModel', true)
    }
  },
  components: {
    DialogKategoriBerita,
    Texteditor,
    upload,
    selectImage
  }
}
</script>

<style lang="stylus" scoped></style>
