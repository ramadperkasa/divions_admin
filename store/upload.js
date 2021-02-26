export const state = () => ({
  model: false,
  lists: [],
  total: 0,
  news: [],
  total_news: 0,
  value: ''
})

export const mutations = {
  setDefault(state, payload) {
    state.model = false
    state.lists = []
    state.total = 0
    state.lists_news = []
    state.total_news = 0
    state.value = ''
  },
  setModel(state, payload) {
    state.model = payload
  },
  setListData(state, payload) {
    state.lists = []
    state.lists = payload
  },
  setListNews(state, payload) {
    state.news = []
    state.news = payload
  },
  setTotal(state, payload) {
    state.total = payload
  },
  setTotalNews(state, payload) {
    state.total_news = payload
  },
  setValue(state, payload) {
    state.value = payload
  }
}
export const actions = {
  getData({
    commit,
    state
  }, payload) {
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
            search: payload.params.search ? payload.params.search : '',
            type: payload.params.type
          }
        })
        .then(response => {
          commit('setListData', response.data.data)
          commit('setTotal', response.data.data.total)
          resolve()
        })
    })
  },
  getNews({
    commit,
    state
  }, payload) {
    commit('setListNews', [])

    return new Promise((resolve, reject) => {
      this.$axios
        .get('/api/web/berita', {
          params: {
            itemsPerPage: payload.params.itemsPerPage,
            sortBy: [payload.params.field],
            sortDesc: [payload.params.order == 'asc' ? false : true],
            page: payload.params.page,
            search: payload.params.search ? payload.params.search : '',
          }
        })
        .then(response => {
          commit('setListNews', response.data.data)
          commit('setTotalNews', response.data.data.total)
          resolve()
        })
    })
  },
  getDataImage({
    commit,
    state
  }, payload) {
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
  },
  
  postDataUpload({
    commit,
    state
  }, payload) {
    commit('setListData', [])

    return new Promise((resolve, reject) => {
      this.$axios
        .post('/api/web/image/plural', {  
          embed:payload.embed        
        })
        .then(response => {
          commit('setSnackbar', true, { root: true })
            commit('setText', 'Data berhasil dipilih', { root: true })
          resolve()
        })
    })
  },

  test() { 
    return 'oke';
  }
}
