export const state = () => ({
  step: 1,
  detail: [],
  id_kategori: '',
  image: '',
  images: [],
  judul: ''
})

export const mutations = {
  setStep(state, payload) {
    state.step = payload
  },
  setDetail(state, payload) {
    state.detail = payload
  },
  setKategori(state, payload) {
    state.id_kategori = payload
  },
  setImage(state, payload) {
    state.image = payload
  },
  setImages(state, payload) {
    state.images = payload
  },
  setJudul(state, payload) {
    state.judul = payload
  }
}
