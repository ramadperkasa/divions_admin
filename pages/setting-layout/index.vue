<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-col cols="12">
          <alert-breadcrumb
            page=" Setting Halaman /"
            current_page="Setting Layout"
          ></alert-breadcrumb>
        </v-col>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-cog-transfer</v-icon>
          <v-toolbar-title>Daftar Setting Layout</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <search-data
              v-model="search"
              @search="f => (search = f)"
            ></search-data>
          </v-col>
          <refresh v-model="isLoading" @click="fetch()"></refresh>
          <destroy
            v-model="table.model"
            :item="tableItems"
            @click.native="table.model = !table.model"
          ></destroy>
          <create @click.native="addItem()"></create>
          <exit @click.native="$router.push('/')"></exit>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="lists.data"
            class="elevation-1"
            :server-items-length="total"
            :options.sync="options"
            :search="search"
            :loading="isLoading"
            multi-sort
            loading-text="Memuat data... Harap tunggu sebentar"
            no-data-text="Tidak ada data"
            no-results-text="Data tidak ditemukan"
            :items-per-page="10"
            :show-select="table.model"
            v-model="tableItems"
            :footer-props="footerProps"
          >
            <template v-slot:item.no="{ item }">
              {{ lists.data.indexOf(item) + lists.from }}
            </template>
            <template v-slot:item.ishide="{ item }">
              <ishide :item="item"></ishide>
            </template>
            <template v-slot:item.reorder="props">
              <reorder :props="props"></reorder>
            </template>
            <template v-slot:item.action="{ item }">
              <action :item="item" edit destroy></action>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="dialog.form.model"
      scrollable
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <dialog-header :isEdit="isEdit" @close="closeDialog()"></dialog-header>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            label="Nama Layout *"
            v-model="form.nama"
            :error="errors.nama ? true : false"
            :error-messages="errors.nama ? errors.nama[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-if="Array.isArray($store.state.app.lang)"
            :hint="$store.state.app.hint"
            label="Nama Layout en"
            v-model="form.nama_en"
            :error="errors.nama_en ? true : false"
            :error-messages="errors.nama_en ? errors.nama_en[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-row>
            <v-col cols="12">
              <v-expansion-panels inset multiple tile v-model="panel">
                <v-expansion-panel
                  v-if="$store.state.app.layout.includes('mainContent')"
                >
                  <v-expansion-panel-header
                    >Main Content</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-expansion-panel
                      class="mt-3"
                      v-for="(item, index) in form.mainContent.length"
                      :key="index"
                    >
                      <v-expansion-panel-header
                        >Block ke - {{ index + 1 }}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="5">
                            <v-select
                              v-model="form.mainContent[index].col"
                              label="Jenis Kolom"
                              :items="typeColumn"
                              outlined
                              dense
                              @change="changeTypeColumn($event, index, 2)"
                              hide-details
                            ></v-select
                          ></v-col>
                          <v-col cols="5"
                            ><v-select
                              v-model="form.mainContent[index].isContainer"
                              label="Memakai Wadah"
                              :items="isContainer"
                              outlined
                              dense
                              hide-details
                            ></v-select
                          ></v-col>
                          <v-col cols="2"
                            ><v-btn-toggle dense rounded>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    icon
                                    @click="
                                      form.mainContent.length == 1
                                        ? confirm(
                                            'Block tidak boleh kurang dari 1'
                                          )
                                        : destroyMainContent(index)
                                    "
                                  >
                                    <v-icon small>mdi-playlist-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Kurangi Block</span>
                              </v-tooltip>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    icon
                                    @click="
                                      dialog.reorder.index = index
                                      dialog.reorder.posisi = 2
                                      dialog.reorder.model = true
                                      dialog.reorder.child = false
                                    "
                                  >
                                    {{ form.mainContent[index].reorder }}
                                  </v-btn>
                                </template>
                                <span>Urutkan</span>
                              </v-tooltip>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    icon
                                    @click="
                                      form.mainContent[index].ishide == 0
                                        ? (form.mainContent[index].ishide = 1)
                                        : (form.mainContent[index].ishide = 0)
                                    "
                                  >
                                    <v-icon
                                      v-if="form.mainContent[index].ishide == 0"
                                      small
                                      >mdi-eye</v-icon
                                    >
                                    <v-icon v-else small color="error"
                                      >mdi-eye-off</v-icon
                                    >
                                  </v-btn>
                                </template>
                                <span>{{
                                  form.mainContent[index].ishide == 0
                                    ? 'Tidak Disembunyikan'
                                    : 'Disembunyikan'
                                }}</span>
                              </v-tooltip>
                            </v-btn-toggle></v-col
                          >
                        </v-row>
                        <v-expansion-panel>
                          <v-expansion-panel-header
                            class="light--background-color"
                            >Komponen</v-expansion-panel-header
                          >
                          <v-expansion-panel-content>
                            <v-col cols="12">
                              <template
                                v-for="(value, indexs) in form.mainContent[
                                  index
                                ].komponen.length"
                              >
                                <v-row :key="indexs">
                                  <v-col cols="6">
                                    <v-row>
                                      <v-col cols="12">
                                        <v-row>
                                          <v-col cols="10" style="padding:0px">
                                            <v-select
                                              v-model="
                                                form.mainContent[index][
                                                  'komponen'
                                                ][indexs]['block_id']
                                              "
                                              label="Pilih Komponen"
                                              :items="settingBeranda"
                                              :loading="isLoadingBlock"
                                              :disabled="isLoadingBlock"
                                              outlined
                                              dense
                                              hide-details
                                            ></v-select>
                                          </v-col>
                                          <v-col style="padding:0px" cols="2">
                                            <v-tooltip top>
                                              <template
                                                v-slot:activator="{ on }"
                                              >
                                                <v-btn
                                                  v-on="on"
                                                  icon
                                                  @click="fetchBlock()"
                                                >
                                                  <v-icon v-if="isLoadingBlock"
                                                    >mdi-spin
                                                    mdi-refresh</v-icon
                                                  >
                                                  <v-icon v-else
                                                    >mdi-refresh</v-icon
                                                  >
                                                </v-btn>
                                              </template>
                                              <span>Refresh</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                              <template
                                                v-slot:activator="{ on }"
                                              >
                                                <v-btn
                                                  v-on="on"
                                                  icon
                                                  @click="
                                                    $store.commit(
                                                      'block/setModel',
                                                      true
                                                    )
                                                  "
                                                >
                                                  <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Tambah</span>
                                            </v-tooltip>
                                          </v-col>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="5" class="mt-2">
                                    <v-text-field
                                      label="Nama Hastag "
                                      v-model="
                                        form.mainContent[index]['komponen'][
                                          indexs
                                        ]['hastag']
                                      "
                                      outlined
                                      dense
                                    ></v-text-field>
                                  </v-col>

                                  <v-col cols="1" class="d-flex align-center">
                                    <v-btn-toggle dense rounded>
                                      <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            v-on="on"
                                            icon
                                            @click="
                                              dialog.reorder.index = index
                                              dialog.reorder.child = indexs
                                              dialog.reorder.posisi = 2
                                              dialog.reorder.model = true
                                            "
                                          >
                                            {{
                                              form.mainContent[index][
                                                'komponen'
                                              ][indexs]['reorder']
                                            }}
                                          </v-btn>
                                        </template>
                                        <span>Urutkan</span>
                                      </v-tooltip>
                                      <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            v-on="on"
                                            icon
                                            @click="
                                              form.mainContent[index][
                                                'komponen'
                                              ][indexs]['ishide'] == 0
                                                ? (form.mainContent[index][
                                                    'komponen'
                                                  ][indexs]['ishide'] = 1)
                                                : (form.mainContent[index][
                                                    'komponen'
                                                  ][indexs]['ishide'] = 0)
                                            "
                                          >
                                            <v-icon
                                              v-if="
                                                form.mainContent[index][
                                                  'komponen'
                                                ][indexs]['ishide'] == 0
                                              "
                                              small
                                              >mdi-eye</v-icon
                                            >
                                            <v-icon v-else small color="error"
                                              >mdi-eye-off</v-icon
                                            >
                                          </v-btn>
                                        </template>
                                        <span>{{
                                          form.mainContent[index]['komponen'][
                                            indexs
                                          ]['ishide'] == 0
                                            ? 'Tidak Disembunyikan'
                                            : 'Disembunyikan'
                                        }}</span>
                                      </v-tooltip>
                                    </v-btn-toggle>
                                  </v-col>
                                </v-row>
                                <v-divider
                                  v-if="index + 1 != form.mainContent.length"
                                  :key="'div' + indexs"
                                ></v-divider>
                              </template>
                            </v-col>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-btn
                      color="primary"
                      block
                      outlined
                      class="mt-3"
                      @click="
                        form.mainContent[form.mainContent.length - 1][
                          'komponen'
                        ][0]['block_id'] != ''
                          ? countMainContent()
                          : confirm('Content Tidak boleh kosong')
                      "
                    >
                      <v-icon small left>mdi-plus</v-icon>Tambah Block Main
                      Content
                    </v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <dialog-footer
          @close="dialog.form.model = false"
          :btn_new="btn_new"
        ></dialog-footer>
      </v-card>
    </v-dialog>
    <dialog-block @update="fetchBlock()"></dialog-block>
    <v-layout row justify-center>
      <v-dialog
        v-model="dialog.reorder.model"
        flat
        persistent
        max-width="300px"
      >
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="10">
                <v-text-field
                  label="Urutkan"
                  v-model="setReorder"
                  required
                  type="number"
                  number
                  @keyup.enter="dialog.reorder.model = false"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="d-flex align-center">
                <v-btn icon @click="dialog.reorder.model = false"
                  ><v-icon>mdi-send</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import datatable from '@/datatable/setting-layout/index.json'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
