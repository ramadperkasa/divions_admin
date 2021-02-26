<template>
  <wizard></wizard>
</template>

<script>
import wizard from '~/components/vacancy/wizard'
export default {
  middleware: 'authenticated',
  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'vacancy')])

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
    this.$store.commit('vacancy/setClearForm')
  },
  components: {
    wizard
  }
}
</script>

<style lang="stylus" scoped></style>
