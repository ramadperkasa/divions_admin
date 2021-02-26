<template>
  <div>
    <template v-if="$attrs.value ? support_images.includes($attrs.value.split('.').pop()) : false">
      <video
      :style="$attrs.value ? 'cursor : pointer' : ''"
        width="100%"
        @click="$attrs.value ? openImage({image : $attrs.value, type : 1}) : null"
        :src="process.env.API_URL + $attrs.value"
        class="grey lighten-2 ma-1"
      >Browser kamu ga support untuk menjalankan video ini</video>
    </template>
    <template v-else>
      <iframe
        v-if="$attrs.value ? $attrs.value.length > 0 && $attrs.value.split('.').length < 2 : false"
        width="100%"
        height="100%"
        :src="`https://www.youtube.com/embed/`+ $attrs.value"
        @click="$attrs.value ? openImage({image : $attrs.value, type : 2}) : null"
        frameborder="0"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <v-img
      :style="$attrs.value ? 'cursor : pointer' : ''"
        v-else-if="isEdit == false"
        @click="$attrs.value ? openImage({image : $attrs.value, type : 0}) : null"
        :src="
                  $attrs.value
                    ? large(process.env.API_URL + $attrs.value)
                    : '/no-image.svg'
                "
      ></v-img>
      <v-img
      :style="$attrs.value ? 'cursor : pointer' : ''"
        v-else
        @click="$attrs.value ? openImage({image : $attrs.value, type : 0}) : null"
        :src="
                  $attrs.value
                    ? large(process.env.API_URL + $attrs.value)
                    : '/no-image.svg'
                "
      ></v-img>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: ['isEdit'],
  data() {
    return {
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
      process: {
        env: {
          API_URL: process.env.API_URL
        }
      }
    }
  },
  methods: {
     ...mapMutations([
      'setModelDialogItem'
    ]),
    openImage(item) {      
      this.src = process.env.API_URL + item.image
      this.types = item.type
      return new Promise((resolve, reject) => {
        this.setModelDialogItem(true)
      })
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
  },
  computed: {
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
  },
}
</script>

<style lang="stylus" scoped></style>
