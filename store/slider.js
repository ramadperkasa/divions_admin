export const state = () => ({
  form: {
    _id: '',
    target: '',
    title: '',
    description: '',
    title_sub: '',
    judul: '',
    url: '',
    block_template_detail_content_id: '',
    tipe: '1',
    sub_judul: '',
    deskripsi: '',
    aksi_link: '',
    tipe_link: '',
    tipe_page: '',
    image_url: '',
    block_template_id: '',
    link: '',
    berita_id: '',
    id: '',
    reorder: '',
    sliderAction: '',
    ishide: '',
    product_id: '',
    brand_id: ''
  },
  step: 1,
  select: {
    links: [],
    block: [],
    tipe: [
      {
        value: 1,
        text: 'Membuat Link Baru'
      },
      {
        value: 2,
        text: 'Menggunakan Hastag'
      }
    ],
    target: [
      {
        value: '_blank',
        text: 'Buka Halaman Baru'
      },
      {
        value: '_parent',
        text: 'Ganti Halaman'
      }
    ],

    link: [
      {
        value: 2,
        text: 'External'
      },
      {
        value: 3,
        text: 'Halaman'
      },
      {
        value: 4,
        text: 'Berita'
      },
      {
        value: 5,
        text: 'Produk'
      }
    ],

    internal: [
      {
        value: '/news',
        text: '/news'
      },
      {
        value: '/brand',
        text: '/brand'
      },
      {
        value: '/vacancy',
        text: '/vacancy'
      }
    ]
  },
  selectBrand: {
    target: [
      {
        value: '_blank',
        text: 'Buka Halaman Baru'
      },
      {
        value: '_parent',
        text: 'Ganti Halaman'
      }
    ],

    link: [
      {
        value: 1,
        text: 'Internal'
      },
      {
        value: 2,
        text: 'External'
      },

      {
        value: 4,
        text: 'Berita'
      },
      {
        value: 5,
        text: 'Produk'
      }
    ]
  }
})

export const mutations = {
  setTipe(state, payload) {
    state.form.tipe = payload
  },
  setBlockTemplateDetailContentId(state, payload) {
    state.form.block_template_detail_content_id = payload
  },
  setLink(state, payload) {
    state.form.link = payload
  },
  setHastag(state, payload) {
    state.form.hastag = payload
  },
  setUrl(state, payload) {
    state.form.url = payload
  },
  setAksiLink(state, payload) {
    state.form.aksi_link = payload
  },
  setTitle(state, payload) {
    state.form.title = payload
  },
  setTitleSub(state, payload) {
    state.form.title_sub = payload
  },
  setDescription(state, payload) {
    state.form.description = payload
  },
  setSubJudul(state, payload) {
    state.form.sub_judul = payload
  },
  setSliderAction(state, payload) {
    state.form.sliderAction = payload
  },
  setBlockTemplateId(state, payload) {
    state.form.block_template_id = payload
  },
  setJudul(state, payload) {
    state.form.judul = payload
  },
  setDeskripsi(state, payload) {
    state.form.deskripsi = payload
  },
  setTarget(state, payload) {
    state.form.target = payload
  },
  setTipePage(state, payload) {
    state.form.tipe_page = payload
  },
  setTipeLink(state, payload) {
    state.form.tipe_link = payload
  },
  setImageUrl(state, payload) {
    state.form.image_url = payload
  },
  setStep(state, payload) {
    state.step = payload
  },
  setBeritaId(state, payload) {
    state.form.berita_id = payload
  },
  setIshide(state, payload) {
    state.form.ishide = payload
  },
  setId(state, payload) {
    state.form.id = payload
  },
  set_Id(state, payload) {
    state.form._id = payload
  },
  setReorder(state, payload) {
    state.form.reorder = payload
  },
  setProductId(state, payload) {
    state.form.product_id = payload
  },
  setBrandId(state, payload) {
    state.form.brand_id = payload
  },
  setClearForm(state, payload) {
    state.form = {
      _id: '',
      target: '',
      title: '',
      description: '',
      title_sub: '',
      judul: '',
      url: '',
      block_template_detail_content_id: '',
      tipe: '1',
      sub_judul: '',
      deskripsi: '',
      aksi_link: '',
      tipe_link: '',
      tipe_page: '',
      image_url: '',
      block_template_id: '',
      link: '',
      berita_id: '',
      id: '',
      reorder: '',
      sliderAction: '',
      ishide: '',
      product_id: '',
      brand_id: ''
    }
    state.step = 1
  }
}
