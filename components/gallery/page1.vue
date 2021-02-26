<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-img
          v-if="!$route.params.id"
          :src="
            image
              ? process.env.API_URL + image
              : '/no-image.svg'
          "
        ></v-img>
        <v-img
          v-else
          :src="
            image
              ? process.env.API_URL + image
              : '/no-image.svg'
          "
        ></v-img>
        <v-btn block text color="info" @click="dialogImage = true">
          <v-icon left>mdi-plus</v-icon>Tambah Cover Gallery
        </v-btn>
      </v-col>
      <v-col cols="9">
        <v-text-field
          label="Judul Gallery *"
          v-model="judul"
          :error="errors.judul ? true : false"
          :error-messages="errors.judul ? errors.judul[0] : ''"
          outlined
          dense
        ></v-text-field>
        <v-row>
          <v-col cols="10">
            <v-select
              label="Kategori *"
              :items="selectKategoriGallery"
              v-model="id_kategori"
              :loading="isLoadingKategori"
              :error="errors.id_kategori ? true : false"
              :error-messages="errors.id_kategori ? errors.id_kategori[0] : ''"
              outlined
              clearable
              dense
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-row>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="fetchKategoriGallery()">
                    <v-icon v-if="isLoadingKategori">mdi-spin mdi-refresh</v-icon>
                    <v-icon v-else>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span>Refresh</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="dialogImages = true">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Tambah</span>
              </v-tooltip>
            </v-row>
          </v-col>
        </v-row>
        <v-btn outlined color="primary" @click="dialogUploads()" block>
          <v-icon v-if="images.length == 0">mdi-plus</v-icon>
          {{images.length > 0 ? images.length+' Foto Telah Dipilih' : 'Pilih Foto untuk Gallery'}}
        </v-btn>
      </v-col>
    </v-row>
    <dialog-upload
      v-model="dialogImage"
      @close="dialogImage = false"
      :imageOnly="imageOnly"
      :multiple="multiple"
      :defaultImage="image"
      :defaultImages="images"
      @upload="value => value.multiple ? images = value.image : image = value"
    ></dialog-upload>
    <dialog-upload
      v-model="dialogImages"
      @close="dialogImages = false"
      :imageOnly="imageOnly"
      :multiple="multiple"
      :defaultImage="image"
      :defaultImages="images"
      @upload="value => value.multiple ? images = value.image : image = value"
    ></dialog-upload>
    <dialog-kategori-gallery @update="fetchKategoriGallery()"></dialog-kategori-gallery>
  </div>
</template>

<script>
import DialogUpload from '~/components/dialog-upload.vue'
import dialogKategoriGallery from '~/components/dialog-kategori-gallery.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      dialogImage: false,
      dialogImages: false,
      isLoadingKategori: false,
      imageOnly: false,
      multiple: false
    }
  },
  mounted() {
    this.fetchKategoriGallery()
  },
  methods: {
    setDialogKategoriGalleryModel() {
      this.$store.commit('kategorigallery/setModel', true)
    },
    dialogUpload() {
      this.multiple = false
      this.imageOnly = true
      this.$store.commit('upload/setModel', true)
    },
    dialogUploads() {
      this.multiple = true
      this.imageOnly = false
      this.$store.commit('upload/setModel', true)
    },
    fetchKategoriGallery() {
      this.isLoadingKategori = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'kategori-gallery'
        })

        result.finally(() => {
          this.isLoadingKategori = false
        })
      })
      this.isLoadingKategori = false
    }
  },
  components: {
    'dialog-kategori-gallery': dialogKategoriGallery,
    DialogUpload
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      selectKategoriGallery: state => state.global.items.kategoriGallery
    }),
    image: {
      get() {
        return this.$store.state.gallery.image
      },
      set(value) {
        this.$store.commit('gallery/setImage', value)
      }
    },
    images: {
      get() {
        return this.$store.state.gallery.images
      },
      set(value) {
        this.$store.commit('gallery/setImages', value)
      }
    },
    id_kategori: {
      get() {
        return this.$store.state.gallery.id_kategori
      },
      set(value) {
        this.$store.commit('gallery/setKategori', value)
      }
    },
    judul: {
      get() {
        return this.$store.state.gallery.judul
      },
      set(value) {
        this.$store.commit('gallery/setJudul', value)
      }
    }
  }
}
</script>
