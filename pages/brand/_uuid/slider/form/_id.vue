<template>
  <wizard :loading="isLoadingSlider"></wizard>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import wizard from '~/components/slider-brand/wizard'
export default {
  middleware: ['authenticated', 'brand'],
  layout: 'default-brand',
  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'brand-slider')])

    return
  },
  data() {
    return {
      isLoadingSlider: false,
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
      loading: false
    }
  },
  mounted() {
    this.$store.commit('slider/setClearForm')
    this.fetch()
    this.fetchPage()
    this.fetchSlider()
  },
  watch: {
    slider: {
      handler(newValue) {
        if (newValue) {
          if (newValue.tipe_link) {
            this.$store.commit('app/setActionSlider', true)
          } else {
            this.$store.commit('app/setActionSlider', false)
          }
          this.$store.commit('slider/setStep', 1)
          this.$store.commit('slider/setTitle', newValue.title)
          this.$store.commit(
            'slider/setBlockTemplateId',
            eval(newValue.block_template_id)
          )
          this.$store.commit('slider/setTitleSub', newValue.title_sub)
          this.$store.commit('slider/setDescription', newValue.description)
          this.$store.commit('slider/setTarget', newValue.target)
          this.$store.commit('slider/setTipeLink', eval(newValue.tipe_link))
          this.$store.commit('slider/setImageUrl', newValue.image_url)
          this.$store.commit('slider/setUrl', newValue.url)
          this.$store.commit('slider/setLink', newValue.url)
          this.$store.commit('slider/setBeritaId', newValue.berita_id)
          this.$store.commit('slider/setId', newValue.id)
          this.$store.commit('slider/set_Id', newValue._id)
          this.$store.commit('slider/setReorder', newValue.reorder)
          this.$store.commit('slider/setIshide', newValue.ishide)
          this.$store.commit('slider/setProductId', newValue.product_id)
          this.$store.commit('slider/setBrandId', newValue.brand_id)
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('global', ['getDataId']),
    fetch() {
      this.loading = true
      return new Promise((resolve, reject) => {
        var result = this.getDataId({
          nama: 'brand-slider',
          id: this.$route.params.id
        })
        result.finally(() => {
          this.loading = false
        })
      })
    },
    async fetchSlider() {
      this.isLoadingSlider = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getDataId', {
          nama: 'brand-slider',
          id: this.$route.params.id
        })
        result.finally(() => {
          this.isLoadingSlider = false
        })
      })
    },
    fetchPage() {
      this.isLoadingPage = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'setting-layout'
        })

        result.finally(() => {
          this.isLoadingPage = false
        })
      })
      this.isLoadingPage = false
    }
  },
  computed: {
    ...mapState({
      slider: state => state.global.items.slider,
      form: state => state.slider.form
    })
  },
  components: {
    wizard
  }
}
</script>

<style lang="stylus" scoped></style>
