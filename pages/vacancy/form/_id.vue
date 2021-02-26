<template>
  <wizard></wizard>
</template>

<script>
import wizard from '~/components/vacancy/wizard'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  middleware: 'authenticated',
  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'vacancy')])

    return
  },
  data() {
    return {
      isLoading: false
    }
  },
  mounted() {
    this.step = 1
    this.$store.commit('vacancy/setClearForm')
    this.fetch()
  },

  components: {
    wizard
  },
  watch: {
    vacancy: {
      handler(newValue) {
        if (newValue) {
          this.$store.commit('vacancy/setId', newValue.id)
          this.$store.commit(
            'vacancy/setKategoriSubVacancy',
            newValue.kategori_sub_vacancy_id
          )
          this.$store.commit(
            'vacancy/setEdit',
            newValue.kategori_sub_vacancy_id
          )
          this.$store.commit(
            'vacancy/setKategoriVacancy',
            newValue.kategori_sub_vacancy
              ? newValue.kategori_sub_vacancy.parent_id
              : ''
          )
          this.$store.commit('vacancy/setTglPublikasi', newValue.tgl_publikasi)
          this.$store.commit('vacancy/setCoverImage', newValue.cover_image)
          this.$store.commit('vacancy/setJudul', newValue.judul)
          this.$store.commit('vacancy/setTglExpired', newValue.tgl_expired)
          this.$store.commit('vacancy/setBrandId', newValue.brand_id)
          this.$store.commit('vacancy/setSinopsis', newValue.sinopsis)
          this.$store.commit('vacancy/setIsiBerita', newValue.isi_berita)
          this.$store.commit('vacancy/setJudulEn', newValue.judul_en)
          this.$store.commit('vacancy/setSinopsisEn', newValue.sinopsis_en)
          this.$store.commit('vacancy/setIsiBeritaEn', newValue.isi_vacancy_en)
          this.$store.commit('vacancy/setKomentar', newValue.komentar)
          this.$store.commit('vacancy/setKomentarAuto', newValue.komentar_auto)
          this.$store.commit('vacancy/setRated', newValue.rated)
          this.$store.commit('vacancy/setMetaTag', newValue.meta_tag)
          this.$store.commit('vacancy/setTotalView', newValue.total_view)
          this.$store.commit('vacancy/setLastView', newValue.last_view)
          this.$store.commit('vacancy/setIshide', newValue.ishide)
          this.$store.commit('vacancy/setReorder', newValue.reorder)
          this.$store.commit('vacancy/setSlug', newValue.slug)
          this.konten = newValue.isi_vacancy
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('global', ['getDataId']),
    fetch() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        let result = this.getDataId({
          nama: 'vacancy',
          id: this.$route.params.id
        })

        result.finally(() => {
          this.isLoading = false
        })
      })
    }
  },
  computed: {
    ...mapState({
      vacancy: state => state.global.items.vacancy,
      form: state => state.vacancy.form
    }),
    step: {
      get() {
        return this.$store.state.vacancy.step
      },
      set(value) {
        this.$store.commit('vacancy/setStep', value)
      }
    },
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
