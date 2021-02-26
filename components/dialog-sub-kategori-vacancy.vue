<template>
  <div>
    <v-dialog v-model="model" scrollable persistent max-width="1000px">
      <v-card>
        <dialog-header :isEdit="false" @close="model = false"></dialog-header>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="10">
              <v-select
                label="Pilih Kategori Vacancy *"
                :items="selectKategoriVacancy"
                :loading="isLoadingKategori"
                :disabled="isLoadingKategori"
                v-model="form.parent_id"
                :error="errors.parent_id ? true : false"
                :error-messages="errors.parent_id ? errors.parent_id[0] : ''"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-row>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="fetchKategori()">
                      <v-icon v-if="isLoadingKategori"
                        >mdi-spin mdi-refresh</v-icon
                      >
                      <v-icon v-else>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>Refresh</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="setDialogKategoriModel()">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Tambah</span>
                </v-tooltip>
              </v-row>
            </v-col>
          </v-row>
          <v-text-field
            label="Nama Sub Kategori Vacancy *"
            v-model="form.nama"
            :error="errors.nama ? true : false"
            :error-messages="errors.nama ? errors.nama[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-if="Array.isArray($store.state.app.lang)"
            label="Nama Sub Kategori Vacancy en"
            v-model="form.nama_en"
            :hint="$store.state.app.hint"
            :error="errors.nama_en ? true : false"
            :error-messages="errors.nama_en ? errors.nama_en[0] : ''"
            outlined
            dense
          ></v-text-field>
          <v-textarea
            label="Keterangan"
            v-model="form.keterangan"
            :error="errors.keterangan ? true : false"
            :error-messages="errors.keterangan ? errors.keterangan[0] : ''"
            outlined
            dense
          ></v-textarea>
          <v-textarea
            v-if="Array.isArray($store.state.app.lang)"
            label="Keterangan en"
            v-model="form.keterangan_en"
            :error="errors.keterangan_en ? true : false"
            :error-messages="
              errors.keterangan_en ? errors.keterangan_en[0] : ''
            "
            :hint="$store.state.app.hint"
            outlined
            dense
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="primary"
            class="ma-2"
            :disabled="loading"
            :loading="loading"
            @click="model = false"
            ><v-icon>mdi-arrow-left</v-icon>Kembali</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="ma-2"
            :disabled="loading"
            :loading="loading"
            @click="submit"
          >
            <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan</v-btn
          >
          <v-btn
            color="primary"
            class="ma-2"
            :disabled="loading"
            :loading="loading"
            @click="submitNew"
          >
            <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan Baru
          </v-btn> </v-card-actions
        >\
      </v-card>
    </v-dialog>
    <dialog-kategori-vacancy
      @update="fetchKategori()"
    ></dialog-kategori-vacancy>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DialogKategoriVacancy from '~/components/dialog-kategori-vacancy.vue'

export default {
  data() {
    return {
      form: {
        id: '',
        nama: '',
        keterangan: '',
        ishide: '',
        reorder: ''
      },
      isLoadingKategori: false
    }
  },
  mounted() {
    this.fetchKategori()
  },
  watch: {
    model(newValue) {
      if (newValue == true) {
        this.$store.commit('subKategoriVacancy/setClearForm')
        this.form.nama = ''
        this.form.keterangan = ''
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('subKategoriVacancy/setIsErrors', '')
      }
    }
  },
  methods: {
    ...mapActions('subKategoriVacancy', ['storeData']),
    ...mapMutations('subKategoriVacancy', ['setLoading']),
    submit() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
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
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
        })
      })
    },
    setDialogKategoriModel() {
      this.$store.commit('kategoriVacancy/setModel', true)
    },
    fetchKategori() {
      this.isLoadingKategori = true
      return new Promise((resolve, reject) => {
        var result = this.$store.dispatch('global/getData', {
          nama: 'vacancy-kategori'
        })

        result.finally(() => {
          this.isLoadingKategori = false
        })
      })
      this.isLoadingKategori = false
    },
    submitNew() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
        })
      })
    }
  },
  components: {
    DialogKategoriVacancy
  },
  computed: {
    ...mapState('subKategoriVacancy', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    ...mapState({
      selectKategoriVacancy: state => state.global.items.kategoriVacancy
    }),
    model: {
      get() {
        return this.$store.state.subKategoriVacancy.model
      },
      set(model) {
        this.$store.commit('subKategoriVacancy/setModel', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.subKategoriVacancy.loading
      },
      set(loading) {
        this.$store.commit('subKategoriVacancy/setloading', loading)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
