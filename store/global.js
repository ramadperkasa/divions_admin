export const state = () => ({
  items: {
    folder: [],
    kategoriGallery: [],
    kategoriBerita: [],
    page: [],
    menu: [],
    gallery: [],
    berita: [],
    slider: [],
    brandKategori: [],
    brand: [],
    kategoriVacancy: [],
    subKategoriVacancy: [],
    vacancy: [],
    produkKategori: [],
    produkKategoriBrand: [],
    produk: [],
    settingBeranda: [],
    layout: [],
    brandSettingBeranda: [],
    warna: [],
    product: [],
    brand: [],
    loading: false,
    loadingId: false
  }
})

export const mutations = {
  setItems(state, payload) {
    if (payload.nama == 'folder') {
      state.items.folder = payload.data
    } else if (payload.nama == 'kategori-gallery') {
      state.items.kategoriGallery = payload.data
    } else if (payload.nama == 'halaman') {
      state.items.page = payload.data
    } else if (payload.nama == 'menu') {
      state.items.menu = payload.data
    } else if (payload.nama == 'gallery') {
      state.items.gallery = payload.data
    } else if (payload.nama == 'kategori-berita') {
      state.items.kategoriBerita = payload.data
    } else if (payload.nama == 'berita') {
      state.items.berita = payload.data
    } else if (payload.nama == 'slider') {
      state.items.slider = payload.data
    } else if (payload.nama == 'halamans') {
      state.items.page = payload.data
    } else if (payload.nama == 'brand-kategori') {
      state.items.brandKategori = payload.data
    } else if (payload.nama == 'brand') {
      state.items.brand = payload.data
    } else if (payload.nama == 'vacancy') {
      state.items.vacancy = payload.data
    } else if (payload.nama == 'vacancy-sub-kategori') {
      state.items.subKategoriVacancy = payload.data
    } else if (payload.nama == 'vacancy-kategori') {
      state.items.kategoriVacancy = payload.data
    } else if (payload.nama == 'product') {
      state.items.produk = payload.data
    } else if (payload.nama == 'setting-beranda') {
      state.items.settingBeranda = payload.data
    } else if (payload.nama == 'brand-slider') {
      state.items.slider = payload.data
    } else if (payload.nama == 'brand-setting-beranda') {
      state.items.brandSettingBeranda = payload.data
    } else if (payload.nama == 'product-kategori') {
      state.items.produkKategori = payload.data
    } else if (payload.nama == 'setting-layout') {
      state.items.layout = payload.data
    } else if (payload.nama == 'warna') {
      state.items.warna = payload.data
    } else if (payload.nama == 'produk') {
      state.items.produk = payload.data
    } else if (payload.nama == 'product') {
      state.items.product = payload.data
    } else if (payload.nama == 'brand') {
      state.items.brand = payload.data
    } else if (payload.nama == 'brand-folder') {
      state.items.produkKategoriBrand = payload.data
    }
  },
  setLoading(state, payload) {
    state.loading = payload
  },
  setLoadingId(state, payload) {
    state.loadingId = payload
  }
}

export const actions = {
  getData({ commit, rootState }, payload) {
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          rootState.app.app
            ? '/api/web/' + payload.nama + `/get?brand_id=` + rootState.app.app
            : '/api/web/' + payload.nama + '/get'
        )
        .then(response => {
          commit('setItems', {
            nama: payload.nama,
            data: response.data.data
          })

          resolve()
        })
        .catch(error => {
          commit('setSnackbar', true, {
            root: true
          })
          commit('setText', error.response.status, {
            root: true
          })

          resolve()
        })
        .finally(() => {
          commit('setLoading', false)
        })
    })
  },
  getDataId({ commit, rootState }, payload) {
    commit('setLoadingId', true)
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/api/web/' + payload.nama + '/get-id', {
          id: payload.id,
          brand_id: rootState.app.app ? rootState.app.app : ''
        })
        .then(response => {
          commit('setItems', {
            nama: payload.nama,
            data: response.data.data
          })
          resolve(response.data.data)
          return response.data.data
        })
        .catch(error => {
          commit('setSnackbar', true, {
            root: true
          })
          commit('setText', error.response.status, {
            root: true
          })

          resolve()
        })
        .finally(() => {
          commit('setLoadingId', false)
        })
    })
  }
}
