<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card
        :loading="loading.isloadingFirst"
        :disabled="loading.isloadingFirst"
      >
        <v-toolbar dense flat class="pt-2">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <v-toolbar-title>General Setting</v-toolbar-title>
          <v-spacer></v-spacer>
          <exit @click.native="$router.push('/')"></exit>
        </v-toolbar>

        <v-divider class="mt-4"></v-divider>
        <v-card-text>
          <v-container>
            <v-row v-for="(item, index) in lists" :key="index">
              <v-col cols="3"
                ><span class="subtitle-2 font-weight-bold">{{
                  item ? item.deskripsi : ''
                }}</span></v-col
              >
              <v-col cols="2"> : </v-col>
              <v-col cols="6">
                <component
                  :is="item ? item.type_input : 'div'"
                  :label="item ? item.judul : ''"
                  @change="handleSelect($event, index, item.id)"
                  :items="
                    (item ? item.status_type : '') == 1
                      ? handleString(item)
                      : item
                      ? item.isi
                      : ''
                  "
                  :error="errors.link ? true : false"
                  :error-messages="errors.link ? errors.link[0] : ''"
                  @click="
                    item.status_type == 2 ? handleImage(index, item.id) : false
                  "
                  :value="
                    (item ? item.status_type : '') == 2
                      ? gdata[index]
                        ? gdata[index]['value']
                        : ''
                      : item
                      ? item.isi
                      : ''
                  "
                  outlined
                  clearable
                  hide-details
                  dense
                ></component>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="storeSimpan()"
            :loading="isClick"
            :disabled="isClick"
            ><v-icon left>mdi-content-save-all-outline</v-icon> Simpan
            Setting</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>

    <upload
      v-model="dialog.uploads"
      @upload="value => handleCheckImage(value)"
      :media="true"
      :uploads="true"
      @close="dialog.uploads = false"
    ></upload>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/general/index.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import Reorder from '~/components/reorder.vue'
import Action from '~/components/action.vue'
import selectImage from '~/components/select-image.vue'
import DialogUpload from '~/components/dialog-upload.vue'
import destroy from '~/components/destroy.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'
import upload from '~/components/dialog-upload.vue'

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'General Setting'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'general')])

    return
  },

  data() {
    return {
      gdata: [],
      dialog: {
        uploads: false
      },
      loading: {
        isloadingFirst: false
      },
      valItem: '',
      form: {
        id: '',
        _id: '',
        judul: '',
        isi: '',
        deskripsi: '',
        item: '',
        isedit: '',
        reorder: '',
        status: '',
        keterangan: ''
      },

      process: {
        env: {
          API_URL: process.env.API_URL
        }
      }
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)
    this.fetch()
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
      'setIsClick',
      'setModelDialogItem'
    ]),

    ...mapActions(['getData', 'storeData']),

    storeSimpan() {
      this.setIsClick(true)
      this.storeData(this.gdata)
    },
    fetch() {
      this.loading.isloadingFirst = true
      return new Promise((resolve, reject) => {
        var result = this.getData()
        result
          .then(() => {
            this.lists.forEach(element => {
              let data = {
                id: element.id,
                value: element.isi
              }
              this.gdata.push(data)
            })
          })
          .finally(() => {
            this.loading.isloadingFirst = false
          })
      })
    },

    openImage(item) {
      this.src = process.env.API_URL + item.cover_image
      this.types = item.type
      return new Promise((resolve, reject) => {
        this.setModelDialogItem(true)
      })
    },

    handleSelect(event, index, item) {
      let data = {
        id: item,
        value: event
      }
      this.$set(this.gdata, index, data)
    },

    handleString(item) {
      return item.item.split(',')
    },

    handleImage(index, item) {
      this.dialog.uploads = true
      this.valItem = {
        index: index,
        item: item
      }
    },

    handleCheckImage(value) {
      let data = {
        id: this.valItem.item,
        value: value
      }
      this.$set(this.gdata, this.valItem.index, data)
      this.dialog.uploads = false
    },

    getTag() {
      return eval(this.tag)
    },

    setUploadYoutube(value) {
      this.dialog.upload = false
    }
  },

  watch: {
    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('setIsErrors', '')
      }
    }
    // gdata : {
    //   handler(val){
    //     let param = val.filter(f => { return typeof f.value == 'undefined' });
    //      if(param.length > 0) {
    //        param.forEach(element => {
    //          let index = this.gdata.indexOf(element)
    //          this.$set(this.gdata, index, null)
    //        });
    //      }
    //   },
    //   deep : true
    // }
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
    itemId: {
      get() {
        return typeof this.lists == 'object' ? this.lists : ''
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
    selectImage,
    DialogUpload,
    Action,
    upload
  }
}
</script>
