<template>
  <wizard></wizard>
</template>

<script>
import wizard from '~/components/berita/wizard'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  middleware: 'authenticated',
  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'berita')])

    return
  },
  mounted() {
    this.$store.commit('berita/setClearForm')
    this.fetch()
  },
  data () {
    return {
      isLoading: false
    }
  },
  components: {
    wizard
  },
  watch: {
    berita: {
      handler(newValue) {
        this.$store.commit('berita/setId', newValue.id)
        this.$store.commit('berita/setIdKategori', newValue.id_kategori)
        this.$store.commit(
          'berita/setTglPublikasi',
          newValue.tgl_publikasi
        )
        this.$store.commit('berita/setCoverImage', newValue.cover_image)
        this.$store.commit('berita/setJudul', newValue.judul)
        this.$store.commit('berita/setSinopsis', newValue.sinopsis)
        this.$store.commit('berita/setIsiBerita', newValue.isi_berita)
        this.$store.commit('berita/setJudulEn', newValue.judul_en)
        this.$store.commit('berita/setSinopsisEn', newValue.sinopsis_en)
        this.$store.commit(
          'berita/setIsiBeritaEn',
          newValue.isi_berita_en
        )
        this.$store.commit('berita/setKomentar', newValue.komentar)
        this.$store.commit(
          'berita/setKomentarAuto',
          newValue.komentar_auto
        )
        this.$store.commit('berita/setRated', newValue.rated)
        this.$store.commit('berita/setMetaTag', newValue.meta_tag)
        this.$store.commit('berita/setTotalView', newValue.total_view)
        this.$store.commit('berita/setLastView', newValue.last_view)
        this.$store.commit('berita/setIshide', newValue.ishide)
        this.$store.commit('berita/setReorder', newValue.reorder)
        this.$store.commit('berita/setSlug', newValue.slug)
        this.$store.commit('berita/setStatus', 0)
        this.$store.commit('berita/setStep', 1)
        this.konten = newValue.isi_berita
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('global', ['getDataId']),
    fetch() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
      let result = this.getDataId({ nama: 'berita', id: this.$route.params.id })
      
      result.finally(() => {
        this.isLoading = false
      })
      })
    }
  },
  computed: {
    ...mapState({
      berita: state => state.global.items.berita,
      form: state => state.berita.form
    }),
    konten: {
      get() {
        this.$store.state.uploads.value
      },
      set(value) {
        this.$store.commit('upload/setValue', value)
      }
    }
  }
}
</script>
