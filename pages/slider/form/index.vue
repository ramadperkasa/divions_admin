<template>
  <wizard></wizard>
</template>

<script>
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
      ]
    }
  },
  mounted() {
    this.$store.commit('slider/setClearForm')
    this.fetchPage()
  },
  components: {
    wizard
  },
  methods: {
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
  }
}
</script>

<style lang="stylus" scoped></style>
