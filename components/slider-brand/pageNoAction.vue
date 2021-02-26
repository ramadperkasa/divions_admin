<template>
  <div>
    <v-row>
      <v-col cols="3">
        <select-image
          v-model="image_url"
          :isEdit="$route.params.id"
        ></select-image>
        <v-btn block text color="info" @click="dialog = true">
          <v-icon left>{{
            $route.params.id ? 'mdi-image-edit' : 'mdi-image-plus'
          }}</v-icon>
          {{ $route.params.id ? 'Edit' : 'Tambah' }} gambar
        </v-btn>
        <small class="error--text" v-if="errors">
          {{ errors.image ? errors.image[0] : '' }}
        </small>
      </v-col>
      <v-col cols="9">
        <v-col>
          <v-text-field
            label="Judul Slider "
            v-model="title"
            :error="errors.title ? true : false"
            :error-messages="errors.title ? errors.title[0] : ''"
            outlined
            :hint="
              $store.state.app.nForEnter
                ? $store.state.app.nForEnterText
                : undefined
            "
            dense
          ></v-text-field>
        </v-col>
      </v-col>
    </v-row>
    <upload
      :media="true"
      v-model="dialog"
      :defaultImage="image_url"
      @upload="value => (image_url = value)"
      @close="dialog = false"
    ></upload>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import selectImage from '~/components/select-image.vue'
import upload from '~/components/dialog-upload-brand.vue'
export default {
  data() {
    return {
      dialog: false
    }
  },
  mounted() {
    this.$store.commit(
      'slider/setSliderAction',
      this.$store.state.app.actionSlider
    )
  },
  computed: {
    ...mapState({
      selectPage: state => state.global.items.page,
      select: state => state.slider.selectBrand,
      errors: state => state.errors
    }),
    title: {
      get() {
        return this.$store.state.slider.form.title
      },
      set(value) {
        this.$store.commit('slider/setTitle', value)
      }
    },
    image_url: {
      get() {
        return this.$store.state.slider.form.image_url
      },
      set(value) {
        this.$store.commit('slider/setImageUrl', value)
      }
    }
  },
  components: {
    upload,
    selectImage
  }
}
</script>

<style lang="stylus" scoped></style>
