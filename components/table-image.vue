<template>
  <div>
    <video
      width="50"
      height="60"
      v-if="type == 1"
      :src="env + $attrs.value"
      :type="type"
      @click="openImage({ image: $attrs.value, type: type })"
      class="grey lighten-2 ma-1 hover--image"
    >
      Browser kamu ga support untuk menjalankan video ini
    </video>
    <v-img
      :src="
        type == 0
          ? small(env + $attrs.value)
          : type == 2
          ? 'https://img.youtube.com/vi/' + $attrs.value + '/0.jpg'
          : false
      "
      :lazy-src="xsmall(env + $attrs.value)"
      @click="openImage({ image: $attrs.value, type: type })"
      v-else
      aspect-ratio="1"
      height="40"
      width="50"
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: {
    type: {},
    external: { default: false }
  },
  data() {
    return {
      env: this.external === true ? '' : process.env.API_URL
    }
  },
  methods: {
    ...mapMutations(['setModelDialogItem']),

    openImage(item) {
      this.src = process.env.API_URL + item.image
      this.types = item.type
      this.setModelDialogItem(true)
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
    }
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
  }
}
</script>

<style lang="stylus" scoped></style>
