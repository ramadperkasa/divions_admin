export const state = () => ({
  app: '',
  //jika lang inggris memakai array contoh : ['id','lang'], jika indonesia saja maka : id
  lang: 'id',
  hint: 'Form ini digunakan untuk tampilan bahasa inggris',
  //layout terdiri dari : header, leftSidebar, mainContent, rightSidebar, footer
  layout: ['mainContent'],
  actionSlider: true,
  hargaProduk: false,
  postToSocmed: false,
  nForEnter: true,
  nForEnterText: 'Tambah \\n untuk enter atau menambah garis baru',
  urlBrand: false,
  // 'Vacancy \\n untuk memilih kategori brand di careers'
  pilihBrand: false
})

export const mutations = {
  setApp(state, payload) {
    state.app = payload
  },
  setActionSlider(state, payload) {
    state.actionSlider = payload
  }
}