import AlertBreadcrumb from '~/components/alert-breadcrumb.vue'
import Ishide from '~/components/ishide.vue'
import Reorder from '~/components/reorder.vue'
import Action from '~/components/action.vue'
import refresh from '~/components/refresh.vue'
import exit from '~/components/exit.vue'
import create from '~/components/create.vue'
import destroy from '~/components/destroy.vue'
import DialogBlock from '~/components/dialog-block.vue'

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Setting Halaman : Setting Layout'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'setting-layout')])

    return
  },

  data() {
    return {
      panel: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      dialog: {
        form: {
          model: false,
          item: '',
          loading: false
        },
        reorder: {
          model: false,
          posisi: 2,
          index: 0,
          child: false
        },
        alert: {
          model: true,
          item: '',
          loading: false
        }
      },
      isContainer: [
        {
          text: 'Tidak',
          value: '0'
        },
        {
          text: 'Ya',
          value: '1'
        }
      ],
      typeColumn: [
        {
          text: 'Full',
          value: '0'
        },
        {
          text: '1 Block 2 Komponen',
          value: '1'
        },
        {
          text: '1 Block 3 Komponen',
          value: '2'
        },
        {
          text: '1 Block 4 Komponen',
          value: '3'
        },
        {
          text: '1 Block 6 Komponen',
          value: '4'
        },
        {
          text: '1 Block 12 Komponen',
          value: '5'
        }
      ],
      btn_new: true,
      form: {
        id: '',
        nama: '',
        nama_en: '',
        ishide: '0',
        reorder: '1',

        mainContent: [
          {
            id: '',
            block_template_id: '',

            ishide: '0',
            reorder: '1',
            col: '0',
            isContainer: '1',
            komponen: [
              {
                block_id: '',
                hastag: '',
                reorder: '1',
                col: '12',
                ishide: '0'
              }
            ]
          }
        ],

        newStore: true
      },
      isEdit: false,
      table: {
        model: false,
        items: []
      },
      options: {},
      search: '',
      isLoading: false,
      isLoadingBlock: false
    }
  },
  mounted() {
    this.$store.commit('setStoreDefault')
    this.$store.dispatch('getPermission', this.$route.name)
    this.fetchBlock()
  },
  methods: {
    ...mapMutations([
      'setOptions',
      'setDialogDestroys',
      'setCode',
      'setUrl',
      'setSubUrl',
      'setStoreDefault',
      'setIsClickEdit'
    ]),

    ...mapActions(['getData', 'storeData']),
    fetchBlock() {
      this.isLoadingBlock = true
      return new Promise((resolve, reject) => {
        let result = this.$store.dispatch('global/getData', {
          nama: 'setting-beranda'
        })

        result.finally(() => {
          this.isLoadingBlock = false
        })
      })
    },

    countMainContent() {
      this.form.mainContent.push({
        id: '',
        block_template_id: '',

        ishide: '0',
        col: '0',
        isContainer: '1',
        reorder:
          eval(
            this.form.mainContent[eval(this.form.mainContent.length - 1)][
              'reorder'
            ]
          ) + 1,
        col: '0',
        komponen: [
          {
            block_id: '',
            hastag: '',
            reorder: '1',
            col: '12',
            ishide: '0'
          }
        ]
      })
    },
    destroyMainContent(item) {
      this.form.mainContent.splice(item, 1)
    },

    confirm(text) {
      alert(text)
    },
    fetch() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        const { page, itemsPerPage, sortBy, sortDesc } = this.options
        this.setOptions({ page, itemsPerPage, sortBy, sortDesc })

        var result = this.getData(this.search)

        result.finally(() => {
          this.isLoading = false
        })
      })
      this.isLoading = false
    },
    store(data) {
      this.storeData(data)
    },
    addItem() {
      this.dialog.reorder.index = 0
      this.dialog.form.model = true
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
      // this.setStoreDefault()

      this.form.mainContent = [
        {
          id: '',
          block_template_id: '',

          reorder: '1',
          ishide: '0',
          col: '0',
          isContainer: '1',
          komponen: [
            {
              block_id: '',
              hastag: '',
              reorder: '1',
              col: '12',
              ishide: '0'
            }
          ]
        }
      ]

      this.isEdit = false
      this.btn_new = true
    },
    clearItem() {
      this.dialog.reorder.index = 0
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
      // this.setStoreDefault()

      this.form.mainContent = [
        {
          id: '',
          block_template_id: '',

          reorder: '1',
          ishide: '0',
          col: '0',
          isContainer: '1',
          komponen: [
            {
              block_id: '',
              hastag: '',
              reorder: '1',
              col: '12',
              ishide: '0'
            }
          ]
        }
      ]

      this.isEdit = false
      this.btn_new = true
    },
    changeTypeColumn(val, index, posisi) {
      if (posisi == 2) {
        this.form.mainContent[index]['komponen'] = []
        if (val == 0) {
          this.form.mainContent[index].komponen = [
            {
              block_id: '',
              hastag: '',
              reorder: 1,
              col: '12',
              ishide: '0'
            }
          ]
        } else if (val == 1) {
          for (let row = 0; row < 2; row++) {
            this.form.mainContent[index].komponen.push({
              block_id: '',
              hastag: '',
              reorder: row + 1,
              col: '6',
              ishide: '0'
            })
          }
        } else if (val == 2) {
          for (let row = 0; row < 3; row++) {
            this.form.mainContent[index]['komponen'].push({
              block_id: '',
              hastag: '',
              reorder: row + 1,
              col: '4',
              ishide: '0'
            })
          }
        } else if (val == 3) {
          for (let row = 0; row < 4; row++) {
            this.form.mainContent[index]['komponen'].push({
              block_id: '',
              hastag: '',
              reorder: row + 1,
              col: '3',
              ishide: '0'
            })
          }
        } else if (val == 4) {
          for (let row = 0; row < 6; row++) {
            this.form.mainContent[index]['komponen'].push({
              block_id: '',
              hastag: '',
              reorder: row + 1,
              col: '2',
              ishide: '0'
            })
          }
        } else if (val == 5) {
          for (let row = 0; row < 12; row++) {
            this.form.mainContent[index]['komponen'].push({
              block_id: '',
              hastag: '',
              reorder: row + 1,
              col: '1',
              ishide: '0'
            })
          }
        }
      }
    },
    closeDialog() {
      this.dialog.reorder.index = 0
      this.dialog.form.model = false
      this.setIsClickEdit({ item: {}, status: false })
    }
  },

  watch: {
    'dialog.form.model'(val) {
      if (val) {
        this.$store.commit('setIsClickCancel', false)
      }
    },

    options: {
      handler() {
        this.fetch()
      },
      deep: true
    },

    isClick(newValue) {
      if (newValue == true) {
        this.store(this.form)
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.clearItem()
        this.$store.commit('setIsErrors', '')
      }
    },

    isClickEdit(newValue) {
      if (newValue == true) {
        this.dialog.form.model = true

        let self = this
        Object.keys(this.form).forEach(function(key) {
          self.form[key] = self.itemEdit[key]
        })

        this.form.mainContent = []

        let item = 'this.itemEdit.blok_template_detail[index]'
        let komponen =
          "this.itemEdit.blok_template_detail[index]['blok_template_detail_content'][i]"
        for (
          let index = 0;
          index < this.itemEdit.blok_template_detail.length;
          index++
        ) {
          if (eval(item)['posisi'] == 2) {
            this.form.mainContent.push({
              id: eval(item).id,
              block_template_id: eval(item).block_template_id,
              col: eval(item).col,
              reorder: eval(item).reorder,
              ishide: eval(item).ishide,
              isContainer: eval(item).isContainer,
              komponen: []
            })
            if (
              Array.isArray(
                this.itemEdit.blok_template_detail[index][
                  'blok_template_detail_content'
                ]
              )
            ) {
              for (
                let i = 0;
                i <
                this.itemEdit.blok_template_detail[index][
                  'blok_template_detail_content'
                ].length;
                i++
              ) {
                this.form.mainContent[index]['komponen'].push({
                  block_id: eval(eval(komponen)['block_id']),
                  reorder: eval(komponen)['reorder'],
                  col: eval(komponen)['col'],
                  ishide: eval(komponen)['ishide']
                })
              }
            }
          } else {
            this.form.mainContent = [
              {
                id: '',
                block_template_id: '',
                reorder: '1',
                ishide: '0',
                col: '0',
                isContainer: '1',
                komponen: [
                  {
                    block_id: '',
                    hastag: '',
                    reorder: '1',
                    col: '12',
                    ishide: '0'
                  }
                ]
              }
            ]
          }
        }

        this.isEdit = true
        this.btn_new = false
      }
    },

    isSuccess(newValue) {
      this.clearItem()
      this.closeDialog()
    },

    isSuccessNew(newValue) {
      let self = this
      this.clearItem()
    },

    isClickNew(newValue) {
      if (newValue == true) {
        this.form.newStore = true
        this.store(this.form)
      }
    },

    isClickCancel(newValue) {
      if (newValue) {
        this.form.newStore = true
        this.closeDialog()
      }
    },

    search(newValue, oldValue) {
      const { itemPerPage } = this.options
      this.options.page = 1

      this.setOptions({ page: 1, itemPerPage })
      this.getData(newValue)
    }
  },

  computed: {
    ...mapState({
      lists: state => state.lists,
      total: state => state.total,
      errors: state => state.errors,
      itemEdit: state => state.itemEdit,
      isErrors: state => state.isErrors,
      isClickEdit: state => state.isClickEdit,
      isClick: state => state.isClick,
      isClickNew: state => state.isClickNew,
      isClickCancel: state => state.isClickCancel,
      isSuccess: state => state.isSuccess,
      isSuccessNew: state => state.isSuccessNew,
      footerProps: state => state.footerProps,
      settingBeranda: state => state.global.items.settingBeranda
    }),
    tableItems: {
      get() {
        return this.$store.state.tableItems
      },
      set(tableItems) {
        this.$store.commit('setTableItems', tableItems)
      }
    },
    setReorder: {
      get() {
        let posisi = this.dialog.reorder.posisi
        let index = this.dialog.reorder.index
        let child = this.dialog.reorder.child
        if (child === false) {
          if (posisi == 2) {
            return this.form.mainContent[index]['reorder']
          } else {
            return false
          }
        } else {
          if (posisi == 2) {
            return this.form.mainContent[index]['komponen'][child]['reorder']
          } else {
            return false
          }
        }
      },
      set(value) {
        let posisi = this.dialog.reorder.posisi
        let index = this.dialog.reorder.index
        let child = this.dialog.reorder.child

        if (child === false) {
          if (posisi == 2) {
            this.form.mainContent[index]['reorder'] = value
          }
        } else {
          if (posisi == 2) {
            return (this.form.mainContent[index]['komponen'][child][
              'reorder'
            ] = value)
          } else {
            return false
          }
        }
      }
    },

    headers() {
      return datatable['headers']
    }
  },
  components: {
    ButtonCancel,
    ButtonSubmit,
    ButtonSubmitNew,
    AlertBreadcrumb,
    Ishide,
    Reorder,
    Action,
    refresh,
    create,
    exit,
    destroy,
    DialogBlock
  }
}
</script>
