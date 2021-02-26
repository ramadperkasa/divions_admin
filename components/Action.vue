<template>
  <v-btn-toggle dense v-model="toggle_none" rounded>
    <v-tooltip top v-if="edit != undefined && edit !== false">
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="manage('edit-')"
          icon
          v-on="on"
          @click="
            edit.status
              ? $router.push(edit.link)
              : setIsClickEdit({ item, status: true })
          "
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <span>Sunting Data</span>
    </v-tooltip>
    <v-tooltip top v-if="duplicate != undefined && duplicate !== false">
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="manage('edit-')"
          icon
          v-on="on"
          :disabled="$store.state.isLoadingStore"
          :loading="$store.state.isLoadingStore"
          @click="storeData(itemWithoutId)"
        >
          <v-icon>mdi-content-duplicate</v-icon>
        </v-btn>
      </template>
      <span>Duplikat Data</span>
    </v-tooltip>
    <v-tooltip top v-if="hide != undefined && hide !== false">
      <template v-slot:activator="{ on }">
        <v-btn
          small
          v-on="on"
          icon
          v-if="manage('edit-')"
          @click="
            submit(item)
            hideValue == 1 ? (hideValue = 0) : (hideValue = 1)
          "
        >
          <v-icon small v-if="hideValue == 0">mdi-eye-outline</v-icon>
          <v-icon small v-else>mdi-eye-off-outline</v-icon>
        </v-btn>
        <template v-on="on" v-else>
          <v-icon small v-if="hideValue == 0">mdi-eye-outline</v-icon>
          <v-icon small v-else>mdi-eye-off-outline</v-icon>
        </template>
      </template>
      <span v-if="hideValue == 0"> Dimunculkan </span>
      <span v-else> Disembunyikan </span>
    </v-tooltip>
    <v-tooltip top v-if="hideFooter != undefined && hideFooter !== false">
      <template v-slot:activator="{ on }">
        <v-btn
          small
          v-on="on"
          icon
          v-if="manage('edit-')"
          @click="
            submitFooter(item)
            hideValueFooter == 1 ? (hideValueFooter = 0) : (hideValueFooter = 1)
          "
        >
          <v-icon small v-if="hideValueFooter == 0"
            >mdi-table-headers-eye</v-icon
          >
          <v-icon small v-else>mdi-table-headers-eye-off</v-icon>
        </v-btn>
        <template v-on="on" v-else>
          <v-icon small v-if="hideValueFooter == 0"
            >mdi-table-headers-eye</v-icon
          >
          <v-icon small v-else>mdi-table-headers-eye-off</v-icon>
        </template>
      </template>
      <span v-if="hideValueFooter == 0"> Footer Dimunculkan </span>
      <span v-else> Footer Disembunyikan </span>
    </v-tooltip>
    <v-tooltip top v-if="destroy != undefined && destroy !== false">
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="manage('delete-') && !checkChild(item)"
          icon
          v-on="on"
          @click="
            setDialogDestroy({
              id: item.id,
              status: true,
              child: null,
              multiple: false
            })
          "
        >
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
        <v-btn
          v-else-if="manage('delete-') && checkChild(item)"
          icon
          v-on="on"
          @click="
            setDialogDestroy({
              id: item.id,
              status: true,
              child: child,
              multiple: false
            })
          "
        >
          <v-icon>mdi-delete-alert</v-icon>
        </v-btn>
      </template>
      <span v-if="manage('delete-') && !checkChild(item)">Hapus Data</span>
      <span v-else-if="manage('delete-') && checkChild(item)"
        >Hapus Data Bersama Keterkaitan</span
      >
    </v-tooltip>
    <v-tooltip top v-if="viewContent != undefined && viewContent !== false">
      <template v-slot:activator="{ on }">
        <v-btn v-if="manage('read-')" icon v-on="on" @click="dialog = true">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
      <span>Lihat Data</span>
    </v-tooltip>
    <v-tooltip top v-if="viewGallery != undefined && viewGallery !== false">
      <template v-slot:activator="{ on }">
        <v-btn v-if="manage('read-')" icon v-on="on" @click="gallery = true">
          <v-icon>mdi-table-eye</v-icon>
        </v-btn>
      </template>
      <span>Lihat Data</span>
    </v-tooltip>
    <v-tooltip
      top
      v-if="
        (view != undefined && view !== false) ||
          (viewVacancy != undefined && viewVacancy !== false)
      "
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="manage('read-')"
          icon
          v-on="on"
          @click="dialogs.view.model = true"
        >
          <v-icon>mdi-eye-settings</v-icon>
        </v-btn>
      </template>
      <span>Lihat Data</span>
    </v-tooltip>
    <v-tooltip top v-if="postSocmed">
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="manage('read-')"
          :disabled="hideValue != 0 || item.status != 1"
          icon
          v-on="on"
          @click="
            dialogPost = true
            itemPost = item
          "
        >
          <v-icon>mdi-share-all</v-icon>
        </v-btn>
      </template>
      <span>Post To Socmed</span>
    </v-tooltip>
    <slot></slot>
    <v-dialog v-model="dialog" width="60%">
      <v-card>
        <v-card-title primary-title>
          <v-icon left>mdi-eye</v-icon>Lihat Konten
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-html="item[viewContent]"></v-card-text>

        <v-card-actions>
          <small class="error--text">
            *Konten yang ditampilkan disini mungkin tidak sama dengan konten di
            halaman depan
          </small>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="gallery" width="80%" scrollable>
      <v-card>
        <v-card-title primary-title>
          <v-icon left>mdi-table-eye</v-icon>Lihat Gallery
          <v-spacer></v-spacer>
          <v-btn icon @click="gallery = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <video
                width="100%"
                height="100%"
                v-if="item.type_img == 1"
                :src="process.env.API_URL + item.image"
                @click="openImage({ image: item.image, type: 1 })"
                class="grey lighten-2 ma-1 hover--image"
              >
                Browser kamu ga support untuk menjalankan video ini
              </video>
              <v-img
                v-else
                width="100%"
                :src="
                  item.type_img == '0'
                    ? xlarge(process.env.API_URL + item.image)
                    : 'https://img.youtube.com/vi/' + item.image + '/0.jpg'
                "
                height="100%"
                :lazy-src="process.env.API_URL + item.image"
                aspect-ratio="1"
                class="grey lighten-2 hover--image"
                @click="openImage({ image: item.image, type: item.type_img })"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
            <v-col cols="9">
              <v-row>
                <v-col
                  cols="3"
                  v-for="(value, index) in item.detailgallery"
                  :key="index"
                >
                  <video
                    width="100%"
                    height="100%"
                    v-if="value.type_img == 1"
                    :src="process.env.API_URL + value.image"
                    @click="openImage({ image: value.image, type: 1 })"
                    class="grey lighten-2 ma-1 hover--image"
                  >
                    Browser kamu ga support untuk menjalankan video ini
                  </video>

                  <v-img
                    v-else-if="value.type_img == 2"
                    @click="openImage({ image: value.image, type: 2 })"
                    width="100%"
                    height="100%"
                    :src="
                      'https://img.youtube.com/vi/' + value.image + '/0.jpg'
                    "
                    :lazy-src="
                      'https://img.youtube.com/vi/' + value.image + '/0.jpg'
                    "
                    aspect-ratio="1"
                    class="grey lighten-2 hover--image"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>

                  <v-img
                    v-else
                    @click="openImage({ image: value.image, type: 0 })"
                    width="100%"
                    height="100%"
                    :src="large(process.env.API_URL + value.image)"
                    :lazy-src="xsmall(process.env.API_URL + value.image)"
                    aspect-ratio="1"
                    class="grey lighten-2 hover--image"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogs.view.model" width="70%" scrollable>
      <v-card>
        <v-card-title primary-title>
          <v-icon left>mdi-table-eye</v-icon>Lihat
          {{ (viewVacancy != undefined) !== false ? 'Vacancy' : 'Berita' }}
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogs.view.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <video
            width="100%"
            height="475"
            v-if="item.type_img == 1"
            :src="process.env.API_URL + item.cover_image"
          >
            Browser kamu ga support untuk menjalankan video ini
          </video>
          <iframe
            width="100%"
            height="475"
            v-else-if="item.type_img == 2"
            :src="`https://www.youtube.com/embed/` + item.cover_image"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <v-img
            v-else
            :src="xlarge(process.env.API_URL + item.cover_image)"
            :lazy-src="xsmall(process.env.API_URL + item.cover_image)"
            @click="openImage({ image: item.cover_image, type: 0 })"
            width="100%"
            height="475"
            class="grey lighten-2 ma-1 hover--image"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-toolbar flat>
            <v-toolbar-title class="title font-weight-bold">
              {{ item.judul }}
            </v-toolbar-title>
          </v-toolbar>
          <v-toolbar dense flat>
            <v-btn text>
              <v-icon>mdi-folder</v-icon>
              {{ item.kategori ? item.kategori.nama : '' }}
            </v-btn>

            <v-btn text>
              <v-icon>mdi-calendar</v-icon>
              {{ item.tgl_publikasi }}
            </v-btn>
          </v-toolbar>
          <v-card flat outlined>
            <v-card-title>Sinopsis</v-card-title>
            <v-card-text>{{ item.sinopsis }}</v-card-text>
          </v-card>
          <v-card flat outlined class="mt-3">
            <v-card-title>Konten</v-card-title>
            <v-card-text v-html="item.isi_berita"></v-card-text>
          </v-card>
          <v-card flat outlined class="mt-3">
            <v-card-title>Tags</v-card-title>
            <v-card-text>
              <v-btn
                v-for="(value, index) in item.meta_tag
                  ? item.meta_tag.split(',')
                  : ''"
                :key="index"
                class="mx-1"
                >{{ value }}</v-btn
              >
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
    <post-to-socmed
      v-model="dialogPost"
      :form="itemPost"
      :slugs="itemPost.slug"
      @close="dialogPost = false"
    ></post-to-socmed>
  </v-btn-toggle>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import postToSocmed from '~/components/postToSocmed.vue'
