<template>
  <div>
    <v-dialog
      v-model="model"
      scrollable
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <dialog-header :isEdit="false" @close="model = false"></dialog-header>
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
          <v-row>
            <v-col cols="12">
              <v-expansion-panels inset multiple tile v-model="panel">
                <v-expansion-panel
                  v-if="$store.state.app.layout.includes('header')"
                >
                  <v-expansion-panel-header>Header</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-col cols="12">
                      <template v-for="(item, index) in form.header.length">
                        <v-row :key="index">
                          <v-col cols="11">
                            <v-row>
                              <v-col cols="8">
                                <v-row>
                                  <v-col cols="10" style="padding:0px">
                                    <v-select
                                      v-model="form.header[index].block_id"
                                      label="Pilih Content"
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
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          v-on="on"
                                          icon
                                          @click="fetchBlock()"
                                        >
                                          <v-icon v-if="isLoadingBlock"
                                            >mdi-spin mdi-refresh</v-icon
                                          >
                                          <v-icon v-else>mdi-refresh</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Refresh</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                      <template v-slot:activator="{ on }">
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
                              <v-col cols="4">
                                <v-select
                                  v-model="form.header[index].col"
                                  :items="selectKolom"
                                  label="Pilih Jumlah Kolom"
                                  clearable
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab
                                  small
                                  color="primary"
                                  outlined
                                  class="mb-4"
                                  v-on="on"
                                  @click="destroyHeader(index)"
                                >
                                  <v-icon>mdi-minus</v-icon>
                                </v-btn>
                              </template>
                              <span>Kurangi Content</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="index + 1 != form.header.length"
                          :key="'div' + index"
                        ></v-divider>
                      </template>

                      <v-btn
                        color="primary"
                        block
                        outlined
                        @click="countHeader()"
                      >
                        <v-icon small left>mdi-plus</v-icon>Tambah Block Header
                      </v-btn>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  v-if="$store.state.app.layout.includes('leftSidebar')"
                >
                  <v-expansion-panel-header
                    >Left Sidebar</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-col cols="12">
                      <template
                        v-for="(item, index) in form.leftSidebar.length"
                      >
                        <v-row :key="index">
                          <v-col cols="11">
                            <v-row>
                              <v-col cols="8">
                                <v-row>
                                  <v-col cols="10" style="padding:0px">
                                    <v-select
                                      v-model="form.leftSidebar[index].block_id"
                                      label="Pilih Content"
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
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          v-on="on"
                                          icon
                                          @click="fetchBlock()"
                                        >
                                          <v-icon v-if="isLoadingBlock"
                                            >mdi-spin mdi-refresh</v-icon
                                          >
                                          <v-icon v-else>mdi-refresh</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Refresh</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                      <template v-slot:activator="{ on }">
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
                              <v-col cols="4">
                                <v-select
                                  v-model="form.leftSidebar[index].col"
                                  :items="selectKolom"
                                  label="Pilih Jumlah Kolom"
                                  clearable
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab
                                  small
                                  color="primary"
                                  outlined
                                  class="mb-4"
                                  v-on="on"
                                  @click="destroyLeftSidebar(index)"
                                >
                                  <v-icon>mdi-minus</v-icon>
                                </v-btn>
                              </template>
                              <span>Kurangi Content</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="index + 1 != form.leftSidebar.length"
                          :key="'div' + index"
                        ></v-divider>
                      </template>

                      <v-btn
                        color="primary"
                        block
                        outlined
                        @click="countLeftSidebar()"
                      >
                        <v-icon small left>mdi-plus</v-icon>Tambah Block Left
                        Sidebar
                      </v-btn>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  v-if="$store.state.app.layout.includes('mainContent')"
                >
                  <v-expansion-panel-header
                    >Main Content</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-col cols="12">
                      <template
                        v-for="(item, index) in form.mainContent.length"
                      >
                        <v-row :key="index">
                          <v-col cols="11">
                            <v-row>
                              <v-col cols="8">
                                <v-row>
                                  <v-col cols="10" style="padding:0px">
                                    <v-select
                                      v-model="form.mainContent[index].block_id"
                                      label="Pilih Content"
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
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          v-on="on"
                                          icon
                                          @click="fetchBlock()"
                                        >
                                          <v-icon v-if="isLoadingBlock"
                                            >mdi-spin mdi-refresh</v-icon
                                          >
                                          <v-icon v-else>mdi-refresh</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Refresh</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                      <template v-slot:activator="{ on }">
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
                              <v-col cols="4">
                                <v-select
                                  v-model="form.mainContent[index].col"
                                  :items="selectKolom"
                                  label="Pilih Jumlah Kolom"
                                  clearable
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab
                                  small
                                  color="primary"
                                  outlined
                                  class="mb-4"
                                  v-on="on"
                                  @click="destroyMainContent(index)"
                                >
                                  <v-icon>mdi-minus</v-icon>
                                </v-btn>
                              </template>
                              <span>Kurangi Content</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="index + 1 != form.mainContent.length"
                          :key="'div' + index"
                        ></v-divider>
                      </template>

                      <v-btn
                        color="primary"
                        block
                        outlined
                        @click="countMainContent()"
                      >
                        <v-icon small left>mdi-plus</v-icon>Tambah Block Main
                        Content
                      </v-btn>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  v-if="$store.state.app.layout.includes('rightSidebar')"
                >
                  <v-expansion-panel-header
                    >Right Sidebar</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-col cols="12">
                      <template
                        v-for="(item, index) in form.rightSidebar.length"
                      >
                        <v-row :key="index">
                          <v-col cols="11">
                            <v-row>
                              <v-col cols="8">
                                <v-row>
                                  <v-col cols="10" style="padding:0px">
                                    <v-select
                                      v-model="
                                        form.rightSidebar[index].block_id
                                      "
                                      label="Pilih Content"
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
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          v-on="on"
                                          icon
                                          @click="fetchBlock()"
                                        >
                                          <v-icon v-if="isLoadingBlock"
                                            >mdi-spin mdi-refresh</v-icon
                                          >
                                          <v-icon v-else>mdi-refresh</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Refresh</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                      <template v-slot:activator="{ on }">
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
                              <v-col cols="4">
                                <v-select
                                  v-model="form.rightSidebar[index].col"
                                  :items="selectKolom"
                                  label="Pilih Jumlah Kolom"
                                  clearable
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab
                                  small
                                  color="primary"
                                  outlined
                                  class="mb-4"
                                  v-on="on"
                                  @click="destroyRightSidebar(index)"
                                >
                                  <v-icon>mdi-minus</v-icon>
                                </v-btn>
                              </template>
                              <span>Kurangi Content</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="index + 1 != form.rightSidebar.length"
                          :key="'div' + index"
                        ></v-divider>
                      </template>

                      <v-btn
                        color="primary"
                        block
                        outlined
                        @click="countRightSidebar()"
                      >
                        <v-icon small left>mdi-plus</v-icon>Tambah Block Right
                        Sidebar
                      </v-btn>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  v-if="$store.state.app.layout.includes('footer')"
                >
                  <v-expansion-panel-header>Footer</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-col cols="12">
                      <template v-for="(item, index) in form.footer.length">
                        <v-row :key="index">
                          <v-col cols="11">
                            <v-row>
                              <v-col cols="8">
                                <v-row>
                                  <v-col cols="10" style="padding:0px">
                                    <v-select
                                      v-model="form.footer[index].block_id"
                                      label="Pilih Content"
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
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          v-on="on"
                                          icon
                                          @click="fetchBlock()"
                                        >
                                          <v-icon v-if="isLoadingBlock"
                                            >mdi-spin mdi-refresh</v-icon
                                          >
                                          <v-icon v-else>mdi-refresh</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Refresh</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                      <template v-slot:activator="{ on }">
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
                              <v-col cols="4">
                                <v-select
                                  v-model="form.footer[index].col"
                                  :items="selectKolom"
                                  label="Pilih Jumlah Kolom"
                                  clearable
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab
                                  small
                                  color="primary"
                                  outlined
                                  class="mb-4"
                                  v-on="on"
                                  @click="destroyFooter(index)"
                                >
                                  <v-icon>mdi-minus</v-icon>
                                </v-btn>
                              </template>
                              <span>Kurangi Content</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="index + 1 != form.footer.length"
                          :key="'div' + index"
                        ></v-divider>
                      </template>

                      <v-btn
                        color="primary"
                        block
                        outlined
                        @click="countFooter()"
                      >
                        <v-icon small left>mdi-plus</v-icon>Tambah Block Footer
                      </v-btn>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="primary"
            class="ma-2"
            :disabled="loading"
            :loading="loading"
            @click="model = false"
          >
            <v-icon>mdi-arrow-left</v-icon>Kembali</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="ma-2"
            :disabled="loading"
            :loading="loading"
            @click="submit"
          >
            <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan
          </v-btn>
          <v-btn
            color="primary"
            class="ma-2"
            :disabled="loading"
            :loading="loading"
            @click="submitNew"
          >
            <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan Baru
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <dialog-block @update="fetchBlock()"></dialog-block>
  </div>
