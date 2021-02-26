export const state = () => ({
  model: false,
  lists: [],
  total: 0,
  value: ''
})

export const mutations = {
  setDefault(state, payload) {
    state.model = false
    state.lists = []
    state.total = 0
    state.value = ''
  },
  setModel(state, payload) {
    state.model = payload
  },
  setListData(state, payload) {
    state.lists = []
    state.lists = payload
  },
  setTotal(state, payload) {
    state.total = payload
  },
  setValue(state, payload) {
    state.value = payload
  }
}
export const actions = {
  getData({ commit, state }, payload) {
    commit('setListData', [])

    return new Promise((resolve, reject) => {
      this.$axios
        .get('/api/web/image', {
          params: {
            itemsPerPage: payload.params.itemsPerPage,
            sortBy: [payload.params.field],
            sortDesc: [payload.params.order == 'asc' ? false : true],
            page: payload.params.page,
            folder_id: payload.params.folder_id,
            search: payload.params.search ? payload.params.search : ''
          }
        })
        .then(response => {
          commit('setListData', response.data.data)
          commit('setTotal', response.data.data.total)
          resolve()
        })
    })
  },
  getDataImage({ commit, state }, payload) {
    commit('setListData', [])

    return new Promise((resolve, reject) => {
      this.$axios
        .get('/api/web/image/only', {
          params: {
            itemsPerPage: payload.params.itemsPerPage,
            sortBy: [payload.params.field],
            sortDesc: [payload.params.order == 'asc' ? false : true],
            page: payload.params.page,
            folder_id: payload.params.folder_id,
            search: payload.params.search ? payload.params.search : ''
          }
        })
        .then(response => {
          commit('setListData', response.data.data)
          commit('setTotal', response.data.data.total)
          resolve()
        })
    })
  }
}
