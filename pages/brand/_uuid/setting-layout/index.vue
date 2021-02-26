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
              <action :item="item" edit destroy>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn small v-on="on" icon @click="active(item)">
                      <v-icon small v-if="item.is_active == 1"
                        >mdi-eye-outline</v-icon
                      >
                      <v-icon small v-else>mdi-eye-off-outline</v-icon>
                    </v-btn>
                  </template>
                  <span v-if="item.is_active == 1"> Aktif </span>
                  <span v-else> Tidak Aktif </span>
                </v-tooltip>
              </action>
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
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-btn-toggle dense rounded>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    icon
                                    @click="
                                      form.header.length == 1
                                        ? confirm(
                                            'Block tidak boleh kurang dari 1'
                                          )
                                        : destroyHeader(index)
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
                                      dialog.reorder.posisi = 0
                                      dialog.reorder.model = true
                                    "
                                  >
                                    {{ form.header[index].reorder }}
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
                                      form.header[index].ishide == 0
                                        ? (form.header[index].ishide = 1)
                                        : (form.header[index].ishide = 0)
                                    "
                                  >
                                    <v-icon
                                      v-if="form.header[index].ishide == 0"
                                      small
                                      >mdi-eye</v-icon
                                    >
                                    <v-icon v-else small color="error"
                                      >mdi-eye-off</v-icon
                                    >
                                  </v-btn>
                                </template>
                                <span>{{
                                  form.header[index].ishide == 0
                                    ? 'Tidak Disembunyikan'
                                    : 'Disembunyikan'
                                }}</span>
                              </v-tooltip>
                            </v-btn-toggle>
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
                        @click="
                          form.header[form.header.length - 1]['block_id'] != ''
                            ? countHeader()
                            : confirm('Content Tidak boleh kosong')
                        "
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
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-btn-toggle dense rounded>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    icon
                                    @click="
                                      form.leftSidebar.length == 1
                                        ? confirm(
                                            'Block tidak boleh kurang dari 1'
                                          )
                                        : destroyLeftSidebar(index)
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
                                      dialog.reorder.posisi = 1
                                      dialog.reorder.model = true
                                    "
                                  >
                                    {{ form.leftSidebar[index].reorder }}
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
                                      form.leftSidebar[index].ishide == 0
                                        ? (form.leftSidebar[index].ishide = 1)
                                        : (form.leftSidebar[index].ishide = 0)
                                    "
                                  >
                                    <v-icon
                                      v-if="form.leftSidebar[index].ishide == 0"
                                      small
                                      >mdi-eye</v-icon
                                    >
                                    <v-icon v-else small color="error"
                                      >mdi-eye-off</v-icon
                                    >
                                  </v-btn>
                                </template>
                                <span>{{
                                  form.leftSidebar[index].ishide == 0
                                    ? 'Tidak Disembunyikan'
                                    : 'Disembunyikan'
                                }}</span>
                              </v-tooltip>
                            </v-btn-toggle>
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
                        @click="
                          form.leftSidebar[form.leftSidebar.length - 1][
                            'block_id'
                          ] != ''
                            ? countLeftSidebar()
                            : confirm('Content Tidak boleh kosong')
                        "
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
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col cols="1" class="d-flex align-center">
                            <v-btn-toggle dense rounded>
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
                            </v-btn-toggle>
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
                        @click="
                          form.mainContent[form.mainContent.length - 1][
                            'block_id'
                          ] != ''
                            ? countMainContent()
                            : confirm('Content Tidak boleh kosong')
                        "
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
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-btn-toggle dense rounded>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    icon
                                    @click="
                                      form.rightSidebar.length == 1
                                        ? confirm(
                                            'Block tidak boleh kurang dari 1'
                                          )
                                        : destroyRightSidebar(index)
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
                                      dialog.reorder.posisi = 3
                                      dialog.reorder.model = true
                                    "
                                  >
                                    {{ form.rightSidebar[index].reorder }}
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
                                      form.rightSidebar[index].ishide == 0
                                        ? (form.rightSidebar[index].ishide = 1)
                                        : (form.rightSidebar[index].ishide = 0)
                                    "
                                  >
                                    <v-icon
                                      v-if="
                                        form.rightSidebar[index].ishide == 0
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
                                  form.rightSidebar[index].ishide == 0
                                    ? 'Tidak Disembunyikan'
                                    : 'Disembunyikan'
                                }}</span>
                              </v-tooltip>
                            </v-btn-toggle>
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
                        @click="
                          form.rightSidebar[form.rightSidebar.length - 1][
                            'block_id'
                          ] != ''
                            ? countRightSidebar()
                            : confirm('Content Tidak boleh kosong')
                        "
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
                                  outlined
                                  dense
                                  hide-details
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="1" class="d-flex align-center">
                            <v-btn-toggle dense rounded>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    icon
                                    @click="
                                      form.footer.length == 1
                                        ? confirm(
                                            'Block tidak boleh kurang dari 1'
                                          )
                                        : destroyFooter(index)
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
                                      dialog.reorder.posisi = 4
                                      dialog.reorder.model = true
                                    "
                                  >
                                    {{ form.footer[index].reorder }}
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
                                      form.footer[index].ishide == 0
                                        ? (form.footer[index].ishide = 1)
                                        : (form.footer[index].ishide = 0)
                                    "
                                  >
                                    <v-icon
                                      v-if="form.footer[index].ishide == 0"
                                      small
                                      >mdi-eye</v-icon
                                    >
                                    <v-icon v-else small color="error"
                                      >mdi-eye-off</v-icon
                                    >
                                  </v-btn>
                                </template>
                                <span>{{
                                  form.footer[index].ishide == 0
                                    ? 'Tidak Disembunyikan'
                                    : 'Disembunyikan'
                                }}</span>
                              </v-tooltip>
                            </v-btn-toggle>
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
                        @click="
                          form.footer[form.footer.length - 1]['block_id'] != ''
                            ? countFooter()
                            : confirm('Content Tidak boleh kosong')
                        "
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
          <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              dark
              @click.native="dialog.reorder.model = false"
              >Urutkan</v-btn
            >
          </v-card-actions> -->
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
  middleware: ['authenticated', 'brand'],
  layout: 'default-brand',
  head() {
    return {
      title: 'Setting Halaman : Setting Layout'
    }
  },

  async fetch({ store }) {
    await Promise.all([store.commit('setUrl', 'brand-setting-layout')])

    return
  },

  data() {
    return {
      panel: [0, 1, 2, 3, 4],
      dialog: {
        form: {
          model: false,
          item: '',
          loading: false
        },
        reorder: {
          model: false,
          posisi: 2,
          index: 0
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
      selectContainer: [
        {
          text: 'Tidak',
          value: '0'
        },
        {
          text: 'Ya',
          value: '1'
        }
      ],
      btn_new: true,
      form: {
        _id: '',
        id: '',
        nama: '',
        is_active: '',
        nama_en: '',
        ishide: '',
        reorder: '',
        header: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            ishide: '',
            reorder: '',
            col: ''
          }
        ],
        rightSidebar: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            ishide: '',
            reorder: '',
            col: ''
          }
        ],
        mainContent: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            ishide: '',
            reorder: '',
            col: ''
          }
        ],
        leftSidebar: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            ishide: '',
            reorder: '',
            col: ''
          }
        ],
        footer: [
          {
            id: '',
            block_template_id: '',
            block_id: '',
            ishide: '',
            reorder: '',
            col: ''
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
          nama: 'brand-setting-beranda'
        })

        result.finally(() => {
          this.isLoadingBlock = false
        })
      })
    },
    active(item) {
      this.$axios
        .post('/api/web/' + this.$store.state.url + '/active', item)
        .then(response => {
          this.fetch()
          this.$store.commit('setSnackbar', true)
          this.$store.commit('setText', 'Data Berhasil di update')
        })
        .catch(error => {
          this.$store.commit('setSnackbar', true)
          this.$store.commit('setText', 'Terjadi Kesalahan')
        })
    },
    countHeader() {
      this.form.header.push({
        id: '',
        block_template_id: '',
        block_id: '',
        ishide: '0',
        reorder:
          eval(
            this.form.header[eval(this.form.mainContent.length - 1)]['reorder']
          ) + 1,
        col: '12'
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
        ishide: '0',
        reorder:
          eval(
            this.form.leftSidebar[eval(this.form.mainContent.length - 1)][
              'reorder'
            ]
          ) + 1,
        col: '12'
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
        ishide: '0',
        reorder:
          eval(
            this.form.mainContent[eval(this.form.mainContent.length - 1)][
              'reorder'
            ]
          ) + 1,
        col: '12'
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
        ishide: '0',
        reorder:
          eval(
            this.form.rightSidebar[eval(this.form.mainContent.length - 1)][
              'reorder'
            ]
          ) + 1,
        col: '12'
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
        ishide: '0',
        reorder:
          eval(
            this.form.footer[eval(this.form.mainContent.length - 1)]['reorder']
          ) + 1,
        col: '12'
      })
    },
    destroyFooter(item) {
      this.form.footer.splice(item, 1)
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
      this.dialog.form.model = true
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
      // this.setStoreDefault()
      this.form.header = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.rightSidebar = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.mainContent = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.leftSidebar = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.footer = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]
      this.isEdit = false
      this.btn_new = true
    },
    clearItem() {
      let self = this
      Object.keys(this.form).forEach(function(key) {
        self.form[key] = ''
      })
      this.form.header = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.rightSidebar = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.mainContent = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.leftSidebar = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]

      this.form.footer = [
        {
          id: '',
          block_template_id: '',
          block_id: '',
          reorder: '1',
          ishide: '0',
          col: '12'
        }
      ]
      this.isEdit = false
      this.btn_new = true
    },
    closeDialog() {
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
        this.form.header = []
        this.form.leftSidebar = []
        this.form.mainContent = []
        this.form.rightSidebar = []
        this.form.footer = []

        this.itemEdit.blok_template_detail.forEach(elem => {
          if (elem.posisi == 0) {
            this.form.header.push({
              id: elem.id,
              block_template_id: elem.block_template_id,
              block_id: elem.block_id,
              col: elem.col,
              reorder: elem.reorder,
              ishide: elem.ishide
            })
          } else {
            this.form.header = [
              {
                id: '',
                block_template_id: '',
                block_id: '',
                reorder: '1',
                ishide: '0',
                col: '12'
              }
            ]
          }
          if (elem.posisi == 1) {
            this.form.rightSidebar.push({
              id: elem.id,
              block_template_id: elem.block_template_id,
              block_id: elem.block_id,
              col: elem.col,
              reorder: elem.reorder,
              ishide: elem.ishide
            })
          } else {
            this.form.rightSidebar = [
              {
                id: '',
                block_template_id: '',
                block_id: '',
                reorder: '1',
                ishide: '0',
                col: '12'
              }
            ]
          }
          if (elem.posisi == 2) {
            this.form.mainContent.push({
              id: elem.id,
              block_template_id: elem.block_template_id,
              block_id: elem.block_id,
              col: elem.col,
              reorder: elem.reorder,
              ishide: elem.ishide
            })
          } else {
            this.form.mainContent = [
              {
                id: '',
                block_template_id: '',
                block_id: '',
                reorder: '1',
                ishide: '0',
                col: '12'
              }
            ]
          }
          if (elem.posisi == 3) {
            this.form.leftSidebar.push({
              id: elem.id,
              block_template_id: elem.block_template_id,
              block_id: elem.block_id,
              col: elem.col,
              reorder: elem.reorder,
              ishide: elem.ishide
            })
          } else {
            this.form.leftSidebar = [
              {
                id: '',
                block_template_id: '',
                block_id: '',
                reorder: '1',
                ishide: '0',
                col: '12'
              }
            ]
          }
          if (elem.posisi == 4) {
            this.form.footer.push({
              id: elem.id,
              block_template_id: elem.block_template_id,
              block_id: elem.block_id,
              col: elem.col,
              reorder: elem.reorder,
              ishide: elem.ishide
            })
          } else {
            this.form.footer = [
              {
                id: '',
                block_template_id: '',
                block_id: '',
                reorder: '1',
                ishide: '0',
                col: '12'
              }
            ]
          }
        })

        this.isEdit = true
        this.btn_new = false
      }
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

    isSuccess(newValue) {
      this.clearItem()
      this.closeDialog()
    },

    isSuccessNew(newValue) {
      let self = this
      this.clearItem()
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
      settingBeranda: state => state.global.items.brandSettingBeranda
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

        if (posisi == 0) {
          return this.form.header[index]['reorder']
        } else if (posisi == 1) {
          return this.form.leftSidebar[index]['reorder']
        } else if (posisi == 2) {
          return this.form.mainContent[index]['reorder']
        } else if (posisi == 3) {
          return this.form.rightSidebar[index]['reorder']
        } else if (posisi == 4) {
          return this.form.footer[index]['reorder']
        } else {
          return false
        }
      },
      set(value) {
        let posisi = this.dialog.reorder.posisi
        let index = this.dialog.reorder.index

        if (posisi == 0) {
          this.form.header[index]['reorder'] = value
        } else if (posisi == 1) {
          this.form.leftSidebar[index]['reorder'] = value
        } else if (posisi == 2) {
          this.form.mainContent[index]['reorder'] = value
        } else if (posisi == 3) {
          this.form.rightSidebar[index]['reorder'] = value
        } else if (posisi == 4) {
          this.form.footer[index]['reorder'] = value
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