</template>

<script>
import DialogBlock from '~/components/dialog-block.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      panel: [0, 1, 2, 3, 4],
      dialog: {
        form: {
          model: false,
          item: '',
          loading: false
        },
        alert: {
          model: true,
          item: '',
          loading: false
        }
      },
      selectKolom: [
        {
          text: '1',
          value: '1'
        },
        {
          text: '2',
          value: '2'
        },
        {
          text: '3',
          value: '3'
        },
        {
          text: '4',
          value: '4'
        },
        {
          text: '5',
          value: '5'
        },
        {
          text: '6',
          value: '6'
        },
        {
          text: '7',
          value: '7'
        },
        {
          text: '8',
          value: '8'
        },
        {
          text: '9',
          value: '9'
        },
        {
          text: '10',
          value: '10'
        },
        {
          text: '11',
          value: '11'
        },
        {
          text: '12',
          value: '12'
        }
      ],
      btn_new: true,
      isLoading: false,
      isLoadingBlock: false,
      form: {
        id: '',
        nama: '',
        nama_en: '',
        ishide: '',
        reorder: '',
        header: [
          {
            id: '',
            block_template_id: '',
            block_id: '',

            col: ''
          }
        ],
        rightSidebar: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            col: ''
          }
        ],
        mainContent: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            col: ''
          }
        ],
        leftSidebar: [
          {
            id: '',
            block_template_id: '',
            block_id: '',

            col: ''
          }
        ],
        footer: [
          {
            id: '',
            block_template_id: '',
            block_id: '',

            col: ''
          }
        ],
        newStore: true
      }
    }
  },
  mounted() {
    this.fetchBlock()
  },
  methods: {
    ...mapActions('settinglayout', ['storeData']),
    ...mapMutations('settinglayout', ['setLoading']),
    clearForm() {
      this.form = {
        id: '',
        nama: '',
        nama_en: '',
        ishide: '',
        reorder: '',
        header: [
          {
            id: '',
            block_template_id: '',
            block_id: '',

            col: ''
          }
        ],
        rightSidebar: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            col: ''
          }
        ],
        mainContent: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            col: ''
          }
        ],
        leftSidebar: [
          {
            id: '',
            block_template_id: '',
            block_id: '',

            col: ''
          }
        ],
        footer: [
          {
            id: '',
            block_template_id: '',
            block_id: '',

            col: ''
          }
        ],
        newStore: true
      }
    },
    submit() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          this.clearForm()
          this.$emit('update')
          this.model = false
        })
      })
    },
    submitNew() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          this.clearForm()
          this.$emit('update')
        })
      })
    },
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
    countHeader() {
      this.form.header.push({
        id: '',
        block_template_id: '',
        block_id: '',

        col: ''
      })
    },
    destroyHeader(item) {
      this.form.header.splice(item, 1)
    },
    countLeftSidebar() {
      this.form.leftSidebar.push({
        id: '',
        block_template_id: '',
        block_id: '',

        col: ''
      })
    },
    destroyLeftSidebar(item) {
      this.form.leftSidebar.splice(item, 1)
    },
    countMainContent() {
      this.form.mainContent.push({
        id: '',
        block_template_id: '',
        block_id: '',
        col: ''
      })
    },
    destroyMainContent(item) {
      this.form.mainContent.splice(item, 1)
    },
    countRightSidebar() {
      this.form.rightSidebar.push({
        id: '',
        block_template_id: '',
        block_id: '',
        col: ''
      })
    },
    destroyRightSidebar(item) {
      this.form.rightSidebar.splice(item, 1)
    },
    countFooter() {
      this.form.footer.push({
        id: '',
        block_template_id: '',
        block_id: '',
        col: ''
      })
    },
    destroyFooter(item) {
      this.form.footer.splice(item, 1)
    }
  },
  computed: {
    ...mapState({
      settingBeranda: state => state.global.items.settingBeranda
    }),
    ...mapState('settinglayout', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    model: {
      get() {
        return this.$store.state.settinglayout.model
      },
      set(model) {
        this.$store.commit('settinglayout/setModel', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.settinglayout.loading
      },
      set(loading) {
        this.$store.commit('settinglayout/setloading', loading)
      }
    }
  },
  components: {
    DialogBlock
  }
}
</script>

<style lang="stylus" scoped></style>