export default {
  props: {
    item: {},
    edit: {},
    destroy: {},
    hide: {},
    hideFooter: {},
    view: {},
    viewContent: {},
    viewGallery: {},
    postSocmed: {},
    viewVacancy: {},
    duplicate: { default: true },
    child: { default: () => [] }
  },
  data() {
    return {
      hideValue: this.item.ishide ? this.item.ishide : '',
      hideValueFooter: this.item.ishide_footer ? this.item.ishide_footer : '',
      dialogs: {
        foto: {
          item: ''
        },
        view: {
          model: ''
        }
      },
      cond: false,
      itemPost: '',
      dialogPost: false,
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      },
      dialog: false,
      toggle_none: null,
      gallery: ''
    }
  },
  components: {
    postToSocmed
  },
  methods: {
    ...mapMutations([
      'setDialogDestroy',
      'setIsClickEdit',
      'setModelDialogItem'
    ]),
    ...mapActions(['ishide', 'ishideFooter', 'storeData']),
    checkChild(val) {
      if (this.child ? this.child.length > 0 : false) {
        for (let index = 0; index < this.child.length; index++) {
          if (val[this.child[index]] > 0) {
            return true
          }
        }
        return false
      } else {
        return false
      }
    },
    submit(item) {
      return new Promise((resolve, reject) => {
        var result = this.ishide(item.id)
      })
    },
    submitFooter(item) {
      return new Promise((resolve, reject) => {
        var result = this.ishideFooter(item.id)
      })
    },
    manage(params) {
      if (this.$auth.user.all_permissions != null) {
        var data = this.$auth.user.all_permissions.includes(
          params + this.$route.name
        )
      } else {
        var data = false
      }
      return data
    },
    xsmall(val) {
      let ext = val.split('.').pop()
      let filename = val
        .split('.')
        .slice(0, -1)
        .join('.')

      return filename + '_xsmall' + '.' + ext
    },
    small(val) {
      let ext = val.split('.').pop()
      let filename = val
        .split('.')
        .slice(0, -1)
        .join('.')

      return filename + '_small' + '.' + ext
    },
    medium(val) {
      let ext = val.split('.').pop()
      let filename = val
        .split('.')
        .slice(0, -1)
        .join('.')

      return filename + '_medium' + '.' + ext
    },
    large(val) {
      let ext = val.split('.').pop()
      let filename = val
        .split('.')
        .slice(0, -1)
        .join('.')

      return filename + '_large' + '.' + ext
    },
    xlarge(val) {
      let ext = val.split('.').pop()
      let filename = val
        .split('.')
        .slice(0, -1)
        .join('.')

      return filename + '_xlarge' + '.' + ext
    },
    openImage(item) {
      this.src = process.env.API_URL + item.image
      this.types = item.type
      return new Promise((resolve, reject) => {
        this.setModelDialogItem(true)
      })
    }
  },
  computed: {
    ...mapState({
      admin: state => state.admin
    }),
    itemWithoutId: {
      get() {
        var obj = this.item

        delete obj.id

        var id = {
          id: '',
          duplicate: true
        }

        return { ...obj, ...id }
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
    }
  }
}
</script>

<style lang="stylus" scoped></style>
