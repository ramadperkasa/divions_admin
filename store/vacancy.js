export const state = () => ({
  step: 1,
  form: {
    id: '',
    brand: '',
    kategori_vacancy: '',
    kategori_sub_vacancy_id: '',
    tgl_publikasi: '',
    cover_image: '',
    judul: '',
    sinopsis: '',
    isi_berita: '',
    judul_en: '',
    sinopsis_en: '',
    isi_berita_en: '',
    komentar: '',
    komentar_auto: '',
    rated: '',
    meta_tag: '',
    total_view: '',
    last_view: '',
    ishide: '',
    reorder: '',
    slug: '',
    tgl_expired: new Date().toISOString().substr(0, 10),
    edit: ''
  }
})

export const mutations = {
  setClearForm(state) {
    state.form = {
      id: '',
      brand: '',
      kategori_sub_vacancy_id: '',
      kategori_vacancy: '',
      tgl_publikasi: '',
      cover_image: '',
      judul: '',
      sinopsis: '',
      isi_berita: '',
      judul_en: '',
      sinopsis_en: '',
      isi_berita_en: '',
      komentar: '',
      komentar_auto: '',
      rated: '',
      meta_tag: '',
      total_view: '',
      last_view: '',
      tgl_expired: '',
      ishide: '',
      reorder: '',
      slug: ''
    }
  },
  setStep(state, payload) {
    state.step = payload
  },
  setEdit(state, payload) {
    state.form.edit = payload
  },
  setId(state, payload) {
    state.form.id = payload
  },
  setKategoriVacancy(state, payload) {
    state.form.kategori_vacancy = payload
  },
  setKategoriSubVacancy(state, payload) {
    state.form.kategori_sub_vacancy_id = payload
  },
  setTglPublikasi(state, payload) {
    state.form.tgl_publikasi = payload
  },
  setBrandId(state, payload) {
    state.form.brand = payload
  },
  setTglExpired(state, payload) {
    state.form.tgl_expired = payload
  },
  setCoverImage(state, payload) {
    state.form.cover_image = payload
  },
  setJudul(state, payload) {
    state.form.judul = payload
  },
  setSinopsis(state, payload) {
    state.form.sinopsis = payload
  },
  setIsiBerita(state, payload) {
    state.form.isi_berita = payload
  },
  setJudulEn(state, payload) {
    state.form.judul_en = payload
  },
  setSinopsisEn(state, payload) {
    state.form.sinopsis_en = payload
  },
  setIsiBeritaEn(state, payload) {
    state.form.isi_berita_en = payload
  },
  setKomentar(state, payload) {
    state.form.komentar = payload
  },
  setKomentarAuto(state, payload) {
    state.form.komentar_auto = payload
  },
  setRated(state, payload) {
    state.form.rated = payload
  },
  setMetaTag(state, payload) {
    state.form.meta_tag = payload
  },
  setTotalView(state, payload) {
    state.form.total_view = payload
  },
  setLastView(state, payload) {
    state.form.last_view = payload
  },
  setIshide(state, payload) {
    state.form.ishide = payload
  },
  setReorder(state, payload) {
    state.form.reorder = payload
  },
  setSlug(state, payload) {
    state.form.slug = payload
  }
}
