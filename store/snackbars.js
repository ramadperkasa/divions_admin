export const state = () => ({
  snackbar: false,
  text: ""
})

export const mutations = {
  setSnackbar(state, payload) {
    state.snackbar = payload
  },

  setText(state, payload) {
    state.text = ""

    if (payload == 200) {
      state.text = "Data berhasil disimpan"
    } else if (payload == 404) {
      state.text = "Tidak ditemukan"
    } else if (payload == 500) {
      state.text = "Internal server error"
    } else {
      state.text = payload;
    }
  }
}
