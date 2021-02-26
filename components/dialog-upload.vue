<template>
  <div>
    <v-dialog fullscreen v-model="$attrs.value" scrollable persistent>
      <v-card>
        <v-card-title>
          <v-icon>mdi-folder-image</v-icon>Daftar Media
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog(), broadcastNews = []">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-tabs v-model="tab" background-color="primary" centered dark grow icons-and-text>
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1" v-if="media || media == true">
              Pilih Media
              <v-icon>mdi-folder-image</v-icon>
            </v-tab>
            <v-tab href="#tab-2" v-if="youtube || youtube == true">
              Embed Youtube
              <v-icon>mdi-youtube</v-icon>
            </v-tab>
            <v-tab href="#tab-3" v-if="media || media == true">
              Upload Media
              <v-icon>mdi-image-edit</v-icon>
            </v-tab>
            <v-tab href="#tab-4" v-if="news || news == true">
              Pilih Berita
              <v-icon>mdi-newspaper</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1" v-if="media || media == true">
              <v-card outlined>
                <v-card-text>
                  <v-toolbar dense flat>
                    <v-icon class="mr-2">mdi-folder-image</v-icon>
                    <v-toolbar-title>Pilih Jenis Media</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-col cols="2">
                      <v-select
                        v-model="params.type"
                        :items="selectMedia"
                        prepend-icon="mdi-image-search"
                        hide-details
                        clearable
                        placeholder="Pilih jenis Media"
                      >
                        <div slot="no-options">Maaf Folder anda tidak ditemukan.</div>
                      </v-select>
                    </v-col>
                    <v-col cols="3">
                      <v-select
                        v-model="params.folder_id"
                        :items="selectFolder"
                        prepend-icon="mdi-magnify"
                        hide-details
                        clearable
                        placeholder="Pilih Media Berdasarkan Folder"
                      >
                        <div slot="no-options">Maaf Folder anda tidak ditemukan.</div>
                      </v-select>
                    </v-col>
                    <v-col md="3">
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
                        <div class="container-img">
                          <v-checkbox
                            class="ma-0"
                            v-model="images"
                            :value="item.image"
                            hide-details
                            ref="check"
                            style="display:none"
                          />
                          <template v-if="item.type == 1">
                            <video
                              width="100%"
                              height="100%"
                              class="hover--image"
                              :src="
                                process.env.API_URL +
                                  item.image
                              "
                              :type="item.jenis"
                              @click="$refs.check[index].$refs.input.click()"
                            >
                              Browser kamu ga support untuk menjalankan video
                              ini
                            </video>
                            <div
                              class="btn-img"
                              v-if="images.includes(item.image)"
                              @click="$refs.check[index].$refs.input.click()"
                            ></div>
                            <i
                              class="mdi mdi-check-circle icon-img"
                              v-if="images.includes(item.image)"
                              @click="$refs.check[index].$refs.input.click()"
                            ></i>
                          </template>
                          <template v-else>
                            <img
                              :src="
                                 item.type == 0 ?  medium(process.env.API_URL +item.image) : item.type == 2 ? 'https://img.youtube.com/vi/' +item.image+'/0.jpg' : 'https://img.youtube.com/vi/' +item.image+'/0.jpg' 
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
                              @click="images = item.image"
                            >
                              Browser kamu ga support untuk menjalankan video
                              ini
                            </video>
                            <div class="btn-img" v-if="images == item.image" @click="images = ''"></div>

                            <i
                              class="mdi mdi-check-circle icon-img"
                              v-if="images == item.image"
                              @click="images = ''"
                            ></i>
                          </template>
                          <template v-else>
                            <img
                              v-if="item.type == '0'"
                              :src="
                                medium(process.env.API_URL +
                                  item.image)
                              "
                              class="hover--image"
                              alt
                              @click="images = item.image"
                              style="width:223px; height:160px; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; padding:5px;"
                            />


                            <img
                              v-if="item.type == '2'"
                              :src="'https://img.youtube.com/vi/'+item.image+'/0.jpg'"
                              alt
                              class="hover--image"
                              @click="images = item.image"
                              style="width:223px; height:160px; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; padding:5px;"
                            />

                            

                            <div class="btn-img" v-if="images == item.image" @click="images = ''"></div>

                            <i
                              class="mdi mdi-check-circle icon-img"
                              v-if="images == item.image"
                              @click="images = ''"
                            ></i>
                          </template>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row v-else class="fill-height" align-content="center" justify="center">
                      <v-col class="subtitle-1 text-center" cols="12">Mohon Tunggu</v-col>
                      <v-col cols="6">
                        <v-progress-linear
                          color="deep-purple accent-4"
                          indeterminate
                          rounded
                          height="6"
                        ></v-progress-linear>
                      </v-col>
                    </v-row>
                  </template>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="youtube || youtube == true" value="tab-2">
              <v-container grid-list-xs style="padding : 2px">
                <v-row>
                  <v-col cols="11">
                    <v-text-field
                      color="error"
                      solo
                      label="Masukan embed youtube"
                      hide-details
                      v-model="url"
                      prepend-inner-icon="mdi-youtube"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="fill-height mt-1" align-content="center" justify="center">
                    <v-btn @click="generateEmbed()">Generate</v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-container style="height: 375px;">
                <v-row class="fill-height" align-content="center" justify="center">
                  <iframe
                    width="100%"
                    height="100%"
                    :src="`https://www.youtube.com/embed/`+embed"
                    frameborder="0"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item value="tab-3" v-if="media || media == true">
              <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
            </v-tab-item>
            <v-tab-item value="tab-4" v-if="news || news == true">
              <v-card outlined>
                <v-card-text>
                  <v-row v-if="!isLoadingNews">
                    <template v-for="(item,index) in listNews ? listNews.data : ''">
                      <v-col v-if="!multiple" :key="index" cols="3">
                        <v-card style="cursor:pointer">
                          <iframe
                            width="100%"
                            height="200px"
                            v-if="item.type_img == 2"
                            :src="`https://www.youtube.com/embed/`+item.cover_image"
                            frameborder="0"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                          ></iframe>
                          <video
                            height="200px"
                            width="100%"
                            v-else-if="item.type_img == 1"
                            :src="
                                process.env.API_URL +
                                  item.cover_image
                              "
                          >
                            Browser kamu ga support untuk menjalankan video
                            ini
                          </video>
                          <v-img v-else :src="medium(process.env.API_URL+item.cover_image)" height="200px"></v-img>

                          <v-card-title>{{item.judul.length <= 20 ? item.judul : item.judul.substr(0,20) + '...'}}</v-card-title>

                          <v-card-subtitle>Kategori : {{item.kategori ? item.kategori.nama: ''}}</v-card-subtitle>

                          <v-card-actions>
                            <v-btn text color="primary" outlined @click="update(item.id)">
                              <v-icon>mdi-newspaper</v-icon>Pilih Berita
                            </v-btn>

                            <v-spacer></v-spacer>

                            <v-btn icon @click="active(index)">
                              <v-icon>{{ show[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>
                          </v-card-actions>

                          <v-expand-transition>
                            <div v-show="show[index]">
                              <v-divider></v-divider>

                              <v-card-text>{{item.sinopsis}}</v-card-text>
                            </div>
                          </v-expand-transition>
                        </v-card>
                      </v-col>
                      <v-col v-else :key="index" cols="3">
                        <v-card stlye="cursor:pointer">
                          <iframe
                            width="100%"
                            height="200px"
                            v-if="item.type_img == 2"
                            :src="`https://www.youtube.com/embed/`+item.cover_image"
                            frameborder="0"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                          ></iframe>
                          <video
                            height="200px"
                            width="100%"
                            v-else-if="item.type_img == 1"
                            :src="
                                process.env.API_URL +
                                  item.cover_image
                              "
                          >
                            Browser kamu ga support untuk menjalankan video
                            ini
                          </video>
                          <v-img v-else :src="medium(process.env.API_URL+item.cover_image)" height="200px"></v-img>

                          <v-card-title>{{item.judul}}</v-card-title>

                          <v-card-subtitle>Kategori : {{item.kategori ? item.kategori.nama: ''}}</v-card-subtitle>

                          <v-card-actions>
                            <v-checkbox
                              class="ma-0"
                              v-model="broadcastNews"
                              :value="item.id"
                              hide-details
                              ref="broadcastNews"
                              style="display:none"
                            />

                            <v-btn
                              v-if="!broadcastNews.includes(item.id)"
                              text
                              color="primary"
                              outlined
                              @click="$refs.broadcastNews[index].$refs.input.click()"
                            >
                              <v-icon>mdi-newspaper</v-icon>Pilih Berita
                            </v-btn>
                            <v-btn
                              v-else
                              text
                              color="error"
                              outlined
                              @click="$refs.broadcastNews[index].$refs.input.click()"
                            >
                              <v-icon>mdi-close</v-icon>Batal Pilih Berita
                            </v-btn>

                            <v-spacer></v-spacer>

                            <v-btn icon @click="active(index)">
                              <v-icon>{{ show[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>
                          </v-card-actions>

                          <v-expand-transition>
                            <div v-show="show[index]">
                              <v-divider></v-divider>

                              <v-card-text>{{item.sinopsis}}</v-card-text>
                            </div>
                          </v-expand-transition>
                        </v-card>
                      </v-col>
                    </template>
                  </v-row>
                  <v-row v-else class="fill-height" align-content="center" justify="center">
                    <v-col class="subtitle-1 text-center" cols="12">Mohon Tunggu</v-col>
                    <v-col cols="6">
                      <v-progress-linear
                        color="deep-purple accent-4"
                        indeterminate
                        rounded
                        height="6"
                      ></v-progress-linear>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="tab == 'tab-1'">
          <v-pagination class="text--left" v-model="params.page" :length="lists.last_page"></v-pagination>
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" @click="closeDialog()">
            <v-icon left>mdi-exit-to-app</v-icon>Batal
          </v-btn>
          <v-btn outlined color="primary" @click="update(images)">
            <v-icon left>mdi-content-save-outline</v-icon>Pilih Media
          </v-btn>
        </v-card-actions>
        <v-card-actions v-if="tab == 'tab-2'">
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" @click="closeDialog()">
            <v-icon left>mdi-exit-to-app</v-icon>Batal
          </v-btn>
          <v-btn outlined color="primary" @click="condition(embed)">
            <v-icon left>mdi-content-save-outline</v-icon>Pilih Embed Youtube
          </v-btn>
        </v-card-actions>
        <v-card-actions v-if="tab == 'tab-4'">
          <v-spacer></v-spacer>
          <v-pagination v-model="paramsNews.page" :length="listNews.last_page"></v-pagination>
          <v-btn
            v-if="broadcastNews.length > 0 "
            color="primary"
            @click="update(broadcastNews)"
          >Kirim Broadcast</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['imageOnly', 'multiple', 'defaultImage', 'youtube', 'media', 'news','uploads'],
  data() {
    return {
      tab: '',
      loading: false,
      detailLoading: false,
      selectMedia: [
        {
          value: 0,
          text: 'Gambar'
        },
        {
          value: 1,
          text: 'Video'
        },
        {
          value: 2,
          text: 'Youtube'
        },
      ],
      show: [],
      params: {
        order: 'desc',
        field: 'id',
        search: '',
        page: 1,
        itemsPerPage: 24,
        key: 1,
        folder_id: '',
        type: ''
      },
      broadcastNews: [],
      paramsNews: {
        order: 'desc',
        field: 'id',
        search: '',
        page: 1,
        itemsPerPage: 12,
        key: 1,
        folder_id: '',
        type: ''
      },
      isLoadingNews: false,
      file2: '',
      sorting: [
        { value: 'asc', text: 'File Terlama' },
        { value: 'desc', text: 'File Terbaru' }
      ],
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      },
      images: [],
      embed: '',
      url: '',
      dropzoneOptions: {
        url: process.env.API_URL + 'api/web/image/plural',
        thumbnailWidth: 150,
        acceptedFiles: 'image/*,video/*',
        maxFilesize: process.env.MAX_SIZE,
        timeout: 3000000,
        error: function (file, response) {
     file.previewElement.classList.add("dz-error");
     
     },
        headers: {
          'X-CSRF-TOKEN': '[name=csrf-token]'
        },
        dictDefaultMessage:
          '<i class="mdi mdi-cloud-upload-outline"></i> LETAKKAN BERKAS DI MANA SAJA  ATAU KLIK DISINI UNTUK DI UNGGAH <br /><br/> ukuran maksimal unggahan 2mb'
      }
    }
  },

  mounted() {
    if (this.news || this.news == true) {
      this.fetchNews()
    } else {
      this.fetchFolder()
      this.fetch()
    }
  },

  computed: {
    ...mapState({
      selectFolder: state => state.global.items.folder,
      lists: state => state.upload.lists,
      total: state => state.upload.total,
      model: state => state.upload.model,
      listNews: state => state.upload.news,
      total_news: state => state.upload.total_news
    }),
    model: {
      get() {
        return this.$store.state.upload.model
      },
      set(model) {
        this.$store.commit('upload/setModel', model)
      }
    }
  },
  watch: {
    params: {
      handler() {
        this.fetch()
      },
      deep: true
    },
    paramsNews: {
      handler() {
        this.fetchNews()
      },
      deep: true
    },
    "$attrs.value"(val){
      if(val) {
        this.embed = '',
        this.url = ''
      }
    }
  },
  methods: {
    generateEmbed() {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = this.url.match(regExp)

      this.embed = match && match[2].length === 11 ? match[2] : null
    },
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
    fetchNews() {
      this.isLoadingNews = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('upload/getNews', {
          params: this.paramsNews
        })

        result.finally(() => {
          this.isLoadingNews = false
        })
      })
      this.isLoadingNews = false
    },
    xsmall(val){
                let ext = val.split('.').pop();
                let filename = val.split('.').slice(0, -1).join('.')

                return filename + '_xsmall' + '.' + ext
            },
            small(val){
                let ext = val.split('.').pop();
                let filename = val.split('.').slice(0, -1).join('.')

                return filename + '_small' + '.' + ext
            },
            medium(val){
                let ext = val.split('.').pop();
                let filename = val.split('.').slice(0, -1).join('.')

                return filename + '_medium' + '.' + ext
            },
            large(val){
                let ext = val.split('.').pop();
                let filename = val.split('.').slice(0, -1).join('.')

                return filename + '_large' + '.' + ext
            },
            xlarge(val){
                let ext = val.split('.').pop();
                let filename = val.split('.').slice(0, -1).join('.')

                return filename + '_xlarge' + '.' + ext
            },
    active(item) {
      var e = item.toString()
      this.$set(this.show, e, !eval('this.show[' + item + ']'))
    },
    fetch() {
      this.loading = true
      if (this.imageOnly == '' || this.imageOnly == true) {
        return new Promise((resolve, reject) => {
          var result = this.$store.dispatch('upload/getDataImage', {
            params: this.params
          })

          result.finally(() => {
            this.loading = false
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          var result = this.$store.dispatch('upload/getData', {
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
      this.closeDialog()
      this.$emit('upload', image)
      this.images = ''
      this.broadcastNews = []
    },
    closeDialog() {
      this.$emit('close')
    },

    condition(val){
      if(this.uploads){
        this.update({embed : val, type : '2', jenis: 'embed'});
        
      }else{
        this.update(val);
        this.dataUpload()
      }
    },

    dataUpload() {
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('upload/postDataUpload', {
          embed: this.embed
        })
        result.finally(() => {
          this.closeDialog()
        })
      })
    }
  }
}
</script>
