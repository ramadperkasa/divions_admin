export const state = () => ({
  items: {
    provinsi: [],
    kabupaten: [],
    kecamatan: [],
    kelurahan: []
  }
})

export const mutations = {
  setItems(state, payload) {
    if (payload.wilayah == 'provinsi') {
      state.items.provinsi = payload.data
    } else if (payload.wilayah == 'kabupaten') {
      state.items.kabupaten = payload.data
    } else if (payload.wilayah == 'kecamatan') {
      state.items.kecamatan = payload.data
    } else {
      state.items.kelurahan = payload.data
    }
  }
}

export const actions = {
  getDataWilayah({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('api/wilayah-administrasi/' + payload.wilayah + '/get', {
          params: {
            id: payload.id
          }
        })
        .then(response => {
          commit('setItems', {
            wilayah: payload.wilayah,
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
    })
  }
}
