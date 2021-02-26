<template>
  <div>
    <v-dialog fullscreen v-model="model" scrollable persistent>
      <v-card>
        <v-card-title>
          <v-icon>mdi-folder-image</v-icon>Daftar Gambar
          <v-spacer></v-spacer>
          <v-btn icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-tabs v-model="tab" background-color="primary" centered dark grow icons-and-text>
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#tab-1">
              Pilih Foto
              <v-icon>mdi-folder-image</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
              Upload Foto
              <v-icon>mdi-image-edit</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <v-card outlined>
                <v-card-text>
                  <v-toolbar dense flat>
                    <v-icon class="mr-2">mdi-folder-image</v-icon>
                    <v-toolbar-title>Pilih Foto</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-col cols="3">
                      <v-select
                        v-model="params.folder_id"
                        :items="selectFolder"
                        prepend-icon="mdi-magnify"
                        hide-details
                        clearable
                        placeholder="Pilih Gambar Berdasarkan Folder"
                      >
                        <div slot="no-options">Maaf Folder anda tidak ditemukan.</div>
                      </v-select>
                    </v-col>
                    <v-col md="4">
                      <template slot="label">Urutkan Berdasarkan</template>
                      <v-select
                        v-model="params.order"
                        :items="sorting"
                        prepend-icon="mdi-filter-menu-outline"
                        hide-details
                        placeholder="Urutkan Berdasarkan"
                      ></v-select>
                    </v-col>
                    <v-col md="1">
                      <v-btn @click="fetch()" :disabled="loading ? true : false" icon>
                        <template v-if="!loading">
                          <v-icon>mdi-refresh</v-icon>
                        </template>
                        <template v-else>
                          <v-icon>mdi-spin mdi-refresh</v-icon>
                        </template>
                      </v-btn>
                    </v-col>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <template v-if="multiple == true">
                    <v-row
                      v-if="
                        Array.isArray(lists.data) ? lists.data.length > 0 : ''
                      "
                    >
                      <v-col cols="2" v-for="(item, index) in lists.data" :key="index">
                        <v-checkbox
                          class="ma-0"
                          v-model="images"
                          :value="item.image"
                          hide-details
                          ref="check"
                        />
                        <div class="container-img">
                          <template v-if="item.type == 1">
                            <video
                              class="hover--image"
                              width="100%"
                              height="100%"
                              @click="$refs.check[index].$refs.input.click()"
                              :src="
                                process.env.API_URL +
                                  item.image
                              "
                              :type="item.jenis"
                            >
                              Browser kamu ga support untuk menjalankan video
                              ini
                            </video>
                            <div
                              @click="$refs.check[index].$refs.input.click()"
                              class="btn-img"
                              v-if="images[index] == item.image"
                            ></div>

                            <i
                              @click="$refs.check[index].$refs.input.click()"
                              class="mdi mdi-check-circle icon-img"
                              v-if="images[index] == item.image"
                            ></i>
                          </template>
                          <template v-else>
                            <img
                              :src="
                                process.env.API_URL +
                                  item.image
                              "
                              class="hover--image"
                              @click="$refs.check[index].$refs.input.click()"
                              alt
                              style="width:223px; height:160px; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; padding:5px;"
                            />
                            <div
                              class="btn-img"
                              @click="$refs.check[index].$refs.input.click()"
                              v-if="images.includes(item.image)"
                            ></div>
                            <i
                              class="mdi mdi-check-circle icon-img"
                              @click="$refs.check[index].$refs.input.click()"
                              v-if="images.includes(item.image)"
                            ></i>
                          </template>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row v-else-if="detailLoading">
                      <v-col cols="2" v-for="item in 12" :key="item">
                        <v-card outlined class="hover--image">
                          <v-card-text style="background-color:#e0e0e0;height:150px;"></v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>

                    <span v-else>Gambar Tidak Ditemukan</span>
                  </template>
                  <template v-else>
                    <v-row
                      v-if="
                        Array.isArray(lists.data) ? lists.data.length > 0 : ''
                      "
                    >
                      <v-col cols="2" v-for="(item, index) in lists.data" :key="index">
                        <div class="container-img">
                          <template v-if="item.type == 1">
                            <video
                              width="100%"
                              height="100%"
                              :src="
                                process.env.API_URL +
                                  item.image
                              "
                              :type="item.jenis"
                              @click="form.image_url = item.image"
                            >
                              Browser kamu ga support untuk menjalankan video
                              ini
                            </video>
                            <div
                              class="btn-img"
                              v-if="form.image_url == item.image"
                              @click="form.image_url = ''"
                            ></div>

                            <i
                              class="mdi mdi-check-circle icon-img"
                              v-if="form.image_url == item.image"
                              @click="form.image_url = ''"
                            ></i>
                          </template>
                          <template v-else>
                            <img
                              :src="
                                process.env.API_URL +
                                  item.image
                              "
                              alt
                              @click="form.image_url = item.image"
                              style="width:223px; height:160px; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; padding:5px;"
                            />
                            <div
                              class="btn-img"
                              v-if="form.image_url == item.image"
                              @click="form.image_url = ''"
                            ></div>

                            <i
                              class="mdi mdi-check-circle icon-img"
                              v-if="form.image_url == item.image"
                              @click="form.image_url = ''"
                            ></i>
                          </template>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row v-else-if="detailLoading">
                      <v-col cols="2" v-for="item in 12" :key="item">
                        <v-card outlined class="hover--image">
                          <v-card-text style="background-color:#e0e0e0;height:150px;"></v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>

                    <span v-else>Gambar Tidak Ditemukan</span>
                  </template>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item value="tab-2">
              <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-pagination class="text--left" v-model="params.page" :length="lists.last_page"></v-pagination>
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" @click="model = false">
            <v-icon left>mdi-exit-to-app</v-icon>Batal
          </v-btn>
          <v-btn
            outlined
            color="primary"
            @click="multiple == true ? updates(images) : update(form.image_url)"
          >
            <v-icon left>mdi-content-save-outline</v-icon>Pilih Gambar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['imageOnly', 'multiple', 'defaultImage', 'defaultImages'],
  data() {
    return {
      tab: '',
      loading: false,
      detailLoading: false,
      params: {
        order: 'desc',
        field: 'id',
        search: '',
        page: 1,
        size: 24,
        key: 1,
        folder_id: ''
      },
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      },
      file2: '',
      sorting: [
        { value: 'asc', text: 'File Terlama' },
        { value: 'desc', text: 'File Terbaru' }
      ],
      form: { image_url: this.defaultImage ? this.defaultImage : '' },
      images: this.defaultImages ? this.defaultImages : [],
      dropzoneOptions: {
        url: process.env.API_URL + 'api/web/image/plural',
        thumbnailWidth: 150,
        acceptedFiles: 'image/*,video/*',
        maxFilesize: 2,
        headers: {
          'X-CSRF-TOKEN': '[name=csrf-token]'
        },
        dictDefaultMessage:
          '<i class="mdi mdi-cloud-upload-outline"></i> LETAKKAN BERKAS DI MANA SAJA  ATAU KLIK DISINI UNTUK DI UNGGAH <br /><br/> ukuran maksimal unggahan 2mb'
      }
    }
  },

  mounted() {
    // this.reload()
    this.fetchFolder()
    this.fetch()
  },

  computed: {
    ...mapState({
      selectFolder: state => state.global.items.folder,
      lists: state => state.uploads.lists,
      total: state => state.uploads.total,
      model: state => state.uploads.model
    }),
    model: {
      get() {
        return this.$store.state.uploads.model
      },
      set(model) {
        this.$store.commit('uploads/setModel', model)
      }
    }
  },
  // mounted () {
  //   this.fetch()
  //   // this.images = []
  //   // this.form.image_url = ''
  // },
  watch: {
    params: {
      handler() {
        this.fetch()
      },
      deep: true
    },
    defaultImage(newValue) {
      this.form.image_url = newValue
    },
    defaultImages(newValue) {
      this.images = newValue
    }
  },
  methods: {
    fetchFolder() {
      this.isLoadingFolder = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'folder'
        })

        result.finally(() => {
          this.isLoadingFolder = false
        })
      })
      this.isLoadingFolder = false
    },
    fetch() {
      this.loading = true
      if (this.imageOnly == '' || this.imageOnly == true) {
        return new Promise((resolve, reject) => {
          var result = this.$store.dispatch('uploads/getDataImage', {
            params: this.params
          })

          result.finally(() => {
            this.loading = false
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          var result = this.$store.dispatch('uploads/getData', {
            params: this.params
          })

          result.finally(() => {
            this.loading = false
          })
        })
      }
      this.loading = false
    },
    update(image) {
      this.model = false
      this.$emit('upload', image)
    },
    updates(image) {
      this.model = false
      this.$emit('upload', { multiple: true, image: image })
    }
  }
}
</script>
