<template>
  <wizard :loading="isloading"></wizard>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import wizard from '~/components/slider/wizard'
export default {
  middleware: 'authenticated',
  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'slider')])

    return
  },
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
      isloading: false
    }
  },
  mounted() {
    this.$store.commit('slider/setClearForm')
    this.fetch()
    this.fetchPage()
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
          this.$store.commit(
            'slider/setBlockTemplateDetailContentId',
            newValue.tipe_link == '3'
              ? newValue.block_template_detail_content_id +
                  ',' +
                  newValue.block_template_detail_id +
                  ',' +
                  newValue.block_template_id
              : null
          )
          this.$store.commit(
            'slider/setTipe',
            newValue.block_template_detail_content_id ? 2 : 1
          )
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
      this.isloading = true
      return new Promise((resolve, reject) => {
        var result = this.getDataId({
          nama: 'slider',
          id: this.$route.params.id
        })
        result.finally(() => {
          this.isloading = false
        })
      })
    },
    fetchPage() {
      this.isloading = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'setting-layout'
        })

        result.finally(() => {
          this.isloading = false
        })
      })
      this.isloading = false
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
